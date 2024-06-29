require('dotenv').config();
const serverPort = process.env.SERVER_PORT || 3003;
const MongodbURL =
  process.env.MONGODB_ATLAS_URL || 'mongodb://localhost:27017/clickAds';
const defaultImagePath =
  process.env.DEFAULT_USER_IMAGE_PATH || 'public/images/users/default.png';

const jwtActivationKey =
  process.env.JWT_ACTIVATION_KEY || 'LFKGFGKFKFJGFKJGKFFLGJKHJK#4';
const jwtAccesskey =
  process.env.JWT_ACCESS_KEY || 'LFKGFGKFKFJGFKJGKFFLfghfhJKHJK#4';

const jwtResetPasswordKey =
  process.env.JWT_RESET_PASSWORD_KEY || 'LFKGFGKFKFJGFKJGKFFLfghfhJKHgfK#4';
const jwtRefreshKey =
  process.env.JWT_REFRESH_KEY || 'LFKGFGKFKFJGFKGHGHJGKFFLfghfhJKHgfK#4';

const smtpUserName = process.env.SMTP_USERNAME || '';

const smtpPassword = process.env.SMTP_PASSWORD || '';

const clintURL = process.env.CLINT_URL || '';

module.exports = {
  serverPort,
  MongodbURL,
  defaultImagePath,
  jwtActivationKey,
  smtpUserName,
  smtpPassword,
  clintURL,
  jwtAccesskey,
  jwtResetPasswordKey,
  jwtRefreshKey,
};
