import express from "express";
import bcrypt from "bcrypt";
import User from "../models/users";

const router = express.Router();

router.post("/", async (request, response) => {
  const { username, name, password } = request.body;
  if (!username || !password)
    return response
      .status(400)
      .json({ error: "username and password required" });
  const existing = await User.findOne({ username });
  if (existing)
    return response.status(409).json({ error: "username already exists" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ username, name, passwordHash });
  await user.save();
  return response
    .status(201)
    .json({ id: user._id, username: user.username, name: user.name });
});
export default router;
