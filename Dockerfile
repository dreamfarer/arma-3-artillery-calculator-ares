FROM alpine:latest as build

WORKDIR /build

RUN apk add unzip wget && \
    wget https://arma.openlink.bot/assets/map.zip && \
    unzip map.zip && \
    rm map.zip

FROM nginx:latest
COPY --from=build /build/* /usr/share/nginx/html/map/
COPY . /usr/share/nginx/html/
WORKDIR /usr/share/nginx/html/
RUN mv ARES-Arma3-Online-Artillery-Calculator.html index.html
