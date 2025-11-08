// tests/infra/database/postgresConnection.test.ts
import pool from "../../../infrastructure/postgresConnection";

describe("Postgres Connection", () => {
	it("should connect to the database successfully", async () => {
		const client = await pool.connect();
		try {
			const res = await client.query("SELECT 1 AS result");
			expect(res.rows[0].result).toBe(1);
		} finally {
			client.release();
		}
	});

	it("should be able to query the current database", async () => {
		const res = await pool.query("SELECT current_database() AS db");
		expect(res.rows[0].db).toBe("projeto_piloto_dev");
	});
});
