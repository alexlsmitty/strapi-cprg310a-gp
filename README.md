# Housekeepin App

Housekeepin App is a front-end application developed as part of the CPRG310A Group Project. It is designed to work with a Strapi backend to provide a full-stack solution. This document details how to set up and run the project locally.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the App Locally](#running-the-app-locally)
- [Strapi Backend Setup](#strapi-backend-setup)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org) (LTS version recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

> **Note:** This project assumes you're using the dedicated supabase db we are using, if you want to self-host then please change the API as needed. 

## Installation

1. **Clone the Repository:**

   Open your terminal and run:

   ```bash
   git clone https://github.com/alexlsmitty/strapi-cprg310a-gp.git
   cd strapi-cprg310a-gp/housekeepin-app
Install Dependencies:

Use npm or Yarn to install the required packages:

bash
Copy
npm install
# or
yarn install
Configuration
Environment Variables
If the app requires environment-specific settings (like API endpoints), create a .env file in the root of the housekeepin-app directory. For example:

env
Copy
# .env file example
REACT_APP_API_URL=http://localhost:1337
Replace http://localhost:1337 with the URL where your Supabase backend is running.
Add or adjust any additional variables as needed.
Supabase Backend Setup
The Housekeepin App is designed to work with a Strapi backend. If you haven’t set up your Strapi instance yet, follow these steps:

Clone or Navigate to the Strapi Project:

If the Strapi backend is included in this repository (or provided separately), navigate to its directory. Otherwise, clone the official Strapi repository or your own Strapi project.

Install Dependencies:

In your project folder, install the dependencies and run the server:

bash
Copy
npm install
npm run develop
# or with Yarn
yarn install
yarn develop

Running the App Locally
Start the Front-End Development Server:

In the housekeepin-app directory, run:

bash
Copy
npm start
# or
yarn start
Access the App:

Open your browser and navigate to http://localhost:3000 (or the port specified in your project configuration).

Ensure Backend Connectivity:

Environment Variable Issues:
Double-check your .env file to ensure that all variables are correctly defined and that the file is located in the project’s root.

Dependency Issues:
Ensure you have a compatible version of Node.js and that all dependencies installed correctly. Deleting node_modules and reinstalling (npm install or yarn install) may help resolve issues.

License
This project is licensed under the MIT License. See the LICENSE file for details.