FROM ubuntu

RUN apt-get update
RUN apt-get install -y python-software-properties software-properties-common
RUN add-apt-repository ppa:chris-lea/node.js
RUN apt-get update
RUN apt-get install nodejs -y

RUN node -v
RUN npm -v

RUN npm install
