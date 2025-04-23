# Use official Node.js LTS image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV SESSION_SECRET=top-secret-key
ENV JWT_SECRET=top-secret-key

# Expose the port your app runs on
EXPOSE 3000

# Command to run your app
CMD ["npm", "start"]