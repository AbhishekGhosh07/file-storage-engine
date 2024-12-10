const express = require('express');
const routing = express.Router();
const multer = require('multer');
const path = require('path');
const service = require('../Services/crud-service');

// Ensure the upload directory exists
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up multer storage to handle file uploads to 'uploads/' directory
const upload = multer({ dest: uploadDir });

// Add files to store
routing.post('/add', upload.array('files'), service.addFile);

// List files in the storage directory
routing.get('/ls', service.getFileList);

routing.delete('/rm/:filename', service.deleteFiles);

routing.put('/update/:filename',upload.single('file'), service.updateFile);

routing.get('/wc', service.getWordCount);

routing.get('/freq-words', service.getFrequency);

module.exports = routing;
