# Stage 1: Build the Vue app
FROM node:22-alpine AS build-stage
WORKDIR /app
COPY . .
ARG VITE_BASE_PATH
ARG VITE_API_BASE_PATH
ARG VITE_PORT
ARG VITE_APP_TITLE
ENV VITE_BASE_PATH=$VITE_BASE_PATH
ENV VITE_API_BASE_PATH=$VITE_API_BASE_PATH
ENV VITE_PORT=$VITE_PORT
ENV VITE_APP_TITLE=$VITE_APP_TITLE
RUN npm ci
RUN export VITE_BASE_PATH=$VITE_BASE_PATH VITE_API_BASE_PATH=$VITE_API_BASE_PATH VITE_PORT=$VITE_PORT VITE_APP_TITLE=$VITE_APP_TITLE && npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
# Only copy the dist folder from the build-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/nginx.conf.template

RUN echo "veryfying the files in /usr/share/nginx/htmls"
RUN ls -la /usr/share/nginx/html

COPY start-nginx.sh /start-nginx.sh

CMD ["/start-nginx.sh"]