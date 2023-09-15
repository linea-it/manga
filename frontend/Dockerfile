FROM node:16.10 as builder

WORKDIR /app
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

RUN yarn -v

RUN yarn --ignore-optional --network-timeout 500000

COPY . /app

RUN yarn run build


# Ngnix
FROM nginx:latest

# Make /var/cache/nginx/ writable by non-root users
RUN chgrp nginx /var/cache/nginx/
RUN chmod -R g+w /var/cache/nginx/

# Write the PID file to a location where regular users have write access.
RUN sed --regexp-extended --in-place=.bak 's%^pid\s+/var/run/nginx.pid;%pid /var/tmp/nginx.pid;%' /etc/nginx/nginx.conf

COPY --from=builder /app/build /var/www/frontend
RUN chgrp nginx /var/www/frontend
RUN chmod -R g+w /var/www/frontend

RUN mkdir /var/www/table \
    && chmod -R g+w /var/www/table

COPY ./data/megacube_mean_properties_table_Riffel_2023.fits.tar.gz /var/www/table/megacube_mean_properties_table_Riffel_2023.fits.tar.gz
COPY ./nginx/production.conf /etc/nginx/conf.d/default.conf

USER nginx
