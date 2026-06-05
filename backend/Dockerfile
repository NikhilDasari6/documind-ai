# Use the official Node.js 20 image
FROM node:20-slim

# Create and change to the app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy local code to the container image
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Start the server
CMD [ "node", "server.js" ]
