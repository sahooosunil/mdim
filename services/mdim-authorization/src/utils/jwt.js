import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base project root (two levels up from services folder)
const rootDir = path.resolve(__dirname, "../../");

const privateKeyPath = path.resolve(rootDir, process.env.JWT_PRIVATE_KEY_PATH || "run/secrets/jwt_private.pem");
const publicKeyPath  = path.resolve(rootDir, process.env.JWT_PUBLIC_KEY_PATH  || "run/secrets/jwt_public.pem");

const PRIVATE_KEY = fs.readFileSync(privateKeyPath);
const PUBLIC_KEY = fs.readFileSync(publicKeyPath);


export function signAccessToken(payload) {
  return jwt.sign(payload, PRIVATE_KEY, {
    algorithm: "RS256",
    expiresIn: process.env.ACCESS_TOKEN_EXP || "60m",
    issuer: process.env.ISSUER,
    audience: process.env.AUD,
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, PUBLIC_KEY, {
    algorithms: ["RS256"],
    issuer: process.env.ISSUER,
    audience: process.env.AUD,
  });
}
