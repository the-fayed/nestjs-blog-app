<h1 align="center">Blog App Nest.js API</h1>

## Description
Slef-Learing bakend project to practice Nest.js framework.

## Key Features
  - Authorization 
  - Authentication 
  - User Managment
      -  Update user data
      -  Update user password
      -  Update user role (available for admins)
      -  Delete user
  - Blog Managment
      - Adding blogs
      - Updating blogs (title-description-body-headerimage)
      - Like blogs
      - Deleting blogs (admins and authores only)
      - Reporting blogs (editors and chief editor)
      - Getting reported blogs (admins only)
  - Contrization (development and produtiot)

## Used Stack
  - TypeScript
  - Node.js
  - Nest.js
  - PostgreSQL
  - cloudinary
  - Docker

## Installation
  - At first clone this reposetory on your machine by running:
    ```bash
    git clone https://github.com/the-fayed/nestjs-blog-app.git
    ```
  - Next navigate to the project on your machine
  - add the env file with your env configurations
    ```env
    # APP SETTING    
    NODE_ENV = ""
    PORT = ""
    BASEURL = ""
    
    # Swagger
    API_Path = "api/v1"
    
    # TypeOrm
    DATABASE_URL = ""
    
    # JWT 
    JWT_SECRET = ""
    JWT_EXPIRATION = ""
    
    # NODEMAILER
    MAIL_HOST = ""
    MAIL_PORT = ""
    MAIL_USER = ""
    MAIL_PASS = ""
    
    # CLOUDINARY
    CLOUDINARY_CLOUD_NAME = ""
    CLOUDINARY_API_KEY = ""
    CLOUDINARY_API_SECRET = ""
    
    # MULTER
    MULTER_DEST = "./upload"
    ```
  - To run the project in development environment
    ```
    npm run start:dev
    ```
  - To run the app container on development environemt
    ```
    docker compose -f docker-compose.dev.yml up --build
    ```
  - To run the project in production environemt
    ```
    npm run build
    npm run start:prod
    ```
  - To run the app container on production environment
    ```
    docker compose up --build
    ```

    _note that if you want to run one of the containers you shoud install and configure docker desktop on your machine_

    ## API Documentation

    Swagger documentation provided for the project on
    `localhost:{port}/api/v1/docs`
    _note that the port on this url refres to the port you configured on the env file._

    ## License
    MTI License.
