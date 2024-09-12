const crypto = require('crypto');

class HMACGenerator {
    constructor() {
        this.secretKey = crypto.randomBytes(32).toString('hex');
    }

    generateHMAC(move) {
        const hmac = crypto.createHmac('sha256', this.secretKey).update(move).digest('hex');
        return hmac;
    }
}

module.exports = HMACGenerator;
