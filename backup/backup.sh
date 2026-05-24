#!/bin/bash

BACKUP_DIR="/backups"

echo "Backup service started. Waiting for database..."

# Ждём готовности базы
until PGPASSWORD="$POSTGRES_PASSWORD" pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$POSTGRES_USER"; do
  echo "Waiting for database..."
  sleep 5
done

echo "Database is ready. Starting backup cycle."

# Функция создания бэкапа
do_backup() {
  TIMESTAMP=$(date +%Y%m%d_%H%M%S)
  BACKUP_FILE="${BACKUP_DIR}/crm_backup_${TIMESTAMP}.sql.gz"
  echo "[$(date)] Creating backup: $BACKUP_FILE"
  PGPASSWORD="$POSTGRES_PASSWORD" pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" | gzip > "$BACKUP_FILE"
  echo "[$(date)] Backup completed."
  # Удаляем бэкапы старше 7 дней
  find "$BACKUP_DIR" -name "crm_backup_*.sql.gz" -mtime +7 -delete
}

# Первый бэкап сразу
do_backup

# Далее каждые 24 часа
while true; do
  sleep 86400
  do_backup
done