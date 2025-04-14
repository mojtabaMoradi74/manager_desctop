$Username = "mojtaba"
$Password = "1234"
$Database = "myDb"
$env:PGPASSWORD = $Password

# 1. چک کردن نصب بودن PostgreSQL
if (-not (Get-Command "psql.exe" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ PostgreSQL نصب نیست یا در مسیر PATH قرار نداره." -ForegroundColor Red
    exit 1
}

# 2. بررسی اتصال به دیتابیس
Write-Host "🧪 بررسی اتصال با یوزر '$Username' به دیتابیس '$Database'..." -ForegroundColor Cyan

try {
    psql -U $Username -d $Database -c "SELECT 1;" > $null 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ اتصال برقرار شد!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ اتصال برقرار نشد. بررسی دیتابیس..." -ForegroundColor Yellow

        $checkQuery = "SELECT 1 FROM pg_database WHERE datname='$Database';"
        $exists = psql -U $Username -d postgres -tAc $checkQuery

        if ($exists.Trim() -eq "1") {
            Write-Host "✅ دیتابیس '$Database' از قبل وجود دارد." -ForegroundColor Green
        } else {
            Write-Host "📦 دیتابیس '$Database' وجود ندارد. در حال ساخت..." -ForegroundColor Yellow
            createdb -U $Username $Database
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ دیتابیس ساخته شد." -ForegroundColor Green
            } else {
                Write-Host "❌ ساخت دیتابیس با خطا مواجه شد." -ForegroundColor Red
                exit 1
            }
        }
    }
} catch {
    Write-Host "❌ خطا در اتصال یا ساخت دیتابیس: $_" -ForegroundColor Red
    exit 1
}

# 3. لیست دیتابیس‌ها
Write-Host "`n📚 لیست دیتابیس‌ها:" -ForegroundColor Cyan
psql -U $Username -d postgres -c "\l"

# 4. لیست یوزرها
Write-Host "`n👤 لیست یوزرها:" -ForegroundColor Cyan
psql -U $Username -d postgres -c "\du"


# PowerShell رو به صورت Administrator باز کن

# دستور زیر رو برای اجازه اجرا بزن (فقط یک‌بار نیاز داری):
# Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# اسکریپت رو اجرا کن:
# .\check_postgres.ps1

