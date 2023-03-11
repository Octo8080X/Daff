import "https://deno.land/std@0.179.0/dotenv/load.ts";
import { Client } from "https://deno.land/x/mysql@v2.11.0/mod.ts";

// 接続パラメータ
const connectionParam = {
  hostname: Deno.env.get("MYSQL_HOST")!,
  port: Number(Deno.env.get("MYSQL_PORT")!),
  username: Deno.env.get("MYSQL_USER")!,
  password: Deno.env.get("MYSQL_PASSWORD")!,
  db: Deno.env.get("MYSQL_DB")!,
};

// クライアント作成
const client = await new Client().connect(connectionParam);

// データベース作成
await client.execute(`CREATE DATABASE IF NOT EXISTS ??`,[connectionParam.db]);

async function createUsersTable() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
        id int(11) NOT NULL AUTO_INCREMENT,
        name varchar(100) NOT NULL,
        created_at timestamp not null default current_timestamp,
        updated_at timestamp default current_timestamp on update current_timestamp,
        PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  `);
}

async function createItemsTable() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS items (
        id int(11) NOT NULL AUTO_INCREMENT,
        user_id int(11) NOT NULL,
        name varchar(100) NOT NULL,
        created_at timestamp not null default current_timestamp,
        updated_at timestamp default current_timestamp on update current_timestamp,
        PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  `);
}

async function insertUser(name: string) {
  await client.execute(`Insert Into users(name) values(?)`, [name]);
}

async function insertItem(userId: number, name: string) {
  await client.execute(`Insert Into items(user_id, name) values(?, ?)`, [
    userId,
    name,
  ]);
}

async function getUsers() {
  return await client.execute(`select * from users order by created_at DESC`)!;
}

await createUsersTable();
await createItemsTable();

await insertUser("user_name");
await insertUser("user_name");
await insertUser("user_name");

const resultUsers = await getUsers();
const userIds = resultUsers.rows!.map((r) => r.id).slice(0, 3) as number[];

for await (const id of userIds) {
  await insertItem(id, "item_name");
}

console.log(await client.execute(`select * from users`));
console.log(await client.execute(`select * from items`));

await client.close();
