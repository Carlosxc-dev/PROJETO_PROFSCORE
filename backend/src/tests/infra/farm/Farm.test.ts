// tests/infra/farm/Farm.test.ts
import request from "supertest";

const BASE_URL = process.env.BASE_URL || "http://localhost:8080";

let testUserId: string;
let farmId: string;
let farmPayload: any;
let userPayload: any;

beforeAll(async () => {
	userPayload = {
		name: "user farm test",
		email: "user-farm-test@gmail.com",
		password: "123456",
		type: "dev",
		access: "ativo",
		farms: [],
	};

	const createUserRes = await request(BASE_URL).post("/user/create").send(userPayload);

	testUserId = createUserRes.body.user.id;

	farmPayload = {
		name: "Fazenda Guaicui teste",
		userId: testUserId,
		address: {
			city: "Pirapora",
			state: "Minas Gerais",
		},
		coordinates: {
			longitude: -44.761355,
			latitude: -17.284396,
		},
		license: "62732a23-ad0c-44cd-b2a4-7c848d2128d5",
		feedlots: [],
	};
});

afterAll(async () => {
	// Limpeza: Deleta o usuário de teste se ainda existir
	if (testUserId) {
		await request(BASE_URL).delete(`/user/delete/${testUserId}`);
	}

	// Limpeza: Deleta a fazenda de teste se ainda existir
	if (farmId) {
		await request(BASE_URL).delete("/farm/delete").send({ id: farmId });
	}
});

