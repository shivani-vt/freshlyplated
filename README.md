FreshlyPlated

FreshlyPlated is a recipe management application built with a Node.js backend, Express.js API, and PostgreSQL database.

The backend provides a REST API that allows users to create, view, update, and delete recipes.

Technologies Used

- Node.js
- Express.js
- PostgreSQL
- pg (node-postgres)
- REST API
- dotenv
- CORS


Features

- Create new recipes
- View all recipes
- View a single recipe by ID
- Update recipe information
- Delete recipes
- Store recipe data in PostgreSQL database
- Secure database connection using environment variables


API Endpoints

GET /recipes

Returns all recipes stored in the database.


GET /recipes/:id

Returns a specific recipe using its ID.

Example:

GET /recipes/1


POST /recipes

Creates a new recipe and stores it in the database.

Example request:

{
  "name": "Butter Chicken",
  "status": "planning",
  "prep_time_minutes": 20
}


PATCH /recipes/:id

Updates information for an existing recipe.

Example request:

{
  "status": "completed"
}


DELETE /recipes/:id

Deletes a recipe using its ID.

Example:

DELETE /recipes/2


Project Structure

backend/
|
database/
 I    I── db.js
 I── index.js
 I── package.json
 I── package-lock.json
 I── README.md
 I── .gitignore


Database

The application uses PostgreSQL with a recipes table containing:

- Recipe name
- Original recipe link
- Original recipe text
- Adjusted recipe text
- Status
- Preparation time
- Cooking time
- Tags
- Created and updated timestamps


Environment Variables

The project uses a .env file for database configuration.

Example:

DB_HOST=localhost
DB_PORT=5432
DB_NAME=database_name
DB_USER=username

The .env file is excluded from Git using .gitignore to protect sensitive information.


Running the Backend

Install dependencies:

npm install

Start the server:

node index.js

The server runs on:

http://localhost:3001


Future Improvements

- Build React frontend interface
- Add user authentication
- Add recipe images
- Add recipe categories and filtering
- Add meal planning features
- Deploy application online


Built as part of the FreshlyPlated project.


