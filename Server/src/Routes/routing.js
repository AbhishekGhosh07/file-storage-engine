require('dotenv').config()
const express = require('express');
const routing = express.Router();
const multer = require('multer');
const path = require('path');
const service = require('../Services/crud-service');

// Ensure the upload directory exists
const fs = require('fs');
const uploadDir = path.join(__dirname, process.env.UPLOAD_DIR);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const upload = multer({ dest: uploadDir });

routing.post('/add', upload.array('files'), service.addFile);

routing.get('/ls', service.getFileList);

routing.delete('/rm/:filename', service.deleteFiles);

routing.put('/update/:filename',upload.single('file'), service.updateFile);

routing.get('/wc', service.getWordCount);

routing.get('/freq-words', service.getFrequency);

module.exports = routing;
