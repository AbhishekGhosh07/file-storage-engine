const crypto = require('crypto');
const fs = require('fs');

// Helper function to generate hash of file content
exports.generateHash = (filePath) => {
    const hash = crypto.createHash('sha256');
    const fileBuffer = fs.readFileSync(filePath);
    hash.update(fileBuffer);
    return hash.digest('hex');
  };
  