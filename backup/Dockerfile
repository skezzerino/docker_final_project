FROM alpine:latest

RUN apk add --no-cache postgresql-client bash gzip

COPY backup.sh /usr/local/bin/backup.sh
RUN chmod +x /usr/local/bin/backup.sh

RUN mkdir -p /backups && chmod 777 /backups

CMD ["/usr/local/bin/backup.sh"]