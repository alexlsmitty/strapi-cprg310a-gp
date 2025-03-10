# Project CPRG-310-A: Development Setup Guide
# Housekeepin App

Welcome to the development setup guide for the CPRG-310-A group project. This document provides comprehensive instructions to help you set up the development environment on your local machine, manage files, run development servers, and build and test components. Given our stack—React with Vite for the frontend, Material Design UI for design, Keycloak for authentication, and Strapi for the backend—this guide will walk you through each step in detail.
Housekeepin App is a front-end application developed as part of the CPRG310A Group Project. It is designed to work with a Strapi backend to provide a full-stack solution. This document details how to set up and run the project locally.

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
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the App Locally](#running-the-app-locally)
- [Strapi Backend Setup](#strapi-backend-setup)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
Before you begin, make sure you have the following installed on your machine:

- **Git**: Version control system to clone the repository.
- **Docker**: Platform to run applications in isolated containers.
- **Node.js and npm**: JavaScript runtime and package manager.
- **Yarn** (optional but recommended): Alternative package manager for JavaScript.
- [Node.js](https://nodejs.org) (LTS version recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

## Cloning the Repository
> **Note:** This project assumes you're using the dedicated supabase db we are using, if you want to self-host then please change the API as needed. 

Start by cloning the project repository to your local machine:
## Installation

```bash
git clone https://github.com/alexlsmitty/strapi-cprg310a-gp.git
cd strapi-cprg310a-gp
```
1. **Clone the Repository:**

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
   Open your terminal and run:

   ```bash
   docker run --name keycloak -p 8080:8080 \
     -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin \
     quay.io/keycloak/keycloak:latest start-dev
   ```

   This command will:

   - Start Keycloak on port `8080`.
   - Set the admin username and password to `admin`.
   git clone https://github.com/alexlsmitty/strapi-cprg310a-gp.git
   cd strapi-cprg310a-gp/housekeepin-app
Install Dependencies:

3. **Access Keycloak Admin Console**:
Use npm or Yarn to install the required packages:

   Once Keycloak is running, access the admin console at `http://localhost:8080/`. Log in using the admin credentials specified above.
bash
Copy
npm install
# or
yarn install
Configuration
Environment Variables
If the app requires environment-specific settings (like API endpoints), create a .env file in the root of the housekeepin-app directory. For example:

### Configuring Keycloak
env
Copy
# .env file example
REACT_APP_API_URL=http://localhost:1337
Replace http://localhost:1337 with the URL where your Supabase backend is running.
Add or adjust any additional variables as needed.
Supabase Backend Setup
The Housekeepin App is designed to work with a Strapi backend. If you haven’t set up your Strapi instance yet, follow these steps:

After logging into the Keycloak admin console:
Clone or Navigate to the Strapi Project:

1. **Create a Realm**:
If the Strapi backend is included in this repository (or provided separately), navigate to its directory. Otherwise, clone the official Strapi repository or your own Strapi project.

   - Click on the dropdown in the top-left corner and select "Add Realm".
   - Name the realm (e.g., `cprg310a-realm`) and click "Create".
Install Dependencies:

2. **Create a Client**:
In your project folder, install the dependencies and run the server:

   - In the new realm, navigate to the "Clients" section.
   - Click "Create" and enter the following details:
     - **Client ID**: `frontend-client`
     - **Client Protocol**: `openid-connect`
   - Click "Save".
   - In the "Settings" tab, set:
     - **Valid Redirect URIs**: `http://localhost:3000/*`
     - **Web Origins**: `http://localhost:3000`
   - Click "Save".
bash
Copy
npm install
npm run develop
# or with Yarn
yarn install
yarn develop

3. **Create a User**:
Running the App Locally
Start the Front-End Development Server:

   - Navigate to the "Users" section.
   - Click "Add User" and enter the required details.
   - After creating the user, set a password in the "Credentials" tab.
In the housekeepin-app directory, run:

For a more detailed walkthrough, refer to the Keycloak Docker setup guide.
bash
Copy
npm start
# or
yarn start
Access the App:

## Setting Up the Frontend
Open your browser and navigate to http://localhost:3000 (or the port specified in your project configuration).

Our frontend is built with React and Vite, utilizing Material Design UI components.
Ensure Backend Connectivity:

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
Environment Variable Issues:
Double-check your .env file to ensure that all variables are correctly defined and that the file is located in the project’s root.

3. **Configure Environment Variables**:
Dependency Issues:
Ensure you have a compatible version of Node.js and that all dependencies installed correctly. Deleting node_modules and reinstalling (npm install or yarn install) may help resolve issues.

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
License
This project is licensed under the MIT License. See the LICENSE file for details.