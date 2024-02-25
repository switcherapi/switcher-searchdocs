FROM denoland/deno:alpine-1.41.0

ENV APP_HOME=/home/app
WORKDIR $APP_HOME

COPY /src/deps.ts $APP_HOME

RUN deno cache deps.ts

COPY /src .

RUN addgroup -S app && \
    adduser -S app -G app && \
    chown -R app:app $APP_HOME /deno-dir

USER app