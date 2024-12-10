const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const { Command } = require('commander');
const program = new Command();

// Server URL
const serverUrl = 'http://localhost:3000'; 

// Add New Files
async function uploadFiles(files) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', fs.createReadStream(file));
  });
  const headers = formData.getHeaders();
  try {
    const response = await axios.post(`${serverUrl}/add`, formData, { headers });
    console.log(response.data);
  } catch (error) {
    console.error('Error uploading files:', error.response?.data || error.message);
  }
}

// command for adding new files
program
  .command('add <files...>')
  .description('Add files to the store')
  .action((files) => {
    uploadFiles(files);
  });

// Command for listing all the files
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

// command for removing the files
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

// command for updating the old files
program
  .command('update <filename> <newfile>')
  .description('Update a file in the store with a new file')
  .action(async (filename, newfile) => {
    const filePath = path.join(process.cwd(), filename);  
    const newFilePath = path.join(process.cwd(), newfile); 

    if (!fs.existsSync(filePath)) {
      console.error(`File ${filename} not found in the current directory.`);
      return;
    }

    if (!fs.existsSync(newFilePath)) {
      console.error(`New file ${newfile} not found in the current directory.`);
      return;
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(newFilePath));

    try {
      const response = await axios.put(`${serverUrl}/update/${filename}`, formData, {
        headers: formData.getHeaders(),
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error updating file:', error.response?.data || error.message);
    }
  });

// command for getting the word counts
program
  .command('wc')
  .description('Get word count of all files in the store')
  .action(async () => {
    try {
      const response = await axios.get(`${serverUrl}/wc`);
      console.log(`Word Count: ${JSON.stringify(response.data)}`);
    } catch (error) {
      console.error('Error getting word count:', error.response?.data || error.message);
    }
  });

// command for getting the top 10 word's frequency 
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

program.parse(process.argv);
