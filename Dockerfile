FROM node:12.16.3-alpine
LABEL maintainer="Gerardo Arjona Jimenez<gerardo.arj15@gmail.com>"
RUN mkdir -p /home/node/app/tmp
WORKDIR /home/node/app
RUN mkdir node_modules && chown -R node:node /home/node/app
COPY package*.json ./
COPY . . 
USER root
RUN apk add --update --no-cache \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev
USER node
RUN npm install
USER root
ENV PORT=8000
ENV MONGODB_URI=mongodb+srv://admin:admin@cluster0.ejeny.mongodb.net/PhoneDirectory?retryWrites=true&w=majority
ENV SECRET_KEY=8PpdPkMixMzzRlkWjLWR
EXPOSE 8000
USER node
CMD ["node", "app.js"]