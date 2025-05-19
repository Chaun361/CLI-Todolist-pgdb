# CLI Todo List App

### A Node.js + PostgreSQL Implementation

## Prerequisites
  > [!NOTE]
  > Requirement: A local PostgreSQL server must be installed and running.


  > [!IMPORTANT]
  > 1.Configure your local Postgres database in the .env file (the default HOST and PORT are already set) <br/>
  > 2.Open a command prompt or terminal in the app directory.

  
## Getting start

  `node Todolist.js -h`
  
  Display all the options
  
   `node Todolist.js -l`
  
  List all the tasks from your database

   `node Todolist.js -a <description>`
  
  Add a new task. Replace <description> with your task details.

  `node Todolist.js -d <id>`
  
  Delete a task by its ID. Replace <id> with the task’s ID.

  `node Todolist.js -c <id>`
  
  Mark a task as DONE using its ID.

![Screenshot of a comment on a GitHub issue showing an image, added in the Markdown, of an Octocat smiling and raising a tentacle.](https://c.tenor.com/7UarUv_Z1QYAAAAd/tenor.gif)
  
