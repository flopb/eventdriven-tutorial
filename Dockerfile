FROM yobasystems/alpine-nginx
COPY ./data/www /etc/nginx/html
COPY ./data/nginx/nginx.conf /etc/nginx/nginx.conf
