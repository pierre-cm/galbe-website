FROM oven/bun:1 as base
WORKDIR /usr/src/app

COPY ./dist .

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "start" ]
