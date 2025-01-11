# Projekt Grupowy Backend

## Running the application

### Prerequisites
- Node.js 20 installed on your syste *Node.js 18 should work as well, but it is not recommended*
- Running instance of postgreSQL on your system *If you have docker installed on your system you can follow optional step 1*
- Internet connection

### Set up database
a) Using docker-compose
Enter your database config in `db/.env.db` file or use existing one.

`cd db && docker-compose -f docker-compose.yml up`

b) Using your own database
[install postGIS on your system](https://postgis.net/documentation/getting_started/)
Create database
`CREATE DATABASE dbname;`
Open the database
`\c dbname`
Create postGIS extension on your database
`CREATE EXTENSION "postgis";`

### Configure the app
Copy `example.env` file into `.env` and enter application configuration
`cp example.env .env`
You have to update database url, other settings can be kept as default.
If you're using docker-compose database all required url components are availible in `db/.env.db`

### Install dependencies
`npm install`

### Perform database migration
*This initializes all database tables and creates `admin:zaq1@WSX` user with admin privilages*
`npm run prisma:migrate`

### Run the app
a) Run in dev mode with hot reload
`npm run dev`

b) Run production build
`npm run build:run`

### Done ✨

## Preview database records
`npm run prisma:studio`
