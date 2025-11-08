import request from "supertest";

const BASE_URL = process.env.BASE_URL || "http://localhost:8080";

let loginPayload: any;
let refreshToken: string;
let accessToken: string;
let userPayload: any;
let testUserId: string;
let newAccessToken: string;
let newRefreshToken: string;

beforeAll(async () => {
	userPayload = {
		name: "user test",
		email: "userTest@gmail.com",
		password: "123456",
		type: "dev",
		access: "ativo",
		farms: [],
	};

	const createRes = await request(BASE_URL).post("/user/create").send(userPayload);
	testUserId = createRes.body.user.id;

	loginPayload = {
		email: userPayload.email,
		password: userPayload.password,
	};
});

afterAll(async () => {
	if (testUserId) {
		await request(BASE_URL).delete(`/user/delete/${testUserId}`);
	}
});

describe("Auth API", () => {
	it("deve fazer login com usuário existente", async () => {
		const loginRes = await request(BASE_URL).post("/auth/login").send(loginPayload);
		// console.log("Login Response:", loginRes.body);

        refreshToken = loginRes.body.refreshToken;
        accessToken = loginRes.body.accessToken;

		expect(loginRes.status).toBe(200);
		expect(loginRes.body).toHaveProperty("accessToken");
		expect(loginRes.body).toHaveProperty("refreshToken");
	});

	it("não deve fazer login com senha incorreta", async () => {
		const wrongPasswordPayload = {
			email: loginPayload.email,
			password: "wrongpassword",
		};
		const res = await request(BASE_URL).post("/auth/login").send(wrongPasswordPayload);
		expect([400, 401]).toContain(res.status);
		expect(res.body).toHaveProperty("message");
		expect(res.body.message).toBe("Invalid password");
	});

	it("não deve fazer login com email incorreto", async () => {
		const wrongEmailPayload = {
			email: "ErrouserTest@gmail.com",
			password: loginPayload.password,
		};

		const res = await request(BASE_URL).post("/auth/login").send(wrongEmailPayload);
		expect([400, 401]).toContain(res.status);
		expect(res.body).toHaveProperty("message");
		expect(res.body.message).toBe("Email not found");
	});

    it("deve renovar tokens com refresh token válido", async () => {
        const res = await request(BASE_URL).post("/auth/refresh-token").send({ refreshToken });
        console.log("Refresh Token Response:", res.body);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("Token refreshed successfully");
        expect(res.body).toHaveProperty("data");
        expect(res.body.data).toHaveProperty("accessToken");
        expect(res.body.data).toHaveProperty("refreshToken");
        newAccessToken = res.body.data.accessToken;
        newRefreshToken = res.body.data.refreshToken;
    });

    it("não deve renovar tokens com refresh token inválido", async () => {
        const res = await request(BASE_URL).post("/auth/refresh-token").send({ refreshToken }); // usando o token antigo que já foi usado
        // console.log("Invalid Refresh Token Response:", res.body);

        expect([400, 401]).toContain(res.status);
        expect(res.body).toHaveProperty("success");
        expect(res.body.success).toBe(false);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("Invalid refresh token");
    });

    it("deve fazer logout com refresh token válido", async () => {
        const res = await request(BASE_URL).post("/auth/logout").send({ refreshToken: newRefreshToken });
        // console.log("Logout Response:", res.body);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("Logged out successfully");
    });

    it("deve falhar ao fazer logout com refresh token inválido", async () => {
        const res = await request(BASE_URL).post("/auth/logout").send({ refreshToken: newRefreshToken }); // usando o token já revogado
        // console.log("Invalid Logout Response:", res.body);
        expect([400, 401]).toContain(res.status);
        expect(res.body).toHaveProperty("success");
        expect(res.body.success).toBe(false);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("Invalid refresh token");
    });

});
