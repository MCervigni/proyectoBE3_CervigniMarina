import mongoose from "mongoose";
import { usersService } from "../services/index.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await usersService.getAll();
    res.send({ status: "success", payload: users });
  } catch (error) {
    res.status(500).send({ status: "error", error: "Internal Server Error" });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.params.uid;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({ status: "error", error: "User not found" });
    }
    const user = await usersService.getUserById(userId);
    if (!user)
      return res.status(404).json({ status: "error", error: "User not found" });
    res.json({ status: "success", payload: user });
  } catch (error) {
    console.error("getUser error:", error);
    res.status(500).json({ status: "error", error: "Internal Server Error" });
  }
};

const createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, role } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return res
        .status(400)
        .send({ status: "error", error: "Incomplete values" });
    }
    const exists = await usersService.getUserByEmail(email);
    if (exists)
      return res
        .status(400)
        .send({ status: "error", error: "User already exists" });
    const user = {
      first_name,
      last_name,
      email,
      password,
      role: role || "user",
    };
    const result = await usersService.create(user);
    res.send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", error: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const updateBody = req.body;
    const userId = req.params.uid;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).send({ status: "error", error: "User not found" });
    }
    const user = await usersService.getUserById(userId);
    if (!user)
      return res.status(404).send({ status: "error", error: "User not found" });
    const result = await usersService.update(userId, updateBody);
    res.send({ status: "success", message: "User updated" });
  } catch (error) {
    res.status(500).send({ status: "error", error: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.uid;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).send({ status: "error", error: "User not found" });
    }
    const user = await usersService.getUserById(userId);
    if (!user)
      return res.status(404).send({ status: "error", error: "User not found" });
    await usersService.delete(userId);
    res.send({ status: "success", message: "User deleted" });
  } catch (error) {
    res.status(500).send({ status: "error", error: "Internal Server Error" });
  }
};

export default {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
};
