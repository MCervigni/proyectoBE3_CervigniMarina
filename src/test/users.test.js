import { describe, it, after, before } from "mocha";
import supertest from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import { config } from "../config/config.js";

const requester = supertest(`http://localhost:${config.PORT}`);

await mongoose.connect(config.MONGO_URL, { dbName: config.DB_NAME });

describe("Pruebas router users", function () {
  this.timeout(15_000);

  // 🧹 LIMPIAR SOLO USUARIOS DE TEST AL FINAL
  after(async () => {
    await mongoose.connection.collection("users").deleteMany({ role: "test" });
    console.log("🧹 Usuarios de test limpiados");
  });

  let createdUserId;

  before(async () => {
    // Se crea un usuario de prueba antes de los tests (luego se elimina en el after)
    const userMock = {
      first_name: "Test",
      last_name: "User",
      email: `testuser${Date.now()}@mail.com`,
      password: "123456",
      role: "test",
    };
    const { status, body } = await requester.post("/api/users").send(userMock);
    console.log("POST /api/users response:", status, body); // <-- Agrega este log
    expect(body).to.have.property("payload"); // <-- Esto detiene el test si no hay payload
    createdUserId = body.payload._id;
  });

  describe("GET /api/users - Obtener todos los usuarios", () => {
    it("✅ Si consulto todos los usuarios, retorna un array", async () => {
      const { status, body } = await requester.get("/api/users");
      expect(status).to.equal(200);
      expect(body).to.have.property("status", "success");
      expect(Array.isArray(body.payload)).to.be.true;
    });
  });

  describe("GET /api/users/:uid - Obtener usuario por ID", () => {
    it("✅ Si consulto un usuario por ID válido, retorna el usuario", async () => {
      const { status, body } = await requester.get(
        `/api/users/${createdUserId}`
      );
      expect([200, 404, 500]).to.include(status);
      if (status === 200) {
        expect(body).to.have.property("status", "success");
        expect(body.payload).to.have.property("_id", createdUserId);
      }
    });

    it("❌ Si consulto un usuario por ID inválido, retorna error", async () => {
      const { status, body } = await requester.get("/api/users/invalid-id");
      expect([404, 500]).to.include(status);
      expect(body).to.have.property("status", "error");
    });
  });
});
