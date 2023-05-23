# Master Thesis: Parameter Database with REST API using React and TypeScript for Volvo Powertrain

## Overview
- This project aims to create a parameter database for Volvo Powertrain that allows users to manage, view and search for parameters used in the development of engines and other powertrain components. The database will be implemented as a web application built with React and TypeScript, with a backend REST API to handle the data storage and retrieval.

## Features
- User authentication and authorization, with different levels of access depending on the user role
- Create, update and delete parameters, with validation of input values
- Search and filter parameters by name, description, category and other attributes
- View parameter details
- Export and import parameters in various formats, such as CSV

## Architecture
The architecture of the parameter database consists of two main components:
- Frontend web application: implemented with React and TypeScript, using Material-UI for the user interface components and Axios for the REST API client.
- Backend REST API: [README](../api/README.md)

## Getting started
To run the parameter database locally, you will need to follow these steps:
1. Clone the repository from GitHub and install the dependencies:
```
git clone https://github.com/HampusAndersson01/Parameter-Database.git
cd Parameter-Database\web
npm install
```

2. Start the frontend web application:
```
npm start
```
3. Open your web browser and go to `http://localhost:3001` to access the parameter database.


