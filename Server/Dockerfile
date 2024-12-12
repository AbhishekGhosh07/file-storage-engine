FROM node:latest
WORKDIR /opt/app-root/src
USER root
COPY . . 
RUN npm i
RUN chown -R 1001:0 /opt/app-root/src && \
    chmod -R ug+rw /opt/app-root/src
USER 1001
EXPOSE 3000
CMD ["npm", "start"]