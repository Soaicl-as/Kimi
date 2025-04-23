# Use official Node.js image
FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Build frontend
RUN cd frontend && npm install && npm run build

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "backend/src/index.js"]
