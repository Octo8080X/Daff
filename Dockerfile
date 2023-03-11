FROM denoland/deno:1.31.1

RUN apt-get upgrade \
    && apt-get update \
    && apt-get install -y default-mysql-client-core\
    && apt-get install -y postgresql-client

RUN mkdir /usr/src/app
WORKDIR /usr/src/app


EXPOSE 8080