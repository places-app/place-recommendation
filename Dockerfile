FROM node
RUN mkdir -p /src
ADD . /src
WORKDIR /src
RUN npm install
EXPOSE 9000
CMD ["npm", "run", "prod"]
