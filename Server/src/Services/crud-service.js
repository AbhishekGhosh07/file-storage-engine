require("dotenv").config();
const fs = require("fs");
const path = require("path");
const helper = require("../Utilities/helpers");

const FILE_STORE_PATH = path.join(__dirname, process.env.DATABASE_DIR);

if (!fs.existsSync(FILE_STORE_PATH)) {
  fs.mkdirSync(FILE_STORE_PATH);
}

console.log(FILE_STORE_PATH);

// add file feature
exports.addFile = (req, res) => {
  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).send("No files provided.");
  }

  const errors = [];
  const successFiles = [];

  files.forEach((file) => {
    const tempFilePath = file.path;
    const destinationFilePath = path.join(FILE_STORE_PATH, file.originalname);

    // Hashing the file
    const fileHash = helper.getFileHash(tempFilePath);

    // Checking if the file with the same hash already exists
    const existingFile = helper.getFileByHash(fileHash, FILE_STORE_PATH);

    if (existingFile) {
      //store the new file with a different name - if file content is same
      const newFilePath = path.join(
        FILE_STORE_PATH,
        `dup_${file.originalname}`
      );
      fs.renameSync(tempFilePath, newFilePath);
      successFiles.push(`File ${file.originalname} stored as duplicate.`);
    } else {
      //store it with its original name - if file content is different
      fs.renameSync(tempFilePath, destinationFilePath);
      successFiles.push(file.originalname);
    }
  });

  if (errors.length > 0) {
    return res.status(400).send(errors.join("\n"));
  }

  res.send(`Files added successfully: ${successFiles.join(", ")}`);
};

// get file list feature
exports.getFileList = (req, res) => {
  const files = fs.readdirSync(FILE_STORE_PATH);
  res.json(files);
};

// delete file feature
exports.deleteFiles = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(FILE_STORE_PATH, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found.");
  }

  fs.unlinkSync(filePath);
  res.send("File removed successfully.");
};

// update feature
exports.updateFile = (req, res) => {
  const { filename } = req.params;
  const newFile = req.file;
  const filePath = path.join(FILE_STORE_PATH, filename);

  console.log("Received file:", newFile.originalname);

  if (fs.existsSync(filePath)) {
    const uploadedFileHash = helper.getFileHash(newFile.path);

    // Checking if the file with same content is present
    if (helper.fileExistsByHash(uploadedFileHash, FILE_STORE_PATH)) {
      fs.unlinkSync(newFile.path);
      return res.send(
        "File with the same content already exists. Skipping upload."
      );
    }

    // update the file by renaming it to the original filename - content is different
    fs.renameSync(newFile.path, filePath);
    return res.send("File updated successfully.");
  }

  // upload it as a new file - if file is not present
  fs.renameSync(newFile.path, filePath);
  res.send("File created and uploaded successfully.");
};

// word count feature
exports.getWordCount = (req, res) => {
  const files = fs.readdirSync(FILE_STORE_PATH);
  let totalWordCount = 0;

  files.forEach((file) => {
    const content = fs.readFileSync(path.join(FILE_STORE_PATH, file), "utf8");
    totalWordCount += content.split(/\s+/).filter(Boolean).length;
  });

  res.json({ wordCount: totalWordCount });
};

// word frequency feature
exports.getFrequency = async (req, res) => {
  const { limit = 10, order = "asc" } = req.query;
  const parsedLimit = parseInt(limit, 10);
  const parsedOrder = order === "asc" ? "asc" : "dsc";

  try {
    // Calculating the frequency of words
    const wordCount = await helper.calculateWordFrequency(FILE_STORE_PATH);

    // Sorting the result according to the user input
    const sortedWords = helper.getSortedWords(
      wordCount,
      parsedLimit,
      parsedOrder
    );

    res.json(sortedWords);
  } catch (error) {
    console.error("Error processing files:", error);
    res.status(500).send("Server Error");
  }
};
