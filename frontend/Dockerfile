# Use an official Node.js runtime as a parent image
FROM node:18 AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN npm run build

# Debug step to list the build directory contents
RUN ls -l /usr/src/app/build

# Use an official Nginx image to serve the built app
FROM nginx:alpine

# Copy the build output to Nginx's html directory
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose the port Nginx is running on
EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]