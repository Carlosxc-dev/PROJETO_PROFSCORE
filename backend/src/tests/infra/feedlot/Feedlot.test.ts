//primeiro criar usuário e farm de teste

import request from "supertest";

const BASE_URL = process.env.BASE_URL || "http://localhost:8080";

let testUserId: string;
let testFarmId: string;
let testFeedlotId: string;
beforeAll(async () => {
    const userPayload = {
        name: "user feedloot test",
        email: "feedlot@gmail.com",
        password: "123456",
        type: "dev",
        access: "released",
        farms: []
    };
    const createUserRes = await request(BASE_URL)
        .post("/user/create")
        .send(userPayload);
    // console.log("createUserRes", createUserRes.status, createUserRes.body);
    testUserId = createUserRes.body.user.id;

    const farmPayload = {
        name: "Fazenda Feedlot Teste",
        userId: testUserId,
        address: {
            city: "Itajuba",
            state: "Minas Gerais"
        },
        coordinates: {
            longitude: -44.761355,
            latitude: -17.284396
        },
        license: "62732a23-ad0c-44cd-b2a4-7c848d2128d5",
        feedlots: []
    };

    const createFarmRes = await request(BASE_URL)
        .post("/farm/create")
        .send(farmPayload);
    testFarmId = createFarmRes.body.id;

});





afterAll(async () => {
    // deleta a farm de teste
    await request(BASE_URL).delete(`/farm/delete`).send({ id: testFarmId });
    // deleta o usuário de teste
    await request(BASE_URL).delete(`/user/delete/${testUserId}`);
    //delta o feedlot de teste se não tiver sido deletado no teste
    await request(BASE_URL).delete(`/feedlot/delete`).send({ id: testFeedlotId });
});



describe("Feedlot API", () => {
    it("deve criar um feedlot e adicionar a uma fazenda", async () => {
        // console.log("testFarmId", testFarmId);
        const feedlotPayload = {
            farmId: testFarmId,
            name: "wwwwwwwwwwwwwwwwwwwwwwwwwwwww",
            coordinates: {
                latitude: -17.290836,
                longitude: -44.757419
            }
        };
        const createRes = await request(BASE_URL)
            .post("/feedlot/create")
            .send(feedlotPayload);
        // console.log("create feedlot res", createRes.status, createRes.body);
        expect([200, 201]).toContain(createRes.status);
        expect(createRes.body).toHaveProperty("id");
        expect(createRes.body).toHaveProperty("name", "wwwwwwwwwwwwwwwwwwwwwwwwwwwww");
        const coords = { latitude: createRes.body.latitude, longitude: createRes.body.longitude };
        expect(coords).toHaveProperty("latitude", -17.290836);
        expect(coords).toHaveProperty("longitude", -44.757419);
        testFeedlotId = createRes.body.id;
    });

    it("deve verificar se o feedlot foi adicionado na fazenda", async () => {
        const getFarmRes = await request(BASE_URL)
            .get(`/farm/getById/${testFarmId}`);
        // console.log("getFarmRes", getFarmRes.status, getFarmRes.body);
        expect(getFarmRes.status).toBe(200);
        expect(getFarmRes.body).toHaveProperty("feedlots");
        expect(Array.isArray(getFarmRes.body.feedlots)).toBe(true);
        expect(getFarmRes.body.feedlots).toContain(testFeedlotId);
    });

    it("deve editar o feedlot", async () => {
        const updatePayload = {
            id: testFeedlotId,
            name: "Feedlot Updated",
            coordinates: {
                latitude: -17.291000,
                longitude: -44.758000
            }
        };

        const updateRes = await request(BASE_URL)
            .put("/feedlot/update")
            .send(updatePayload);
        // console.log("updateRes", updateRes.status, updateRes.body);
        expect([200, 201]).toContain(updateRes.status);
        expect(updateRes.body).toHaveProperty("id", testFeedlotId);
        expect(updateRes.body).toHaveProperty("name", "Feedlot Updated");
        expect(updateRes.body).toHaveProperty("latitude", -17.291000);
        expect(updateRes.body).toHaveProperty("longitude", -44.758000);
    });


    it("deve listar todos os feedlots e conter o feedlot criado", async () => {
        const getAllRes = await request(BASE_URL)
            .get("/feedlot/getAll");
        // console.log("getAllRes", getAllRes.status, getAllRes.body);

        // usa o campo correto
        expect(Array.isArray(getAllRes.body.feedlot)).toBe(true);
        expect(getAllRes.body.feedlot.some((f: any) => f.id === testFeedlotId)).toBe(true);
        // console.log("Feedlots listados:", getAllRes.body.feedlot);
    });


    it("deve buscar o feedlot criado pelo ID", async () => {
        const getByIdRes = await request(BASE_URL)
            .get(`/feedlot/getById/${testFeedlotId}`);
        // console.log("getByIdRes", getByIdRes.status, getByIdRes.body);
        expect(getByIdRes.status).toBe(200);
        // expect(getByIdRes.body).toHaveProperty("id");
        // expect(getByIdRes.body.id).toBe(testFeedlotId);
        // console.log("Feedlot buscado pelo ID:", getByIdRes.body);
    });

    it("deve deletar o feedlot e remover da fazenda", async () => {
        const deleteRes = await request(BASE_URL)
            .delete("/feedlot/delete")
            .send({ id: testFeedlotId });
        // console.log("deleteRes", deleteRes.status, deleteRes.body);
        expect(deleteRes.status).toBe(200);
        // Verifica se o feedlot foi removido da fazenda
        const getFarmRes = await request(BASE_URL)
            .get(`/farm/getById/${testFarmId}`);
        // console.log("getFarmRes after feedlot delete", getFarmRes.status, getFarmRes.body);
        expect(getFarmRes.status).toBe(200);
        expect(getFarmRes.body).toHaveProperty("feedlots");
        expect(Array.isArray(getFarmRes.body.feedlots)).toBe(true);
        expect(getFarmRes.body.feedlots).not.toContain(testFeedlotId);
    });

});
