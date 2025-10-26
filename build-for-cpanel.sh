#!/bin/bash

# =====================================
# بناء المشروع لـ cPanel
# =====================================

set -e

echo "🔨 بناء Frontend كـ Static Files..."
npm run build

echo "📦 إنشاء حزمة للرفع على cPanel..."

# إنشاء مجلد للـ static files
rm -rf cpanel-frontend
mkdir -p cpanel-frontend

# نسخ الملفات الثابتة
cp -r dist/public/* cpanel-frontend/

# إنشاء ملف .htaccess للتوجيه
cat > cpanel-frontend/.htaccess << 'EOF'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
EOF

# إنشاء ملف تكوين للـ API endpoint
cat > cpanel-frontend/config.js << EOF
// تكوين API - عدّل هذا الرابط بعد نشر Backend على Railway
window.API_URL = 'https://your-backend.up.railway.app';
EOF

echo ""
echo "✅ ================================="
echo "✅  تم البناء بنجاح!"
echo "✅ ================================="
echo ""
echo "📁 الملفات الجاهزة في: cpanel-frontend/"
echo ""
echo "📋 الخطوات التالية:"
echo "  1. ارفع محتويات مجلد 'cpanel-frontend' إلى public_html في cPanel"
echo "  2. انشر Backend على Railway (3 نقرات)"
echo "  3. عدّل ملف config.js بعنوان API الجديد"
echo ""
