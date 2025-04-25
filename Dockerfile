# Use Node.js LTS as the base image
FROM node:18

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port your server listens on
EXPOSE 3000

# Run the server
CMD ["node", "index.js"]