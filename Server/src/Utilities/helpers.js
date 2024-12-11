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

exports.extractWordsFromFile = async(filePath)=> {
  const data = await fs.promises.readFile(filePath, 'utf-8');
  return data
    .toLowerCase()
    .replace(/[^a-zA-Z\s]/g, '') // Remove non-alphabetical characters
    .split(/\s+/); // Split by spaces and newlines
}

// Function to calculate word frequency
exports.calculateWordFrequency = async(directoryPath)=> {
  const files = await fs.promises.readdir(directoryPath);
  const wordCount = {};

  // Read each file and count words
  const filePromises = files.map(async (file) => {
    const filePath = path.join(directoryPath, file);
    const stats = await fs.promises.stat(filePath);
    if (stats.isFile()) {
      const words = await exports.extractWordsFromFile(filePath);
      words.forEach((word) => {
        wordCount[word] = (wordCount[word] || 0) + 1;
      });
    }
  });

  await Promise.all(filePromises); // Wait for all file reading and word counting
  return wordCount;
}

// Function to sort and return words based on frequency
exports.getSortedWords = (wordCount, limit = 10, order = 'asc') => {
  const wordArray = Object.entries(wordCount)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => (order === 'asc' ? a.count - b.count : b.count - a.count));

  return wordArray.slice(0, limit);
}