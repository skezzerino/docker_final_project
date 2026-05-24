FROM postgres:16-alpine

# Копируем скрипт инициализации
COPY init.sql /docker-entrypoint-initdb.d/

# Устанавливаем права, чтобы postgres мог выполнить скрипт
RUN chmod -R 0755 /docker-entrypoint-initdb.d