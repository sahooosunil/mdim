const fs = require("fs");
const jwt = require("jsonwebtoken");
const path = require("path");

const privateKeyPath =
  process.env.JWT_PRIVATE_KEY_PATH ||
  path.join(__dirname, "../../jwt_private.pem");
const publicKeyPath =
  process.env.JWT_PUBLIC_KEY_PATH ||
  path.join(__dirname, "../../jwt_public.pem");

const PRIVATE_KEY = fs.readFileSync(privateKeyPath);
const PUBLIC_KEY = fs.readFileSync(publicKeyPath);

// to generate the jwt token
//jwt token is consist of 3 parts a.b.c a=which algo is used to generate b=payload(user,role,email) c=signature to validate if jwt token is not modified/ it is valid
function signAccessToken(payload) {
  const jwtToken = jwt.sign(payload, PRIVATE_KEY, {
    algorithm: "RS256",
    expiresIn: process.env.ACCESS_TOKEN_EXP || "15m",
    issuer: process.env.ISSUER,
    audience: process.env.AUD,
  });
  return jwtToken;
}

function verifyAccessToken(token) {
  const jwtPayload = jwt.verify(token, PUBLIC_KEY, {
    algorithms: ["RS256"],
    issuer: process.env.ISSUER,
    audience: process.env.AUD,
  });
  return jwtPayload;
}
module.exports = { signAccessToken, verifyAccessToken };