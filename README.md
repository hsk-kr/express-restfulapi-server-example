# Express Restful API Server Example

## What's Restful API Server

A Restful(REpresentational State Transfer) API Server is a server that provides application interfaces that uses HTTP request to GET, PUT, POST and DELETE data.

## Scripts

| Command    | Description                                        |
| ---------- | -------------------------------------------------- |
| start      | Start production server                            |
| build      | Build production                                   |
| dev        | Start a server with babel-node on development mode |
| test       | Jest test on test mode                             |
| test:watch | Jest test on test mode with --watchAll option.     |
| clean      | Delete the dist directory                          |

## Used Modules

| Module Name          | Purpose                                                 |
| -------------------- | ------------------------------------------------------- |
| express              | Node.js Web Application Framework                       |
| babel                | It allows us to use the node syntax of recent version   |
| babel-node           | To execute without compiling                            |
| jest                 | Javascript Testing Framework                            |
| supertest            | Library for testing node.js HTTP server                 |
| jest-html-reporter   | To Export testing result to a html file                 |
| rimraf               | For deleting dirctory (in this project, dist directory) |
| dotenv               | To use environment variables                            |
| npm-run-all          | To Execute number of commands sequentailly              |
| nodemon              | Detecting changes of source code and restart server     |
| cross-env            | Deliver environment variables to scripts                |
| eslint               | Rules that how to write code                            |
| eslint-config-airbnb | Airbnb Rules                                            |
| prettier             | Source code auto format                                 |

## API

### GET Users

|                  |                                                                                                                |
| ---------------- | -------------------------------------------------------------------------------------------------------------- |
| Title            | Get Users                                                                                                      |
| URL              | /users/                                                                                                        |
| Method           | GET                                                                                                            |
| URL Parameters   | **Optional:**<br/>username=[username]<br/>email=[email]<br/>sort=[sort]<br/>skip=[skip]<br/>limit=[limit]      |
| Success Response | **Code:** 200<br/>**Content:** {[user documents]}                                                              |
| Error Response   | **Code:** 400 Validation Error<br/>**Content:** {"status": "error", "statusCode": 400, "message": "[message]"} |
| Sample Request   | `/users?username=user*&skip=10&limit=30`                                                                       |

### Get User

|                  |                                                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| Title            | Get User                                                                                                           |
| URL              | /users/[id]                                                                                                        |
| Method           | GET                                                                                                                |
| Success Response | **Code:** 200<br/>**Content:** {user document}                                                                     |
| Error Response   | **Code:** 400 Validation Error<br/>**Content:** {"status": "error", "statusCode": 400, "message": "[message]"}     |
| Error Response   | **Code:** 404 User Not Found Error<br/>**Content:** {"status": "error", "statusCode": 404, "message": "[message]"} |
| Sample Request   | `/users/5e28f45f4483f64210bff502`                                                                                  |

### Create User

|                  |                                                                                                                         |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Title            | Create User                                                                                                             |
| URL              | /users                                                                                                                  |
| Method           | POST                                                                                                                    |
| Data Params      | **Requiered:**<br/>`{ username: "username", password: "password", email: "email" }`                                     |
| Success Response | **Code:** 200<br/>**Content:** {user document}                                                                          |
| Error Response   | **Code:** 400 Validation Error<br/>**Content:** {"status": "error", "statusCode": 400, "message": "[message]"}          |
| Error Response   | **Code:** 200 User Already Exists Error<br/>**Content:** {"status": "error", "statusCode": 200, "message": "[message]"} |

### Update User

|                  |                                                                                                                         |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Title            | Update User                                                                                                             |
| URL              | /users/[id]                                                                                                             |
| Method           | PUT                                                                                                                     |
| Data Params      | **Requiered:**<br/>`{ username: "username", password: "password", email: "email" }`                                     |
| Success Response | **Code:** 200<br/>**Content:** {user document}                                                                          |
| Error Response   | **Code:** 400 Validation Error<br/>**Content:** {"status": "error", "statusCode": 400, "message": "[message]"}          |
| Error Response   | **Code:** 200 User Already Exists Error<br/>**Content:** {"status": "error", "statusCode": 200, "message": "[message]"} |

### Update Partial User

|                  |                                                                                                                         |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Title            | Update Partial User                                                                                                     |
| URL              | /users/[id]                                                                                                             |
| Method           | PATCH                                                                                                                   |
| Data Params      | **Optional:**<br/>username: "username"<br/>password: "password"<br/>email: "email"                                      |
| Success Response | **Code:** 200<br/>**Content:** {user document}                                                                          |
| Error Response   | **Code:** 400 Validation Error<br/>**Content:** {"status": "error", "statusCode": 400, "message": "[message]"}          |
| Error Response   | **Code:** 200 User Already Exists Error<br/>**Content:** {"status": "error", "statusCode": 200, "message": "[message]"} |
| Error Response   | **Code:** 404 User Not Found Error<br/>**Content:** {"status": "error", "statusCode": 404, "message": "[message]"}      |

### Delete User

|                  |                                                                                                                |
| ---------------- | -------------------------------------------------------------------------------------------------------------- |
| Title            | Delete User                                                                                                    |
| URL              | /users/[id]                                                                                                    |
| Method           | DELETE                                                                                                         |
| Success Response | **Code:** 200<br/>**Content:** {user document}                                                                 |
| Error Response   | **Code:** 400 Validation Error<br/>**Content:** {"status": "error", "statusCode": 400, "message": "[message]"} |
| Sample Request   | `/users/5e28f45f4483f64210bff502`                                                                              |