describe("Farm API", () => {
	it("deve criar uma fazenda", async () => {
		const createRes = await request(BASE_URL).post("/farm/create").send(farmPayload);

        farmId = createRes.body.id;

		console.log("Resposta criação fazenda:", createRes.status, createRes.body);

		expect([200, 201]).toContain(createRes.status);
		expect(createRes.body).toHaveProperty("id");

		expect(createRes.body.name).toBe(farmPayload.name);
		expect(createRes.body.userId).toBe(farmPayload.userId);
		expect(createRes.body.address).toEqual(farmPayload.address);
		expect(createRes.body.coordinates).toEqual(farmPayload.coordinates);
		expect(createRes.body.license).toBe(farmPayload.license);
		expect(createRes.body.feedlots).toEqual(farmPayload.feedlots);

		farmId = createRes.body.id;
	});

	it("deve criar uma fazenda igual a outra e deve dar erro", async () => {
		const farmPayload = {
			name: "Fazenda Guaicui teste",
			userId: testUserId,
			address: {
				city: "Pirapora",
				state: "Minas Gerais",
			},
			coordinates: {
				longitude: -44.761355,
				latitude: -17.284396,
			},
			license: "62732a23-ad0c-44cd-b2a4-7c848d2128d5",
			feedlots: [],
		};

		const createRes = await request(BASE_URL).post("/farm/create").send(farmPayload);

		// console.log("Resposta criação fazenda duplicada:", createRes.status, createRes.body);

		// status deve ser 400 (erro de validação/duplicidade)
		expect(createRes.status).toBe(400);

		// deve ter a propriedade "message" com a mensagem de erro
		expect(createRes.body).toHaveProperty("message");
		expect(createRes.body.message).toBe("Já existe uma fazenda com esse nome");
	});

	it("deve atualizar a primeira fazenda criada", async () => {
		const updatePayload = {
			id: farmId,
			name: "Fazenda Guaicui teste atualizada",
			address: {
				city: "Pirapora",
				state: "Minas Gerais",
			},
			coordinates: {
				longitude: -44.76,
				latitude: -17.283,
			},
			feedlots: [],
		};
		const updateRes = await request(BASE_URL).put("/farm/update").send(updatePayload);
		// console.log("Resposta atualização fazenda:", updateRes.status, updateRes.body);

		expect([200, 201]).toContain(updateRes.status);
		expect(updateRes.body).toHaveProperty("id");
		expect(updateRes.body.name).toBe("Fazenda Guaicui teste atualizada");
		// console.log("Fazenda atualizada:", updateRes.body);
	});

	it("deve listar todas as fazendas e conter a fazenda criada", async () => {
		const getAllRes = await request(BASE_URL).get("/farm/getAll");
		// console.log("Resposta listagem fazendas:", getAllRes.status, getAllRes.body);

		expect(getAllRes.status).toBe(200);
		expect(Array.isArray(getAllRes.body.farms)).toBe(true);
		expect(getAllRes.body.farms.some((f: any) => f.id === farmId)).toBe(true);
		// console.log("Fazendas listadas:", getAllRes.body.farms.map((f: any) => f.name));
	});

	it("deve buscar a fazenda criada pelo ID", async () => {
		const getByIdRes = await request(BASE_URL).get(`/farm/getById/${farmId}`);
		// console.log("Resposta busca fazenda por ID:", getByIdRes.status, getByIdRes.body);
		expect(getByIdRes.status).toBe(200);
		expect(getByIdRes.body).toHaveProperty("id");
		expect(getByIdRes.body.id).toBe(farmId);
		// console.log("Fazenda buscada pelo ID:", getByIdRes.body);
	});

	it("deve buscar o usuário criado e verificar se a fazenda está na lista", async () => {
		const getUserRes = await request(BASE_URL).get(`/user/getById/${testUserId}`);

		// console.log("Resposta busca usuário por ID:", getUserRes.status, getUserRes.body);

		expect(getUserRes.status).toBe(200);
		expect(getUserRes.body).toHaveProperty("user"); // ✅ existe user
		expect(getUserRes.body.user.id).toBe(testUserId);

		expect(Array.isArray(getUserRes.body.user.farms)).toBe(true);
		expect(getUserRes.body.user.farms.includes(farmId)).toBe(true); // ✅ verifica farm na lista

		// console.log("Usuário buscado pelo ID:", getUserRes.body.user);
	});

	it("deve deletar a fazenda criada e verificar que não está mais na lista do usuário", async () => {
		// Deleta a fazenda
		const deleteRes = await request(BASE_URL).delete("/farm/delete").send({ id: farmId }); // id como parâmetro no body
		// console.log("Resposta deleção fazenda:", deleteRes.status, deleteRes.body);
		expect([200, 204]).toContain(deleteRes.status);

		// Verifica se a fazenda foi removida da lista do usuário
		const getUserRes = await request(BASE_URL).get(`/user/getById/${testUserId}`);
		// console.log("Resposta busca usuário após deleção:", getUserRes.status, getUserRes.body);

		expect(getUserRes.status).toBe(200);
		expect(getUserRes.body).toHaveProperty("user");
		expect(getUserRes.body.user.id).toBe(testUserId);

		// ✅ agora a lista de farms não deve conter a fazenda deletada
		expect(Array.isArray(getUserRes.body.user.farms)).toBe(true);
		expect(getUserRes.body.user.farms.includes(farmId)).toBe(false);

		// console.log("Lista de farms do usuário após deleção:", getUserRes.body.user.farms);
	});

	it("Deve criar um usuario com permissão apenas de usuário normal e não deve permitir criar fazenda", async () => {
		// 1️⃣ Cria usuário normal
		const userPayload = {
			name: "usuario normal",
			email: "normal@test.com",
			password: "123456",
			type: "client", // tipo normal
			access: "released",
			farms: [],
		};

		const createUserRes = await request(BASE_URL).post("/user/create").send(userPayload);

		expect([200, 201]).toContain(createUserRes.status);
		const normalUserId = createUserRes.body.user.id;

		// 2️⃣ Tenta criar fazenda com usuário normal
		const farmPayload = {
			name: "Fazenda do usuário normal",
			userId: normalUserId, // ✅ string
			address: { city: "Cidade", state: "Estado" },
			coordinates: { latitude: -10, longitude: -10 },
			license: "abc-123",
			feedlots: [],
		};

		const createFarmRes = await request(BASE_URL).post("/farm/create").send(farmPayload);

		// deve dar erro 400 do tipo de usuário
		expect(createFarmRes.status).toBe(400);
		expect(createFarmRes.body).toHaveProperty("message");
		expect(createFarmRes.body.message).toBe(
			"Apenas usuários do tipo 'dev' podem criar fazendas"
		);

		// 3️⃣ Limpeza: deleta usuário normal
		await request(BASE_URL).delete(`/user/delete/${normalUserId}`);
	});
});

