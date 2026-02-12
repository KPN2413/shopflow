import "reflect-metadata";
import { DataSource } from "typeorm";
import * as path from "path";
import * as dotenv from "dotenv";

// CommonJS-safe: __dirname exists here when using typeorm-ts-node-commonjs
dotenv.config({ path: path.resolve(__dirname, "../.env") });

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
  entities: [path.join(__dirname, "/**/*.entity{.ts,.js}")],
  migrations: [path.join(__dirname, "/migrations/*{.ts,.js}")],
  synchronize: false,
});
