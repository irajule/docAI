# Use Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy project files
COPY . .

# Build production files
RUN npm run build

# Expose port
EXPOSE 3000

# Start dev server (or use serve for prod)
CMD ["npm", "run", "dev"]
