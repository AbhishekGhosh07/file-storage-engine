const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const { Command } = require('commander');
const program = new Command();

// Server URL
const serverUrl = 'http://localhost:3000'; // Adjust to your server URL

// Helper function to upload files
async function uploadFiles(files) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', fs.createReadStream(file));
  });

  try {
    const response = await axios.post(`${serverUrl}/add`, formData, {
      headers: formData.getHeaders(),
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error uploading files:', error.response?.data || error.message);
  }
}

// Command: store add
program
  .command('add <files...>')
  .description('Add files to the store')
  .action((files) => {
    uploadFiles(files);
  });

// Command: store ls
program
  .command('ls')
  .description('List files in the store')
  .action(async () => {
    try {
      const response = await axios.get(`${serverUrl}/ls`);
      console.log('Files in store:', response.data.join(', '));
    } catch (error) {
      console.error('Error listing files:', error.response?.data || error.message);
    }
  });

// Command: store rm
program
  .command('rm <filename>')
  .description('Remove a file from the store')
  .action(async (filename) => {
    try {
      const response = await axios.delete(`${serverUrl}/rm/${filename}`);
      console.log(response.data);
    } catch (error) {
      console.error('Error removing file:', error.response?.data || error.message);
    }
  });

// Command: store update
program
  .command('update <filename>')
  .description('Update a file in the store')
  .action(async (filename) => {
    const filePath = path.join(process.cwd(), filename);
    if (!fs.existsSync(filePath)) {
      console.error(`File ${filename} not found in the current directory.`);
      return;
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    try {
      const response = await axios.put(`${serverUrl}/update/${filename}`, formData, {
        headers: formData.getHeaders(),
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error updating file:', error.response?.data || error.message);
    }
  });

// Command: store wc
program
  .command('wc')
  .description('Get word count of all files in the store')
  .action(async () => {
    try {
      const response = await axios.get(`${serverUrl}/wc`);
      console.log(`Word Count: ${response.data}`);
    } catch (error) {
      console.error('Error getting word count:', error.response?.data || error.message);
    }
  });

// Command: store freq-words
program
  .command('freq-words')
  .description('Get frequent words in the store')
  .option('--limit <number>', 'Limit the number of words', 10)
  .option('--order <order>', 'Order of the results: dsc|asc', 'asc')
  .action(async (options) => {
    try {
      const { limit, order } = options;
      const response = await axios.get(`${serverUrl}/freq-words`, {
        params: { limit, order },
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error getting frequent words:', error.response?.data || error.message);
    }
  });

// Parse and execute CLI commands
program.parse(process.argv);
