FROM node:8.11.1

MAINTAINER zhicong

ADD . /vote-activity

RUN cd /vote-activity && npm install