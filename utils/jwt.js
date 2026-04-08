const jwt = require('jsonwebtoken');

const accessTokenSecret = process.env.JWT_SECRET || 'supersecretjwtkey';
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'supersecretrefreshkey';
const accessTokenExpiry = process.env.JWT_EXPIRES_IN || '15m';
const refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

function generateAccessToken(payload) {
  return jwt.sign(payload, accessTokenSecret, { expiresIn: accessTokenExpiry });
}

function verifyAccessToken(token) {
  return jwt.verify(token, accessTokenSecret);
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, refreshTokenSecret, { expiresIn: refreshTokenExpiry });
}

function verifyRefreshToken(token) {
  return jwt.verify(token, refreshTokenSecret);
}

module.exports = {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken
};
