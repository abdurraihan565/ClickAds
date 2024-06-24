const jwt = require('jsonwebtoken');

const createJSONWebToken = (payload, secretKey, expiresIn) => {
  if (typeof payload != 'object' || !payload) {
    throw new error('payload must be a non empty object');
  }

  if (typeof secretKey != 'string' || secretKey == '') {
    throw new error('secretkey must be a non empty string');
  }
  try {
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token;
  } catch (error) {
    console.error('Failed to sign the Jwt:', error);
    throw error;
  }
};

module.exports = { createJSONWebToken };
