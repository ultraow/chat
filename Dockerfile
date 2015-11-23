FROM ubuntu

RUN apt-get update
RUN apt-get install python-software-properties -y
RUN apt-add-repository ppa:chris-lea/node.js
RUN apt-get update
RUN apt-get install nodejs -y

RUN node -v
RUN npm -v

RUN npm install
