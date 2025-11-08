import request from "supertest";

const BASE_URL = process.env.BASE_URL || "http://localhost:8080";

let testUserId: string;
let testFarmId: string;
let testFeedlotId: string;
let testCowId: string;

beforeAll(async () => {
    // cria usuário
    const userPayload = {
        name: "user cow test",
        email: "cowtest@gmail.com",
        password: "123456",
        type: "dev",
        access: "released",
        farms: []
    };
    const createUserRes = await request(BASE_URL)
        .post("/user/create")
        .send(userPayload);
    testUserId = createUserRes.body.user.id;

    // cria farm
    const farmPayload = {
        name: "Fazenda Cow Teste",
        userId: testUserId,
        address: { city: "Itajuba", state: "Minas Gerais" },
        coordinates: { latitude: -17.284396, longitude: -44.761355 },
        license: "62732a23-ad0c-44cd-b2a4-7c848d2128d5",
        feedlots: []
    };
    const createFarmRes = await request(BASE_URL)
        .post("/farm/create")
        .send(farmPayload);
    testFarmId = createFarmRes.body.id;

    // cria feedlot
    const feedlotPayload = {
        farmId: testFarmId,
        name: "feedlot cow teste",
        coordinates: { latitude: -17.290836, longitude: -44.757419 }
    };
    const createFeedlotRes = await request(BASE_URL)
        .post("/feedlot/create")
        .send(feedlotPayload);
    testFeedlotId = createFeedlotRes.body.id;
});

afterAll(async () => {
    // deleta cow se criada
    if (testCowId) {
        await request(BASE_URL).delete(`/cow/delete`).send({ id: testCowId });
    }
    // deleta feedlot
    if (testFeedlotId) {
        await request(BASE_URL).delete(`/feedlot/delete`).send({ id: testFeedlotId });
    }
    // deleta farm
    if (testFarmId) {
        await request(BASE_URL).delete(`/farm/delete`).send({ id: testFarmId });
    }
    // deleta usuário
    if (testUserId) {
        await request(BASE_URL).delete(`/user/delete/${testUserId}`);
    }
});

describe("Cow API", () => {

    it("deve criar uma vaca vinculada ao feedlot e verificar se está na lista do feedlot", async () => {
        const cowPayload = {
            state: "atypical",
            position: "standing",
            date: "2025-09-16T14:30:00.000Z",
            feedlotId: testFeedlotId
        };
        const createCowRes = await request(BASE_URL)
            .post("/cow/create")
            .send(cowPayload);
        // console.log("create cow res", createCowRes.status, createCowRes.body);
        expect(createCowRes.status).toBe(201);
        expect(createCowRes.body).toHaveProperty("id");
        expect(createCowRes.body).toHaveProperty("state", "atypical");
        expect(createCowRes.body).toHaveProperty("position", "standing");

        // verifica se cow foi adicionada ao feedlot
        const getFeedlotRes = await request(BASE_URL)
            .get(`/feedlot/getById/${testFeedlotId}`);
        expect(getFeedlotRes.status).toBe(200);
        expect(getFeedlotRes.body).toHaveProperty("cows");
        expect(Array.isArray(getFeedlotRes.body.cows)).toBe(true);
        expect(getFeedlotRes.body.cows).toContain(createCowRes.body.id);

        testCowId = createCowRes.body.id;
    });

    it("deve buscar a vaca pelo id", async () => {
        const getCowRes = await request(BASE_URL)
            .get(`/cow/getById/${testCowId}`);
        // console.log("get cow res", getCowRes.status, getCowRes.body);
        expect(getCowRes.status).toBe(200);
        expect(getCowRes.body).toHaveProperty("id", testCowId);
        expect(getCowRes.body).toHaveProperty("state", "atypical");
    });

    it("deve atualizar a vaca", async () => {
        const updatePayload = {
            id: testCowId,
            state: "normal",
            position: "standing",
            date: "2025-09-17T10:00:00.000Z",
            feedlotId: testFeedlotId
        };
        const updateRes = await request(BASE_URL)
            .put("/cow/update")
            .send(updatePayload);
        // console.log("update cow res", updateRes.status, updateRes.body);
        expect(updateRes.status).toBe(200);
        expect(updateRes.body).toHaveProperty("id", testCowId);
        expect(updateRes.body).toHaveProperty("state", "normal");
        expect(updateRes.body).toHaveProperty("position", "standing");
    });

    it("deve listar todas as vacas e conter a vaca criada", async () => {
        const getAllRes = await request(BASE_URL)
            .get("/cow/getAll");
        // console.log("get all cows res", getAllRes.status, getAllRes.body);
        expect(getAllRes.status).toBe(200);
        expect(Array.isArray(getAllRes.body.cows)).toBe(true);
        expect(getAllRes.body.cows.some((c: any) => c.id === testCowId)).toBe(true);
    });

    it("deve deletar a vaca", async () => {
        const deleteRes = await request(BASE_URL)
            .delete("/cow/delete")
            .send({ id: testCowId });
        // console.log("delete cow res", deleteRes.status, deleteRes.body);
        expect(deleteRes.status).toBe(200);
        expect(deleteRes.body).toHaveProperty("id", testCowId);

        // verifica se a vaca foi removida do feedlot
        const getFeedlotRes = await request(BASE_URL)
            .get(`/feedlot/getById/${testFeedlotId}`);
        expect(getFeedlotRes.status).toBe(200);
        expect(getFeedlotRes.body.cows).not.toContain(testCowId);
    });
});
