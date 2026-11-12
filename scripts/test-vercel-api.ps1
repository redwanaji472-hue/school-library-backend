# Test Vercel API Deployment
# PowerShell Script

$API_URL = "https://school-library-backend.vercel.app"

Write-Host "=== 🧪 اختبار Vercel API ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Root
Write-Host "1️⃣ اختبار Root..." -ForegroundColor Yellow
try {
    $root = Invoke-WebRequest -Uri $API_URL -Method Get -ErrorAction Stop
    Write-Host "✅ Root: OK (Status: $($root.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Root: Failed ($($_.Exception.Message))" -ForegroundColor Red
}

Write-Host ""

# Test 2: API Endpoint
Write-Host "2️⃣ اختبار /api..." -ForegroundColor Yellow
try {
    $api = Invoke-WebRequest -Uri "$API_URL/api" -Method Get -ErrorAction Stop
    Write-Host "✅ /api: OK (Status: $($api.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ /api: Failed ($($_.Exception.Message))" -ForegroundColor Red
}

Write-Host ""

# Test 3: Swagger Docs
Write-Host "3️⃣ اختبار /docs..." -ForegroundColor Yellow
try {
    $docs = Invoke-WebRequest -Uri "$API_URL/docs" -Method Get -ErrorAction Stop
    Write-Host "✅ /docs: OK (Status: $($docs.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ /docs: Failed ($($_.Exception.Message))" -ForegroundColor Red
}

Write-Host ""

# Test 4: Login
Write-Host "4️⃣ اختبار Login..." -ForegroundColor Yellow
try {
    $body = @{
        username = "admin"
        password = "admin123"
    } | ConvertTo-Json

    $login = Invoke-RestMethod -Uri "$API_URL/auth/login" -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
    
    if ($login.access_token) {
        Write-Host "✅ Login: OK" -ForegroundColor Green
        Write-Host "   Token: $($login.access_token.Substring(0, 20))..." -ForegroundColor Gray
        Write-Host "   User: $($login.user.username)" -ForegroundColor Gray
        Write-Host "   Role: $($login.user.role)" -ForegroundColor Gray
        
        $global:TOKEN = $login.access_token
    } else {
        Write-Host "❌ Login: No token received" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Login: Failed ($($_.Exception.Message))" -ForegroundColor Red
}

Write-Host ""

# Test 5: Protected Route (Users)
if ($global:TOKEN) {
    Write-Host "5️⃣ اختبار Protected Route (/users)..." -ForegroundColor Yellow
    try {
        $headers = @{
            Authorization = "Bearer $global:TOKEN"
        }
        $users = Invoke-RestMethod -Uri "$API_URL/users" -Method Get -Headers $headers -ErrorAction Stop
        Write-Host "✅ /users: OK (Found $($users.Count) users)" -ForegroundColor Green
    } catch {
        Write-Host "❌ /users: Failed ($($_.Exception.Message))" -ForegroundColor Red
    }
} else {
    Write-Host "5️⃣ ⏭️  تخطي Protected Routes (لا يوجد token)" -ForegroundColor Gray
}

Write-Host ""

# Test 6: Database Connection (via migration check)
Write-Host "6️⃣ اختبار Database Connection..." -ForegroundColor Yellow
if ($global:TOKEN) {
    try {
        $headers = @{
            Authorization = "Bearer $global:TOKEN"
        }
        # Try to fetch roles (should work if DB is connected)
        $test = Invoke-RestMethod -Uri "$API_URL/roles" -Method Get -Headers $headers -ErrorAction Stop
        Write-Host "✅ Database: OK (Connected)" -ForegroundColor Green
    } catch {
        if ($_.Exception.Response.StatusCode -eq 404) {
            Write-Host "⚠️  Database: Connected (endpoint might not exist)" -ForegroundColor Yellow
        } else {
            Write-Host "❌ Database: Failed ($($_.Exception.Message))" -ForegroundColor Red
        }
    }
} else {
    Write-Host "⏭️  تخطي Database test (لا يوجد token)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=== 📊 النتيجة ===" -ForegroundColor Cyan
Write-Host "الرابط: $API_URL" -ForegroundColor White
Write-Host "Swagger: $API_URL/docs" -ForegroundColor White
Write-Host ""

# Summary
Write-Host "💡 نصائح:" -ForegroundColor Yellow
Write-Host "  - إذا كانت جميع الاختبارات ✅، الـ API يعمل بشكل صحيح"
Write-Host "  - إذا كان Login ❌، راجع Environment Variables في Vercel"
Write-Host "  - إذا كان Database ❌، راجع DATABASE_URL و Migrations"
Write-Host "  - راجع: VERCEL_TROUBLESHOOTING.md للتفاصيل"
Write-Host ""
