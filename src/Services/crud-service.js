const fs = require("fs");
const path = require("path");

// Define where the files will be permanently stored
const FILE_STORE_PATH = path.join(__dirname, "data");

// Ensure the directory exists for file storage
if (!fs.existsSync(FILE_STORE_PATH)) {
  fs.mkdirSync(FILE_STORE_PATH);
}

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

    // Check if file already exists in destination
    if (fs.existsSync(destinationFilePath)) {
      errors.push(`File ${file.originalname} already exists.`);
    } else {
      // Move the file from the temporary 'uploads' folder to the final storage folder
      fs.rename(tempFilePath, destinationFilePath, (err) => {
        if (err) {
          errors.push(`Error moving file ${file.originalname}: ${err.message}`);
        } else {
          successFiles.push(file.originalname);
        }
      });
    }
  });

  // Handle success or errors
  if (errors.length > 0) {
    return res.status(400).send(errors.join("\n"));
  }

  res.send(`Files added successfully: ${successFiles.join(", ")}`);
};

exports.getFileList = (req, res) => {
  const files = fs.readdirSync(FILE_STORE_PATH);
  res.json(files);
};

exports.deleteFiles = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(FILE_STORE_PATH, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found.");
  }

  fs.unlinkSync(filePath);
  res.send("File removed successfully.");
};

exports.updateFile = (req, res) =>{
  const { filename } = req.params;
  const newFile = req.file;
  const filePath = path.join(FILE_STORE_PATH, filename);
  console.log(filePath);
  // Check if the file exists in the storage
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found.');
  }

  // If the new file is identical, don't upload it again
  if (fs.existsSync(path.join(FILE_STORE_PATH, newFile.originalname))) {
    fs.unlinkSync(newFile.path);  // Delete the temporary uploaded file
    return res.send('File already exists with the same name.');
  }

  // Update the file by renaming it to the original filename
  fs.renameSync(newFile.path, filePath);
  res.send('File updated successfully.');
}

exports.getWordCount = (req, res) =>{
  const files = fs.readdirSync(FILE_STORE_PATH);
  let totalWordCount = 0;

  files.forEach((file) => {
    const content = fs.readFileSync(path.join(FILE_STORE_PATH, file), 'utf8');
    totalWordCount += content.split(/\s+/).filter(Boolean).length;
  });

  res.json({ wordCount: totalWordCount });
}

exports.getFrequency = async (req, res) =>{
  const { limit = 10, order = 'asc' } = req.query;
  const parsedLimit = parseInt(limit, 10);
  const parsedOrder = order === 'asc' ? 'asc' : 'dsc'; // Defaults to 'asc'

  try {
    // Calculate word frequency from files in the directory
    const wordCount = await calculateWordFrequency(FILE_STORE_PATH);

    // Sort and limit the words based on user input
    const sortedWords = getSortedWords(wordCount, parsedLimit, parsedOrder);

    // Return the result as JSON
    res.json(sortedWords);
  } catch (error) {
    console.error('Error processing files:', error);
    res.status(500).send('Server Error');
  }
}

async function extractWordsFromFile(filePath) {
  const data = await fs.promises.readFile(filePath, 'utf-8');
  return data
    .toLowerCase()
    .replace(/[^a-zA-Z\s]/g, '') // Remove non-alphabetical characters
    .split(/\s+/); // Split by spaces and newlines
}

// Function to calculate word frequency
async function calculateWordFrequency(directoryPath) {
  const files = await fs.promises.readdir(directoryPath);
  const wordCount = {};

  // Read each file and count words
  const filePromises = files.map(async (file) => {
    const filePath = path.join(directoryPath, file);
    const stats = await fs.promises.stat(filePath);
    if (stats.isFile()) {
      const words = await extractWordsFromFile(filePath);
      words.forEach((word) => {
        wordCount[word] = (wordCount[word] || 0) + 1;
      });
    }
  });

  await Promise.all(filePromises); // Wait for all file reading and word counting
  return wordCount;
}

// Function to sort and return words based on frequency
function getSortedWords(wordCount, limit = 10, order = 'asc') {
  const wordArray = Object.entries(wordCount)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => (order === 'asc' ? a.count - b.count : b.count - a.count));

  return wordArray.slice(0, limit);
}