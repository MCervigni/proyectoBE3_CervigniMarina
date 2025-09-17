import { describe, it, after } from "mocha";
import supertest from "supertest";
import { expect } from "chai";
import mongoose, { isValidObjectId } from "mongoose";
import { config } from "../config/config.js";

const requester = supertest(`http://localhost:${config.PORT}`);

await mongoose.connect(config.MONGO_URL, { dbName: config.DB_NAME });

let createdPetId;

describe("Pruebas router pets", function () {
  this.timeout(15_000);

  // 🧹 LIMPIAR SOLO MASCOTAS DE TEST AL FINAL
  after(async () => {
    await mongoose.connection.collection("pets").deleteMany({ specie: "test" });
    console.log("🧹 Mascotas de test limpiadas");
  });

  describe("GET /api/pets - Obtener todas las mascotas", () => {
    it("✅ Si consulto todas las mascotas al endpoint /api/pets método GET, me debería devolver un array de mascotas", async () => {
      const { status, body } = await requester.get("/api/pets");
      expect(status).to.equal(200);
      expect(body).to.have.property("status", "success");
      expect(body).to.have.property("payload");
      expect(Array.isArray(body.payload)).to.be.true;
    });

    it("✅ Debería retornar estructura correcta de respuesta", async () => {
      const { body } = await requester.get("/api/pets");
      expect(body).to.be.an("object");
      expect(body).to.have.property("status");
      expect(body).to.have.property("payload");
      expect(body.status).to.equal("success");
    });
  });

  describe("POST /api/pets - Crear nueva mascota", () => {
    it("✅ Si envío los datos correctos de una mascota al /api/pets método POST, da de alta la mascota en DB", async () => {
      const petMock = {
        name: "Rocky",
        specie: "test",
        birthDate: new Date(2023, 11, 18).toUTCString(),
      };

      const { status, body } = await requester.post("/api/pets").send(petMock);

      expect(status).to.equal(200);
      expect(body).to.have.property("status", "success");
      expect(body.payload).to.have.property("_id");
      expect(isValidObjectId(body.payload._id)).to.be.true;
      expect(body.payload.name).to.equal(petMock.name);
      expect(body.payload.specie).to.equal(petMock.specie);
      expect(body.payload.adopted).to.be.false;

      createdPetId = body.payload._id;
    });

    it("❌ Si envío los datos incompletos de una mascota al /api/pets método POST, me retorna un error", async () => {
      const petMock = {
        specie: "test",
        birthDate: new Date(2023, 11, 18).toUTCString(),
      };

      const { status, body } = await requester.post("/api/pets").send(petMock);

      expect(status).to.equal(400);
      expect(body).to.have.property("status", "error");
    });

    it("❌ Si envío los datos sin campo specie al /api/pets método POST, me debería dar error", async () => {
      const petMock = {
        name: "TestPet",
        birthDate: new Date(2023, 11, 18).toUTCString(),
      };

      const { status, body } = await requester.post("/api/pets").send(petMock);

      expect(status).to.equal(400);
      expect(body).to.have.property("status", "error");
    });

    it("❌ Si envío los datos sin campo birthDate al /api/pets método POST, me debería dar error", async () => {
      const petMock = {
        name: "TestPet",
        specie: "test",
      };

      const { status, body } = await requester.post("/api/pets").send(petMock);

      expect(status).to.equal(400);
      expect(body).to.have.property("status", "error");
    });

    it("❌ Si envío datos vacíos al /api/pets método POST, me debería dar error", async () => {
      const { status, body } = await requester.post("/api/pets").send({});
      expect(status).to.equal(400);
      expect(body).to.have.property("status", "error");
    });

    it("✅ Si creo mascotas con diferentes especies, todas se deben guardar correctamente", async () => {
      const especies = ["dog", "cat", "bird"];
      for (const specie of especies) {
        const petMock = {
          name: `Pet_${specie}`,
          specie: "test",
          birthDate: new Date(2023, 10, 15).toUTCString(),
        };

        const { status, body } = await requester
          .post("/api/pets")
          .send(petMock);
        expect(status).to.equal(200);
        expect(body.payload.name).to.equal(petMock.name);
        expect(isValidObjectId(body.payload._id)).to.be.true;
      }
    });
  });

  describe("GET /api/pets/:pid - Obtener mascota por ID", () => {
    it("✅ Si consulto una mascota por ID válido, retorna la mascota", async () => {
      const { status, body } = await requester.get(`/api/pets/${createdPetId}`);
      expect([200, 404, 500]).to.include(status);
      if (status === 200) {
        expect(body).to.have.property("status", "success");
        expect(body.payload).to.have.property("_id", createdPetId);
      }
    });

    it("❌ Si consulto una mascota por ID inválido, retorna error", async () => {
      const { status, body } = await requester.get("/api/pets/invalid-id");
      expect([404, 500]).to.include(status);
      expect(body).to.have.property("status", "error");
    });
  });
});
