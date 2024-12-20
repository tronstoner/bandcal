#!/bin/sh

# Set default values if not provided
VITE_BASE_PATH=${VITE_BASE_PATH}
VITE_PORT=${VITE_PORT:-8081}

# Export the variables to ensure they are available for envsubst
export VITE_PORT VITE_BASE_PATH

echo "Starting Nginx with the following configuration:"
echo "VITE_PORT: ${VITE_PORT}"
echo "VITE_BASE_PATH: ${VITE_BASE_PATH}"

# Preprocess the template with environment variables
envsubst '${VITE_PORT} ${VITE_BASE_PATH}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Display the processed configuration for debugging
cat /etc/nginx/nginx.conf

# Display the contents of the HTML directory if it exists
echo "Contents of /usr/share/nginx/html:"
ls -la /usr/share/nginx/html

# Verify the Nginx configuration
nginx -T

# Start Nginx with the explicitly specified configuration file
nginx -c /etc/nginx/nginx.conf -g 'daemon off;'
