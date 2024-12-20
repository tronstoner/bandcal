FROM nginx:alpine

# Copy the template file
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# Install envsubst
RUN apk add --no-cache gettext

CMD ["/start.sh"]
