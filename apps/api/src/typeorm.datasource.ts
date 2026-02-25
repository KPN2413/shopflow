import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";
import dotenv from "dotenv";


// This file is in apps/api/src, so apps/api is one level up
const BASE_DIR = path.join(process.cwd(), "apps", "api");
dotenv.config({ path: path.resolve(BASE_DIR, ".env") });

function req(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export default new DataSource({
  type: "postgres",
  host: req("DB_HOST"),
  port: Number(req("DB_PORT")),
  username: req("DB_USER"),
  password: req("DB_PASSWORD"),
  database: req("DB_NAME"),
  entities: [path.join(BASE_DIR, "src/**/*.entity{.ts,.js}")],
  migrations: [path.join(BASE_DIR, "src/migrations/*{.ts,.js}")],
  synchronize: false,
});