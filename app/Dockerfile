# Stage 1: Build the Vue app
FROM node:22-alpine AS build-stage
WORKDIR /app
COPY . .
ARG VITE_BASE_PATH
ARG VITE_API_BASE_PATH
ARG VITE_PORT
ENV VITE_BASE_PATH=$VITE_BASE_PATH
ENV VITE_API_BASE_PATH=$VITE_API_BASE_PATH
ENV VITE_PORT=$VITE_PORT
RUN npm ci
RUN export VITE_BASE_PATH=$VITE_BASE_PATH VITE_API_BASE_PATH=$VITE_API_BASE_PATH VITE_PORT=$VITE_PORT && npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
# Only copy the dist folder from the build-stage
COPY --from=build-stage /app/dist /etc/nginx/html/
COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY start.sh /start.sh

CMD ["/start.sh"]