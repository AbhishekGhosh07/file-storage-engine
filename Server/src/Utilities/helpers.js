const crypto = require('crypto');
const fs = require('fs');
const path = require("path");

// Function to generate the SHA-256 hash of a file
exports.getFileHash = (filePath) => {
  const hash = crypto.createHash("sha256");
  const fileBuffer = fs.readFileSync(filePath);  // Read the file's content into a buffer
  hash.update(fileBuffer);  // Update the hash with the file's content
  return hash.digest("hex");  // Return the computed hash as a hexadecimal string
}

// Function to get a file by its hash
exports.getFileByHash = (fileHash, fileStorePath) => {
  const files = fs.readdirSync(fileStorePath);  // Read all files in the directory
  for (const file of files) {
    const filePath = path.join(fileStorePath, file);  // Construct the full file path
    const existingFileHash = exports.getFileHash(filePath);  // Compute the hash of the existing file
    if (existingFileHash === fileHash) {
      return file;  // Return the file if its hash matches the provided hash
    }
  }
  return null;  // Return null if no file matches the hash
}

// Function to check if a file with the same hash already exists in the store
exports.fileExistsByHash = (hash, fileStorePath) => {
  const files = fs.readdirSync(fileStorePath);  // Get all files in the storage directory
  return files.some(file => exports.getFileHash(path.join(fileStorePath, file)) === hash);  // Check if any file's hash matches the given hash
};
