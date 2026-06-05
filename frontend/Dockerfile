# Use the official Nginx image as a base
FROM nginx:alpine

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static files to the Nginx html directory
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80
