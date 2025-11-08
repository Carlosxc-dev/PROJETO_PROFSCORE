import request from "supertest";

const BASE_URL = process.env.BASE_URL || "http://localhost:8080";

let testUserId: string;
let testFarmId: string;
let testFeedlotId: string;
let testImageId: string;

beforeAll(async () => {
    // cria usuário
    const userPayload = {
        name: "user feedlot test",
        email: "feedlot@gmail.com",
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

    // cria feedlot
    const feedlotPayload = {
        farmId: testFarmId,
        name: "feedlot teste",
        coordinates: {
            latitude: -17.290836,
            longitude: -44.757419
        }
    };
    const createFeedlotRes = await request(BASE_URL)
        .post("/feedlot/create")
        .send(feedlotPayload);

    testFeedlotId = createFeedlotRes.body.id;
});

afterAll(async () => {
    // deleta image se criada
    if (testImageId) {
        await request(BASE_URL).delete(`/images4k/delete`).send({ id: testImageId });
    }
    // deleta feedlot
    if (testFeedlotId) {
        await request(BASE_URL).delete(`/feedlot/delete`).send({ id: testFeedlotId });
    }
    // deleta farm
    if (testFarmId) {
        await request(BASE_URL).delete(`/farm/delete`).send({ id: testFarmId });
    }
    // deleta user
    if (testUserId) {
        await request(BASE_URL).delete(`/user/delete/${testUserId}`);
    }
});

describe("Images4K API", () => {
    it("deve criar uma imagem 4k vinculada ao feedlot conferir se a imagem esta na lista de feedlot", async () => {
        const imagePayload = {
            feedlotId: testFeedlotId,
            url_image: "HAHAHAHA",
            coordinates: {
                latitude: -10,
                longitude: -11
            }
        };

        const createImageRes = await request(BASE_URL)
            .post("/image4k/create")
            .send(imagePayload);
        // console.log("create image res", createImageRes.status, createImageRes.body);
        expect(createImageRes.status).toBe(201);
        expect(createImageRes.body).toHaveProperty("id");
        expect(createImageRes.body).toHaveProperty("url_image", "HAHAHAHA");
        // deve verificar se a imagem esta na lista do feedlot
        const getFeedlotRes = await request(BASE_URL)
            .get(`/feedlot/getById/${testFeedlotId}`);
        expect(getFeedlotRes.status).toBe(200);
        expect(getFeedlotRes.body).toHaveProperty("images4K");
        expect(Array.isArray(getFeedlotRes.body.images4K)).toBe(true);
        expect(getFeedlotRes.body.images4K).toContain(createImageRes.body.id);
        testImageId = createImageRes.body.id;
    });

    it("deve buscar a imagem 4k pelo id", async () => {
        const getImageRes = await request(BASE_URL)
            .get(`/image4k/getById/${testImageId}`);
        // console.log("get image res", getImageRes.status, getImageRes.body);
        expect(getImageRes.status).toBe(200);
        expect(getImageRes.body).toHaveProperty("id", testImageId);
        expect(getImageRes.body).toHaveProperty("url_image", "HAHAHAHA");
    });

    it("deve atualizar a imagem 4k", async () => {
        const updatePayload = {
            id: testImageId,
            url_image: "URL ATUALIZADA",
            coordinates: {
                latitude: -20,
                longitude: -21
            }, feedlotId: testFeedlotId
        };
        const updateRes = await request(BASE_URL)
            .put("/image4k/update")
            .send(updatePayload);
        // console.log("update image res", updateRes.status, updateRes.body);
        expect(updateRes.status).toBe(200);
        expect(updateRes.body).toHaveProperty("id", testImageId);
        expect(updateRes.body).toHaveProperty("url_image", "URL ATUALIZADA");
    });

    it("deve listar todas as imagens 4k e conter a imagem criada", async () => {
        const getAllRes = await request(BASE_URL)
            .get("/image4k/getAll");
        // console.log("get all images res", getAllRes.status, getAllRes.body);

        expect(getAllRes.status).toBe(200);
        expect(Array.isArray(getAllRes.body.images)).toBe(true);
        expect(getAllRes.body.images.some((img: any) => img.id === testImageId)).toBe(true);
    });


    it("deve deletar a imagem 4k", async () => {
        // deve criar uma nova imagem para deletar
        let testimagemRemoveId: string;
        const imagePayload = {
            feedlotId: testFeedlotId,
            url_image: "IMAGEM PARA REMOVER",
            coordinates: {
                latitude: -10,
                longitude: -11
            }
        };
        const createImageRes = await request(BASE_URL)
            .post("/image4k/create")
            .send(imagePayload);
        expect(createImageRes.status).toBe(201);
        testimagemRemoveId = createImageRes.body.id;
        // console.log("Imagem criada para remoção:", createImageRes.body);

        const deleteRes = await request(BASE_URL)
            .delete("/image4k/delete")
            .send({ id: testimagemRemoveId });
        // console.log("delete image res", deleteRes.status, deleteRes.body);
        expect(deleteRes.status).toBe(200);
        expect(deleteRes.body).toHaveProperty("id", testimagemRemoveId);
        
        // verifica se a imagem foi removida da lista do feedlot
        const getFeedlotRes = await request(BASE_URL)
            .get(`/feedlot/getById/${testFeedlotId}`);
        expect(getFeedlotRes.status).toBe(200);
        expect(getFeedlotRes.body).toHaveProperty("images4K");
        expect(Array.isArray(getFeedlotRes.body.images4K)).toBe(true);
        expect(getFeedlotRes.body.images4K).not.toContain(testimagemRemoveId);
    });

});

