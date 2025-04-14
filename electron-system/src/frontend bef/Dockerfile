# Stage 1: Build the React app
FROM node:16-alpine as build


WORKDIR /usr/src/app

# Install a specific npm version
RUN npm install -g npm@8.3.1

# Copy package files separately to leverage Docker caching
COPY package.json .
COPY package-lock.json .

#RUN npm install -g npm@7

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Copy build output to Nginx image and add .htaccess
FROM nginx:1.12-alpine

COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Copy custom Nginx configuration to handle React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

#COPY .htaccess /usr/share/nginx/html
#RUN chmod 644 /usr/share/nginx/html/.htaccess

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

