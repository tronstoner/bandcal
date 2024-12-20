FROM nginx:alpine

# Copy the template file
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# Install envsubst
RUN apk add --no-cache gettext

# Copy the startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
