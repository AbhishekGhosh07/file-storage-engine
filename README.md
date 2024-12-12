File Storage Server Application

This project allows you to manage files on a server through a simple command-line interface (CLI). The application is structured into two main components: Client and Server. Below are the step-by-step instructions to set up and run the application, along with available functionalities.

Prerequisites

Docker must be installed on your machine.
Node.js and npm must be installed on your machine.
Step-by-Step Guide to Set Up the Application

1. Clone the Project
First, clone the project from the repository to your local machine:

git clone <repository-url>
Once cloned, navigate into the project directory, which will contain two subdirectories: client and server.

2. Navigate to the client Folder
Change directory to the client folder:

cd client
3. Install Dependencies
Run the following command to install all required dependencies:

npm install
4. Build the Docker Image
After the dependencies are installed, build the Docker image for the application using the following command:

sudo docker build -t file-storage-server-engine .
This will build a Docker image with the name file-storage-server-engine.

5. Create an Alias for Running the Application
To make it easier to run the Docker container with the correct settings, create an alias in your terminal:

alias store='docker run -it --rm file-storage-server-engine'
This alias allows you to run the application with the store command.

Testing the Application

The application comes with some testing files located in the client folder. These files are:

file1.txt
file2.txt
file3.txt
file4.txt
6. View Available Commands
Now that everything is set up, run the following command to see all the available commands you can use:

store
This will display a list of commands you can use to interact with the file storage server.

Available Functionality

1. Add Files to the Server
Use the add command to add files to the server. For example, to add file1.txt and file2.txt, use:

store add file1.txt file2.txt
If the file doesn't exist on the server, it will be added.
If the file already exists with the same name, it won't be added.
If a file with the same content but a different name is added, a duplicate file will be created with the name dup<original-filename>.txt. For example, if file1.txt is already present, and you add file3.txt (which has the same content as file1.txt), it will create a duplicate file called dupfile3.txt.
2. List All Files on the Server
Use the ls command to list all files currently stored on the server:

store ls
This will display a list of all the files that are present in the server.

3. Remove a File from the Server
Use the rm command to delete a file from the server. For example, to remove file1.txt:

store rm file1.txt
This command will remove the specified file from the server.

4. Update a File on the Server
Use the update command to update the content of an existing file with the content of another file. For example, to update file1.txt with the contents of file2.txt:

store update file1.txt file2.txt
If file1.txt is present, its content will be replaced with the content of file2.txt.
If file1.txt is not present, it will be added to the server.
If file1.txt and file3.txt have the same content, the file will not be updated. It will skip the update.
5. Count the Total Number of Words in All Files
Use the wc command to count the total number of words in all the files stored on the server:

store wc
This will return the total word count of all files currently in the server.

6. Find the Most or Least Frequent Words in All Files
Use the freq-words command to get the most or least frequent words in the stored files. You can specify the limit of words to return and the order (ascending or descending):

store freq-words --limit 5 --order desc
This will return the top 5 most frequent words in the files, sorted in descending order. If you want the least frequent words, change --order to asc:

store freq-words --limit 5 --order asc
This will return the least frequent words in the files, sorted in ascending order.

Optimized Word Count Functionality
To make the word count functionality more efficient, the application uses Promise.all() to count the words concurrently across all files.

Summary of Commands

Add files:
store add <file1> <file2> ...
List files:
store ls
Remove files:
store rm <filename>
Update files:
store update <oldfilename> <newfilename>
Word count:
store wc
Frequent words:
store freq-words --limit <number> --order <asc|desc>