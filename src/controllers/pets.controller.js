import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js";
import __dirname from "../utils/index.js";
import mongoose from "mongoose";

const getAllPets = async (req, res) => {
  try {
    const pets = await petsService.getAll();
    res.send({ status: "success", payload: pets });
  } catch (error) {
    res.status(500).send({ status: "error", error: "Internal Server Error" });
  }
};

const getPetById = async(req,res) => {
    try {
        const petId = req.params.pid;
        if (!mongoose.Types.ObjectId.isValid(petId)) {
            return res.status(404).json({status:"error",error:"Pet not found"});
        }
        const pet = await petsService.getBy({ _id: petId });
        if (!pet) {
  return res.status(404).json({status:"error",error:"Pet not found"});
}
        res.send({status:"success",payload:pet});
    } catch (error) {
        res.status(500).send({status:"error",error:"Internal Server Error"});
    }
}

const createPet = async (req, res) => {
  try {
    const { name, specie, birthDate } = req.body;
    if (!name || !specie || !birthDate)
      return res
        .status(400)
        .send({ status: "error", error: "Incomplete values" });
    const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
    const result = await petsService.create(pet);
    res.send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", error: "Internal Server Error" });
  }
};

const updatePet = async (req, res) => {
  try {
    const petUpdateBody = req.body;
    const petId = req.params.pid;
    if (!mongoose.Types.ObjectId.isValid(petId)) {
      return res.status(404).send({ status: "error", error: "Pet not found" });
    }
    const pet = await petsService.getBy({ _id: petId });
    if (!pet)
      return res.status(404).send({ status: "error", error: "Pet not found" });
    const result = await petsService.update(petId, petUpdateBody);
    res.send({ status: "success", message: "pet updated" });
  } catch (error) {
    res.status(500).send({ status: "error", error: "Internal Server Error" });
  }
};

const deletePet = async (req, res) => {
  try {
    const petId = req.params.pid;
    if (!mongoose.Types.ObjectId.isValid(petId)) {
      return res.status(404).send({ status: "error", error: "Pet not found" });
    }
    const pet = await petsService.getBy({ _id: petId });
    if (!pet)
      return res.status(404).send({ status: "error", error: "Pet not found" });
    const result = await petsService.delete(petId);
    res.send({ status: "success", message: "pet deleted" });
  } catch (error) {
    res.status(500).send({ status: "error", error: "Internal Server Error" });
  }
};

const createPetWithImage = async (req, res) => {
  try {
    const file = req.file;
    const { name, specie, birthDate } = req.body;
    if (!name || !specie || !birthDate)
      return res
        .status(400)
        .send({ status: "error", error: "Incomplete values" });
    const pet = PetDTO.getPetInputFrom({
      name,
      specie,
      birthDate,
      image: `${__dirname}/../public/img/${file.filename}`,
    });
    const result = await petsService.create(pet);
    res.send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", error: "Internal Server Error" });
  }
};

export default {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  createPetWithImage,
};
