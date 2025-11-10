import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import Role from "../models/rolesModel.js";
import User from "../models/userModel.js";
import { signAccessToken } from "../utils/jwt.js";
import convertUserObject from "../utils/convertRoleIdsToRoleNames.js";
import RoleNotFoundError from "../errors/RoleNotFoundError.js";
import UserNotFoundError from "../errors/UserNotFoundError.js";

const REDIS_REFRESH_PREFIX = "refresh:";

export async function signup(req, res) {
  try {
    const { username, email, password } = req.body;

    const defaultRoles = ["STORE_STAFF"];
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const roles = [];
    const user = new User({ username, email, passwordHash, roles });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Error creating user" });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const userObject = await convertUserObject(user);
    delete userObject.passwordHash;

    const payload = { sub: userObject };
    const accessToken = signAccessToken(payload);

    const refreshToken = uuidv4();
    const redisClient = req.app.locals.redis;
    await redisClient.setEx(
      REDIS_REFRESH_PREFIX + refreshToken,
      60 * 60 * 24 * 7, // 7 days
      user._id.toString()
    );

    user.lastLogin = new Date();
    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error during login" });
  }
}

export async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "Missing refresh token" });

    const redisClient = req.app.locals.redis;
    const userId = await redisClient.get(REDIS_REFRESH_PREFIX + refreshToken);
    if (!userId)
      return res.status(401).json({ message: "Invalid refresh token" });

    // Rotate token
    await redisClient.del(REDIS_REFRESH_PREFIX + refreshToken);
    const newRefresh = uuidv4();
    await redisClient.setEx(
      REDIS_REFRESH_PREFIX + newRefresh,
      60 * 60 * 24 * 7,
      userId
    );

    const user = await User.findById(userId); // ✅ FIXED: was `User` before
    if (!user) throw new Error("User not found");

    const payload = { sub: userId, roles: user.roles };
    const accessToken = signAccessToken(payload);

    res.json({ accessToken, refreshToken: newRefresh });
  } catch (err) {
    console.error("Refresh error:", err);
    res.status(500).json({ message: "Error refreshing token" });
  }
}

export async function logout(req, res) {
  try {
    const { refreshToken } = req.body;
    const redisClient = req.app.locals.redis;
    await redisClient.del(REDIS_REFRESH_PREFIX + refreshToken);
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Error during logout" });
  }
}

export async function me(req, res) {
    const user = await User.findById(req.user._id);
    if(!user) throw new UserNotFoundError("User not found");
    const userObject = await convertUserObject(user);
    res.status(200).json(userObject);
}

export async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    const convertedUsers = [];
    for (const user of users) {
      const userObject = await convertUserObject(user);
      convertedUsers.push(userObject);
    }
    res.json(convertedUsers);
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ message: "Unable to fetch users" });
  }
}

export async function changeRoleOfUsers(req, res, next) {
  try {
    const { userId, newRole } = req.body;
    const role = await Role.find({ roleName: newRole });
    if (role.length === 0) {
      throw new RoleNotFoundError("Role not Found!");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { roles: [role[0]._id.toString()] },
      { new: true }
    );

    res.status(200).json({
      message: "User role updated successfully",
      updatedUser,
    });
  } catch (err) {
    console.error("Change role error:", err);
    next(err);
  }
}
