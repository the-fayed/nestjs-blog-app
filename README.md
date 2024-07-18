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

    Swagger documentation provided for the project

    ## License
    MTI License.
