# Use Node.js 18 (compatible with Strapi)
FROM node:18

# Set the working directory inside the container
WORKDIR /srv/app

# Copy only package.json & lock files first (better caching)
COPY package.json package-lock.json* yarn.lock* ./

# Install dependencies inside Docker
RUN if [ -f yarn.lock ]; then yarn install; else npm install; fi

# Copy the rest of the project
COPY . .

# Expose Strapi port
EXPOSE 1337

# Start Strapi when the container runs
CMD ["yarn", "develop"]
