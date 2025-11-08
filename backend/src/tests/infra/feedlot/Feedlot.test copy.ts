//primeiro criar usuário e farm de teste

import request from "supertest";

const BASE_URL = process.env.BASE_URL || "http://localhost:8080";

let testUserId: string;
let testFarmId: string;
let testFeedlotId: string;

beforeAll(async () => {
    // Use unique email with timestamp to avoid conflicts
    const timestamp = Date.now();
    const userPayload = {
        name: "user feedloot test",
        email: `feedlot${timestamp}@gmail.com`,
        password: "123456",
        type: "dev",
        access: "released",
        farms: []
    };
    
    const createUserRes = await request(BASE_URL)
        .post("/user/create")
        .send(userPayload);
    
    console.log("createUserRes", createUserRes.status, createUserRes.body);
    
    // Fix: Check if user creation was successful
    if (createUserRes.status !== 200 && createUserRes.status !== 201) {
        throw new Error(`Failed to create user: ${createUserRes.status} ${JSON.stringify(createUserRes.body)}`);
    }
    
    testUserId = createUserRes.body.user.id;

    const farmPayload = {
        name: `Fazenda Feedlot Teste ${timestamp}`,
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
    
    console.log("createFarmRes", createFarmRes.status, createFarmRes.body);
    
    // Fix: Check if farm creation was successful
    if (createFarmRes.status !== 200 && createFarmRes.status !== 201) {
        throw new Error(`Failed to create farm: ${createFarmRes.status} ${JSON.stringify(createFarmRes.body)}`);
    }
    
    testFarmId = createFarmRes.body.id;
    
    // Add small delay to ensure data is properly saved
    await new Promise(resolve => setTimeout(resolve, 1000));
});

afterAll(async () => {
    // Clean up in reverse order
    if (testFeedlotId) {
        await request(BASE_URL).delete(`/feedlot/delete`).send({ id: testFeedlotId });
    }
    if (testFarmId) {
        await request(BASE_URL).delete(`/farm/delete`).send({ id: testFarmId });
    }
    if (testUserId) {
        await request(BASE_URL).delete(`/user/delete/${testUserId}`);
    }
});

describe("Feedlot API", () => {
    it("deve criar um feedlot e adicionar a uma fazenda", async () => {
        const timestamp = Date.now();
        const feedlotPayload = {
            farmId: testFarmId,
            name: `Feedlot Test ${timestamp}`,
            coordinates: {
                latitude: -17.290836,
                longitude: -44.757419
            }
        };
        
        const createRes = await request(BASE_URL)
            .post("/feedlot/create")
            .send(feedlotPayload);
        
        console.log("create feedlot res", createRes.status, createRes.body);
        
        // Fix: Expect success status codes, not 400
        expect([200, 201]).toContain(createRes.status);
        expect(createRes.body).toHaveProperty("id");
        expect(createRes.body).toHaveProperty("name", `Feedlot Test ${timestamp}`);
        
        const coords = { 
            latitude: createRes.body.latitude, 
            longitude: createRes.body.longitude 
        };
        expect(coords).toHaveProperty("latitude", -17.290836);
        expect(coords).toHaveProperty("longitude", -44.757419);
        
        testFeedlotId = createRes.body.id;
        
        // Add delay to ensure data is saved
        await new Promise(resolve => setTimeout(resolve, 500));
    });

    it("deve verificar se o feedlot foi adicionado na fazenda", async () => {
        // Add delay to ensure previous test data is available
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const getFarmRes = await request(BASE_URL)
            .get(`/farm/getById/${testFarmId}`);
        
        console.log("getFarmRes", getFarmRes.status, getFarmRes.body);
        
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
        
        console.log("updateRes", updateRes.status, updateRes.body);
        
        expect([200, 201]).toContain(updateRes.status);
        expect(updateRes.body).toHaveProperty("id", testFeedlotId);
        expect(updateRes.body).toHaveProperty("name", "Feedlot Updated");
        expect(updateRes.body).toHaveProperty("latitude", -17.291000);
        expect(updateRes.body).toHaveProperty("longitude", -44.758000);
    });

    it("deve listar todos os feedlots e conter o feedlot criado", async () => {
        // Add delay to ensure data is available
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const getAllRes = await request(BASE_URL)
            .get("/feedlot/getAll");
        
        console.log("getAllRes", getAllRes.status, getAllRes.body);
        console.log("Looking for feedlot ID:", testFeedlotId);
        console.log("Available feedlots:", getAllRes.body.feedlot?.map((f: any) => ({ id: f.id, name: f.name })));

        expect(getAllRes.status).toBe(200);
        expect(Array.isArray(getAllRes.body.feedlot)).toBe(true);
        
        // More detailed debugging
        const foundFeedlot = getAllRes.body.feedlot.find((f: any) => f.id === testFeedlotId);
        if (!foundFeedlot) {
            console.error("Feedlot not found in list. Expected ID:", testFeedlotId);
            console.error("Available IDs:", getAllRes.body.feedlot.map((f: any) => f.id));
        }
        
        expect(getAllRes.body.feedlot.some((f: any) => f.id === testFeedlotId)).toBe(true);
    });

    it("deve buscar o feedlot criado pelo ID", async () => {
        const getByIdRes = await request(BASE_URL)
            .get(`/feedlot/getById/${testFeedlotId}`);
        
        console.log("getByIdRes", getByIdRes.status, getByIdRes.body);
        
        expect(getByIdRes.status).toBe(200);
        expect(getByIdRes.body).toHaveProperty("id");
        expect(getByIdRes.body.id).toBe(testFeedlotId);
    });

    it("deve deletar o feedlot e remover da fazenda", async () => {
        const deleteRes = await request(BASE_URL)
            .delete("/feedlot/delete")
            .send({ id: testFeedlotId });
        
        console.log("deleteRes", deleteRes.status, deleteRes.body);
        
        expect([200, 204]).toContain(deleteRes.status);
        
        // Add delay before checking removal
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Verifica se o feedlot foi removido da fazenda
        const getFarmRes = await request(BASE_URL)
            .get(`/farm/getById/${testFarmId}`);
        
        console.log("getFarmRes after feedlot delete", getFarmRes.status, getFarmRes.body);
        
        expect(getFarmRes.status).toBe(200);
        expect(getFarmRes.body).toHaveProperty("feedlots");
        expect(Array.isArray(getFarmRes.body.feedlots)).toBe(true);
        expect(getFarmRes.body.feedlots).not.toContain(testFeedlotId);
        
        // Clear the ID since it's been deleted
        testFeedlotId = '';
    });
});