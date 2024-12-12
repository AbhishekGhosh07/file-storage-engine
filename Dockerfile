FROM registry.redhat.io/rhel9/nodejs-20
WORKDIR /opt/app-root/src
COPY . . 
RUN chown -R 1001:0 /opt/app-root/src && \
    chmod -R ug+rw /opt/app-root/src
USER 1001
EXPOSE 3000
CMD ["npm", "start"]

