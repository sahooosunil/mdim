const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/userModel');
const { signAccessToken } = require('../utils/jwt');

const REDIS_REFRESH_PREFIX = 'refresh:';

async function signup(req, res) {
  const { username, email, password, roles } = req.body;
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = new User({ username, email, passwordHash, roles });
  await user.save();
  res.status(201).json({ message: 'User created' });
}

async function login(req, res) {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  // create access token
  const payload = { sub: user._id.toString(), roles: user.roles };
  const accessToken = signAccessToken(payload);

  // create refresh token (opaque)
  const refreshToken = uuidv4();
  // store in Redis with expiry
  const redisClient = req.app.locals.redis;
  await redisClient.setEx(REDIS_REFRESH_PREFIX + refreshToken, 60 * 60 * 24 * 7, user._id.toString());

  // update lastLogin
  user.lastLogin = new Date();
  await user.save();

  res.json({ accessToken, refreshToken });
}

async function refresh(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'Missing token' });

  const redisClient = req.app.locals.redis;
  const userId = await redisClient.get(REDIS_REFRESH_PREFIX + refreshToken);
  if (!userId) return res.status(401).json({ message: 'Invalid refresh token' });

  // rotate: delete old refresh token and create new one
  await redisClient.del(REDIS_REFRESH_PREFIX + refreshToken);
  const newRefresh = uuidv4();
  await redisClient.setEx(REDIS_REFRESH_PREFIX + newRefresh, 60 * 60 * 24 * 7, userId);

  const payload = { sub: userId }; // you may re-fetch roles if required
  const accessToken = signAccessToken(payload);
  res.json({ accessToken, refreshToken: newRefresh });
}

async function logout(req, res) {
  const { refreshToken } = req.body;
  const redisClient = req.app.locals.redis;
  await redisClient.del(REDIS_REFRESH_PREFIX + refreshToken);
  res.json({ message: 'Logged out' });
}

async function me(req, res) {
  // req.user set by middleware
  const user = await User.findById(req.user.sub).select('-passwordHash');
  res.json(user);
}

module.exports = { signup, login, refresh, logout, me };
