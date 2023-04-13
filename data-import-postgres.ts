import "https://deno.land/std@0.179.0/dotenv/load.ts";
import postgres from "https://deno.land/x/postgresjs/mod.js";

const connectionParam = {
  host: Deno.env.get("POSTGRES_HOST")!,
  port: Number(Deno.env.get("POSTGRES_PORT")!),
  database: Deno.env.get("POSTGRES_DB")!,
  username: Deno.env.get("POSTGRES_USER")!,
  password: Deno.env.get("POSTGRES_PASSWORD")!,
};

console.log(connectionParam);

const sql = postgres(connectionParam);

try {
  await sql`CREATE DATABASE ${sql(connectionParam.database)}`;
} catch (e) {
  console.error(e);
}

async function createUsersTable() {
  await sql`
   CREATE TABLE IF NOT EXISTS users (
    id serial primary key,
    name text,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  `;
}

async function createItemsTable() {
  await sql`
   CREATE TABLE IF NOT EXISTS items (
    id serial primary key,
    user_id integer NOT NULL,
    name text,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  `;
}

async function createUsersFunction() {
  await sql`DROP FUNCTION IF EXISTS set_users_update_time() CASCADE;`;
  await sql`
    CREATE FUNCTION set_users_update_time() RETURNS trigger AS '
      begin
        new.updated_at := ''now'';
        return new;
      end;
    ' LANGUAGE plpgsql;`;
  await sql`CREATE TRIGGER update_users_trigger BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE set_users_update_time();`;
}

async function createItemsFunction() {
  await sql`DROP FUNCTION IF EXISTS set_items_update_time() CASCADE;`;
  await sql`
    CREATE FUNCTION set_items_update_time() RETURNS trigger AS '
      begin
        new.updated_at := ''now'';
        return new;
      end;
    ' LANGUAGE plpgsql;`;
  await sql`CREATE TRIGGER update_items_trigger BEFORE UPDATE ON items FOR EACH ROW EXECUTE PROCEDURE set_items_update_time();`;
}

async function insertUser(name: string) {
  return await sql`
      insert into users
        (name)
      values
        (${name})
      returning name
    `;
}

async function insertItem(userId: number, name: string) {
  return await sql`
      insert into items
        (
          user_id,
          name
        )
      values
        (${userId}, ${name})
      returning name
    `;
}

async function getUsers() {
  console.log("AA");
  return await sql`select id, name, created_at, updated_at from users order by id`;
}

async function getItems() {
  return await sql`select id, user_id, name, created_at, updated_at from items`;
}

await createUsersTable();
await createItemsTable();

await createUsersFunction();
await createItemsFunction();

await insertUser("user_name");
await insertUser("user_name");
await insertUser("user_name");

const resultUsers = await getUsers();

const userIds = resultUsers.map((r: any) => r.id).slice(0, 3) as number[];

for await (const id of userIds) {
  await insertItem(id, "item_name");
}

console.log(await getUsers());
console.log(await getItems());

await sql.end();
