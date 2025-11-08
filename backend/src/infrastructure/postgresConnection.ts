import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const poolDev = new Pool({
	host: process.env.DB_HOST_DEV,
	port: Number(process.env.DB_PORT_DEV),
	user: process.env.DB_USER_DEV,
	password: process.env.DB_PASS_DEV,
	database: process.env.DB_NAME_DEV,
});

const poolProd = new Pool({
	host: process.env.DB_HOST_PROD,
	port: Number(process.env.DB_PORT_PROD),
	user: process.env.DB_USER_PROD,
	password: process.env.DB_PASS_PROD,
	database: process.env.DB_NAME_PROD,
});

const env = process.env.NODE_ENV || "development";
const pool = env === "production" ? poolProd : poolDev;

export default pool;
