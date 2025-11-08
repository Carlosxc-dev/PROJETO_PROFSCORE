import request from "supertest";

const BASE_URL = process.env.BASE_URL || "http://localhost:8080";

let userPayload: any;
let testUserId: string;

beforeAll(async () => {
	userPayload = {
		name: "user test",
		email: "userTest@gmail.com",
		password: "123456",
		type: "dev",
		access: "ativo",
		farms: [],
	};
});

afterAll(async () => {
	// Limpeza: Deleta o usuário de teste se ainda existir
	if (testUserId) {
		await request(BASE_URL).delete(`/user/delete/${testUserId}`);
	}
});

describe("User API", () => {
	it("deve criar usuário de teste", async () => {
		const createRes = await request(BASE_URL).post("/user/create").send(userPayload);

  it("deve criar usuário de teste", async () => {
    const userPayload = {
      name: "user jest",
      email: "jest-60@gmail.com",
      password: "12394343",
      type: "dev",
      access: "ativo",
      farms: []
    };
		console.log("Create User Response:", createRes.body);

		expect([200, 201]).toContain(createRes.status);
		expect(createRes.body).toHaveProperty("user");
		expect(createRes.body.user).toHaveProperty("id");

		expect(createRes.body.user.name).toBe(userPayload.name);
		expect(createRes.body.user.email).toBe(userPayload.email);
		expect(createRes.body.user.type).toBe(userPayload.type);
		expect(createRes.body.user.access).toBe(userPayload.access);
		expect(createRes.body.user.farms).toEqual(userPayload.farms);

		testUserId = createRes.body.user.id;
	});

	it("não deve permitir criar usuário com email duplicado", async () => {
		// tenta criar duplicado
		const second = await request(BASE_URL).post("/user/create").send(userPayload);

		expect([400, 404]).toContain(second.status);
		expect(second.body).toHaveProperty("message");
		expect(second.body.message).toBe("Email already in use");
	});

	it("deve buscar usuário pelo ID", async () => {
		const userId = testUserId;

		const getByIdRes = await request(BASE_URL).get(`/user/getById/${userId}`);

		expect(getByIdRes.status).toBe(200);
		expect(getByIdRes.body).toHaveProperty("user");
		expect(getByIdRes.body.user.id).toBe(userId);

		expect(getByIdRes.body.user.name).toBe(userPayload.name);
		expect(getByIdRes.body.user.email).toBe(userPayload.email);
		expect(getByIdRes.body.user.type).toBe(userPayload.type);
		expect(getByIdRes.body.user.access).toBe(userPayload.access);
		expect(getByIdRes.body.user.farms).toEqual(userPayload.farms);
	});

	it("deve atualizar usuário de teste", async () => {
		const userId = testUserId;

		const updatePayload = {
			id: userId,
			name: "user update 2",
			password: "12345678",
			type: "client",
			access: "negado",
			farms: [],
		};

		const updateRes = await request(BASE_URL).put("/user/update").send(updatePayload);

		expect([200, 201]).toContain(updateRes.status);
		expect(updateRes.body).toHaveProperty("user");

		expect(updateRes.body.user.id).toBe(userId);
		expect(updateRes.body.user.name).toBe(updatePayload.name);
		expect(updateRes.body.user.email).toBe(userPayload.email); // email não foi alterado
		expect(updateRes.body.user.type).toBe(updatePayload.type);
		expect(updateRes.body.user.access).toBe(updatePayload.access);
		expect(updateRes.body.user.farms).toEqual(updatePayload.farms);
	});

	it("deve deletar usuário de teste", async () => {
		const userId = testUserId;
		const deleteRes = await request(BASE_URL).delete(`/user/delete/${userId}`);
		expect([200, 204]).toContain(deleteRes.status);

		// verifica se foi realmente deletado
		const getByIdRes = await request(BASE_URL).get(`/user/getById/${userId}`);
		expect(getByIdRes.status).toBe(404);
		expect(getByIdRes.body).toHaveProperty("message");
		expect(getByIdRes.body.message).toBe("Id User not found");
	});
});

});

