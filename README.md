# Chrome-Extension-Chat-Testing
 Testing implementing chat features in a chrome extension for a group project.
 
 Tech stack:
 - HTML
 - CSS
 - Node.js
 - Express
 - Socket.io
 - MySQL
 
 ## Run Locally
 To run extension locally, clone or download a zip of the project.
 
 In MySQL, create a new database for the project and run this code to create the messages table:
 ```
create table messages (id INT AUTO_INCREMENT, username VARCHAR(255) NOT NULL, message TEXT NOT NULL, messageQuery OK, 0 rows affected (0.08 sec)_TIMESTAMP, PRIMARY KEY(id));
```
Open the project in your code editor and edit the following code to match your database configuration:
```
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'your user',
  password : 'your password',
  database : 'database name'
});
```
Then, open a new terminal in the project folder and run command:
 
 ```
 node index.js
```
Then navigate to "chrome://extensions/" on a chrome browser and turn developer mode on (toggle on right corner). Select to "load unpacked" and select the project folder. You should now be able to pin and use the chrome extension!

The extension can also be viewed as a web app at [localhost:3000](http://localhost:3000/).

Please note that this extension will not work fully without running "node index.js" in the project terminal.
