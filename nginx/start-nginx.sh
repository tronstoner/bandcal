#!/bin/sh

# Export the variables to ensure they are available for envsubst
export BANDCAL_PORT VITE_BASE_PATH API_BASE_PATH API_PORT VITE_PORT

echo "Starting Nginx with the following configuration:"
echo "BANDCAL_PORT: ${BANDCAL_PORT}"
echo "VITE_PORT: ${VITE_PORT}"
echo "VITE_BASE_PATH: ${VITE_BASE_PATH}"
echo "API_PORT: ${API_PORT}"
echo "API_BASE_PATH: ${API_BASE_PATH}"

# Preprocess the template with environment variables
envsubst '${BANDCAL_PORT} ${VITE_BASE_PATH} ${API_BASE_PATH} ${VITE_PORT} ${API_PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Display the processed configuration for debugging
cat /etc/nginx/nginx.conf

# Start Nginx
nginx -g 'daemon off;'
