FROM node
RUN mkdir -p /src
ADD . /src
WORKDIR /src
RUN npm install
EXPOSE 8080
CMD ["npm", "prod", start"]
