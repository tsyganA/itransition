const crypto = require('crypto');
const KEY_LENGTH = 64;
const secret = crypto.randomBytes(KEY_LENGTH).toString('hex');
console.log(secret);
