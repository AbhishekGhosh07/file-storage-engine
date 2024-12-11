const crypto = require('crypto');
const fs = require('fs');
const path = require("path");


exports.getFileHash = (filePath) => {
  const hash = crypto.createHash("sha256");
  const fileBuffer = fs.readFileSync(filePath); 
  hash.update(fileBuffer);  
  return hash.digest("hex");  
}

// Function to get a file by its hash
exports.getFileByHash = (fileHash, fileStorePath) => {
  const files = fs.readdirSync(fileStorePath);  
  for (const file of files) {
    const filePath = path.join(fileStorePath, file);  
    const existingFileHash = exports.getFileHash(filePath);  
    if (existingFileHash === fileHash) {
      return file;  
    }
  }
  return null; 
}

// Function to check if a file with the same hash already exists in the store
exports.fileExistsByHash = (hash, fileStorePath) => {
  const files = fs.readdirSync(fileStorePath);  
  return files.some(file => exports.getFileHash(path.join(fileStorePath, file)) === hash); 
};
