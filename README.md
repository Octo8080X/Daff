# Daff
Daff is a json-based database differencing tool that runs on deno.

# Usage

## 1. install

```sh
$ deno install --allow-read --allow-write --allow-net --allow-env -n daff https://deno.land/x/daff/main.ts
```

## 2. Create data for comparison.

Create a reference file to detect differences.


```sh
$ daff base mysql connection_mysql.json 2023-03-11T00:00:00Z
# or
$ deno run --allow-read --allow-write --allow-net --allow-env main.ts diff mysql connection_postgres.json 2023-03-11T00:00:00Z

Daff start...
INFO connecting mysql:3306
INFO connected to mysql:3306
Create Files ./daff_base.json compared
INFO close connection

```

## 3. Create diff.

After finishing any operation, extract the differences.

```sh
$ daff diff mysql connection_postgres.json 2023-03-11T00:00:00Z
# or
$ deno run --allow-read --allow-write --allow-net --allow-env main.ts diff mysql connection_postgres.json 2023-03-11T00:00:00Z
Daff start...
INFO connecting mysql:3306
INFO connected to mysql:3306
 {
   items: [
     {
       id: 3
       user_id: 3
-      name: "item_name"
+      name: "item_name_update"
       created_at: "2023-03-11T12:08:51.000Z"
       updated_at: "2023-03-11T12:08:51.000Z"
     }
+    {
+      id: 4
+      user_id: 4
+      name: "item_name"
+      created_at: "2023-03-11T12:15:59.000Z"
+      updated_at: "2023-03-11T12:15:59.000Z"
+    }
   ]
   users: [
+    {
+      id: 4
+      name: "user_name"
+      created_at: "2023-03-11T12:15:59.000Z"
+      updated_at: "2023-03-11T12:15:59.000Z"
+    }
   ]
 }

INFO close connection
```