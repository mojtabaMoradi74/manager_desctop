#!/bin/bash

USERNAME="mojtaba"
PASSWORD="1234"
DATABASE="myDb"
PGPASSWORD=$PASSWORD

# 1. بررسی نصب بودن PostgreSQL
if ! command -v psql &> /dev/null
then
    echo "❌ PostgreSQL نصب نیست یا در مسیر نیست."
    exit 1
fi

# 2. بررسی اتصال به دیتابیس
echo "🧪 بررسی اتصال با یوزر '$USERNAME' به دیتابیس '$DATABASE'..."

if psql -U "$USERNAME" -d "$DATABASE" -c "\q" 2>/dev/null; then
    echo "✅ اتصال برقرار شد!"
else
    echo "⚠️ اتصال برقرار نشد. بررسی می‌کنم که دیتابیس وجود داره یا نه..."

    EXISTS=$(psql -U "$USERNAME" -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DATABASE';")

    if [ "$EXISTS" == "1" ]; then
        echo "✅ دیتابیس '$DATABASE' از قبل وجود داره."
    else
        echo "📦 دیتابیس '$DATABASE' وجود نداره. در حال ساخت..."
        createdb -U "$USERNAME" "$DATABASE"
        if [ $? -eq 0 ]; then
            echo "✅ دیتابیس ساخته شد."
        else
            echo "❌ ساخت دیتابیس با خطا مواجه شد."
            exit 1
        fi
    fi
fi

# 3. نمایش لیست دیتابیس‌ها
echo ""
echo "📚 لیست دیتابیس‌ها:"
psql -U "$USERNAME" -d postgres -c "\l"

# 4. نمایش لیست یوزرها
echo ""
echo "👤 لیست یوزرها:"
psql -U "$USERNAME" -d postgres -c "\du"


# هش دسترسی اجرایی بده
# chmod +x check_postgres.sh
# ./check_postgres.sh


