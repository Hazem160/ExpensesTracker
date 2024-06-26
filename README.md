# Expense Tracker Project

It is a simple website that can be used to track expenses for every set day chosen by the user. It also shows visually the distribution of the expenses in a pie chart
according to the category chosen when creating it. It also allows to create, update and delete each expense.

## Structure
It is a MVC (Model View Controller) web app that uses three division layers comprising of **front-end**, (view) and back-end divided into the **database** (model) and the **server** logic (controller).
It makes use of: 
- **express.js** for the controller,
- **postgreSQL** for the database,
- **React** for the front-end using the handy "create-react-app" for single-page react applications.
 For many visual components it has been used [MUI](https://mui.com/material-ui/all-components/), an open-source react component library.
## Start and Configuration
Before starting the app, install the required dependencies in the current directory:
```
npm install
```
To start the app, it needs to simultaneously run the front-end and the back-end. To do so, split the terminal and run in the current directory:
```
npm start
```
In the **"view"** directory, run the front-end:
```
npm start
```
To set up the database, create a **.env** file, with the following parameters:
```
DB_USER= 
DB_PASSWORD= 
DB_HOST=
DB_POST=
DB_DATABASE=
PORT=
```
They are dependant on the postgreSQL database created for it. In order for the controller to correctly query the database, create a Postgres server and use the 
query to create the table located in the file **expense.sql** in the **models** directory:
```
CREATE TABLE expenses(
    expense_id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL, 
    price DECIMAL(10, 2) NOT NULL, 
    category VARCHAR(30) NOT NULL, 
    essential BOOLEAN NOT NULL, 
    created_at TIMESTAMPTZ NOT NULL
);
```
