# Project CPRG-310-A: Development Setup Guide

Welcome to the development setup guide for the CPRG-310-A group project. This document provides comprehensive instructions to help you set up the development environment on your local machine, manage files, run development servers, and build and test components. Given our stack—React with Vite for the frontend, Material Design UI for design, Keycloak for authentication, and Strapi for the backend—this guide will walk you through each step in detail.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Cloning the Repository](#cloning-the-repository)
3. [Setting Up the Backend](#setting-up-the-backend)
   - [Running Strapi with Docker](#running-strapi-with-docker)
4. [Setting Up Authentication](#setting-up-authentication)
   - [Running Keycloak with Docker](#running-keycloak-with-docker)
   - [Configuring Keycloak](#configuring-keycloak)
5. [Setting Up the Frontend](#setting-up-the-frontend)
   - [Running the React Application](#running-the-react-application)
6. [Building and Testing Components](#building-and-testing-components)
7. [Managing Files and Collaborating](#managing-files-and-collaborating)
8. [Additional Resources](#additional-resources)

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Git**: Version control system to clone the repository.
- **Docker**: Platform to run applications in isolated containers.
- **Node.js and npm**: JavaScript runtime and package manager.
- **Yarn** (optional but recommended): Alternative package manager for JavaScript.

## Cloning the Repository

Start by cloning the project repository to your local machine:

```bash
git clone https://github.com/alexlsmitty/strapi-cprg310a-gp.git
cd strapi-cprg310a-gp
```

## Setting Up the Backend

### Running Strapi with Docker

Strapi serves as our headless CMS. We'll run it using Docker for consistency across development environments.

1. **Navigate to the Strapi Directory**:

   ```bash
   cd my-strapi-project
   ```

2. **Create a Docker Network** (if not already created):

   ```bash
   docker network create cprg310a-network
   ```

3. **Start the PostgreSQL Database**:

   Ensure that the `docker-compose.yml` file is correctly configured to start the PostgreSQL service. The provided configuration should handle this automatically.

4. **Start Strapi**:

   Build and run the Strapi service using Docker Compose:

   ```bash
   docker-compose up --build
   ```

   This command will:

   - Build the Strapi Docker image as defined in the `Dockerfile`.
   - Start the Strapi service and link it to the PostgreSQL database.

5. **Access Strapi Admin Panel**:

   Once Strapi is running, access the admin panel at `http://localhost:1337/admin`. Follow the on-screen instructions to create an admin user.

For more detailed information on running Strapi with Docker, refer to the official Strapi Docker documentation.

## Setting Up Authentication

### Running Keycloak with Docker

Keycloak handles our authentication and authorization. Running it in a Docker container simplifies the setup process.

1. **Pull the Keycloak Docker Image**:

   ```bash
   docker pull quay.io/keycloak/keycloak:latest
   ```

2. **Start Keycloak in Development Mode**:

   Run the following command to start Keycloak:

   ```bash
   docker run --name keycloak -p 8080:8080 \
     -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin \
     quay.io/keycloak/keycloak:latest start-dev
   ```

   This command will:

   - Start Keycloak on port `8080`.
   - Set the admin username and password to `admin`.

3. **Access Keycloak Admin Console**:

   Once Keycloak is running, access the admin console at `http://localhost:8080/`. Log in using the admin credentials specified above.

### Configuring Keycloak

After logging into the Keycloak admin console:

1. **Create a Realm**:

   - Click on the dropdown in the top-left corner and select "Add Realm".
   - Name the realm (e.g., `cprg310a-realm`) and click "Create".

2. **Create a Client**:

   - In the new realm, navigate to the "Clients" section.
   - Click "Create" and enter the following details:
     - **Client ID**: `frontend-client`
     - **Client Protocol**: `openid-connect`
   - Click "Save".
   - In the "Settings" tab, set:
     - **Valid Redirect URIs**: `http://localhost:3000/*`
     - **Web Origins**: `http://localhost:3000`
   - Click "Save".

3. **Create a User**:

   - Navigate to the "Users" section.
   - Click "Add User" and enter the required details.
   - After creating the user, set a password in the "Credentials" tab.

For a more detailed walkthrough, refer to the Keycloak Docker setup guide.

## Setting Up the Frontend

Our frontend is built with React and Vite, utilizing Material Design UI components.

1. **Navigate to the Frontend Directory**:

   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**:

   If you're using Yarn:

   ```bash
   yarn install
   ```

   Or with npm:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:

   Create a `.env` file in the `frontend` directory with the following content:

   ```env
   VITE_KEYCLOAK_URL=http://localhost:8080/
   VITE_KEYCLOAK_REALM=cprg310a-realm
   VITE_KEYCLOAK_CLIENT_ID=frontend-client
   ```

4. **Start the Development Server**:

   With Yarn:

   ```bash
   yarn dev
   ```

   Or with npm:

   ```bash
   npm run dev
   ```

   The application should now be running at `http://localhost:3000/`.

## Building and Testing Components

To build and test components:

1. **Build the Application**:

   With Yarn:

   ```bash
   yarn build
   ```

   Or with npm:

   ```bash
   npm run build
   ```

   The build output will be in the `dist` directory.

2. **Run Tests**:

   With Yarn:

   ```bash
   yarn test
   ```

   Or with npm:

   ```bash
   npm test
   ```

   Ensure all tests pass before committing your code.

## Managing Files and Collaborating

To collaborate effectively:

1. **Create Feature Branches**:

   For each new feature or bug fix, create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Commit Changes**:

   Commit your changes with descriptive messages:

   ```bash
   git add .
   git commit -m 