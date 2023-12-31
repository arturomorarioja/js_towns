# Towns - Sample front-end app

## Purpose
In absence of a database and a proper back-end, this sample front-end application connects to the REST API generated by JSON Server based on a JSON file.

The application provides CRUD functionality over a list of Danish towns.

## Instructions
1. Install JSON Server:
    - Globally: `npm install -g json-server`
    - Locally: `npm i json-server`
2. Run JSON Server: 
    - Windows: `json-server --watch data\towns.json`
    - Linux or Mac: `json-server --watch data/towns.json`
3. Update the `baseUrl` constant in `script.js` with JSON Server's URL (by default, http://localhost:3000)
4. Open the application in a browser


## Tools
JSON Server / JavaScript / CSS3 / HTML5

## Author:
Arturo Mora-Rioja