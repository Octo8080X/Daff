# Daff
Daff is a json-based database differencing tool that runs on deno.

# Usage


## 1. install

```sh
$ deno install --allow-read --allow-write --allow-net --allow-env https://deno.land/x/daff/main.ts 

```

## 1. Create data for comparison.

```sh
$ deno run --allow-read --allow-write --allow-net --allow-env main.ts diff postgres connec
tion_postgres.json 2023-03-11T00:00:00Z
```

## 2. Create diff.

```sh
$ deno run --allow-read --allow-write --allow-net --allow-env main.ts diff postgres connec
tion_postgres.json 2023-03-11T00:00:00Z
```