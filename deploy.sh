#!/bin/bash

# =====================================
# سكريبت النشر المباشر إلى HestiaCP
# =====================================

set -e  # إيقاف عند أي خطأ

# ====== التكوين - عدّل هذه القيم ======
VPS_USER="admin"                    # مستخدم HestiaCP (غالباً admin)
VPS_HOST="your-vps-ip.com"         # IP أو Domain الخاص بـ VPS
DOMAIN="yourdomain.com"             # النطاق الخاص بك
DB_NAME="school_db"                 # اسم قاعدة البيانات
DB_USER="school_user"               # مستخدم قاعدة البيانات
DB_PASS="yourStrongPassword"        # كلمة مرور قاعدة البيانات
# =======================================

REMOTE_PATH="/home/$VPS_USER/web/$DOMAIN/nodeapp"

echo "🔨 بناء المشروع..."
npm run build

echo "📦 تجهيز الملفات..."
# إنشاء مجلد مؤقت للنشر
rm -rf deploy_temp
mkdir -p deploy_temp

# نسخ الملفات الضرورية
cp -r dist deploy_temp/
cp -r shared deploy_temp/
cp package.json package-lock.json deploy_temp/
cp drizzle.config.ts deploy_temp/

# إنشاء ملف .env للإنتاج
cat > deploy_temp/.env << EOF
NODE_ENV=production
PORT=\${PORT:-5000}
DATABASE_URL=postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME
SESSION_SECRET=$(openssl rand -base64 32)
EOF

echo "🚀 نشر الملفات إلى VPS..."
# رفع الملفات (بدون node_modules)
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude 'client' \
  --exclude 'server' \
  --exclude 'deploy_temp' \
  deploy_temp/ $VPS_USER@$VPS_HOST:$REMOTE_PATH/

echo "📊 نشر قاعدة البيانات..."
# رفع قاعدة البيانات إذا كانت موجودة
if [ -f "database_backup.sql" ]; then
  scp database_backup.sql $VPS_USER@$VPS_HOST:/tmp/db_backup.sql
  
  # تمرير المتغيرات عبر ssh
  ssh $VPS_USER@$VPS_HOST "DB_USER='$DB_USER' DB_NAME='$DB_NAME' DB_PASS='$DB_PASS' bash -s" << 'ENDSSH'
    # استيراد البيانات (فقط إذا كانت القاعدة فارغة)
    export PGPASSWORD="$DB_PASS"
    if ! psql -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1 FROM students LIMIT 1" 2>/dev/null; then
      echo "استيراد البيانات..."
      psql -U "$DB_USER" -d "$DB_NAME" < /tmp/db_backup.sql
      rm /tmp/db_backup.sql
    else
      echo "⚠️  القاعدة تحتوي على بيانات، تم تخطي الاستيراد"
    fi
    unset PGPASSWORD
ENDSSH
fi

echo "📥 تثبيت الحزم على VPS..."
ssh $VPS_USER@$VPS_HOST << ENDSSH
  cd $REMOTE_PATH
  
  # تثبيت الحزم
  npm install --production
  
  # إعادة تشغيل التطبيق مع PM2
  if pm2 describe $DOMAIN &>/dev/null; then
    echo "إعادة تشغيل التطبيق..."
    pm2 restart $DOMAIN
  else
    echo "تشغيل التطبيق لأول مرة..."
    pm2 start dist/index.js --name $DOMAIN
    pm2 save
  fi
  
  # عرض الحالة
  pm2 status
ENDSSH

echo "🧹 تنظيف الملفات المؤقتة..."
rm -rf deploy_temp

echo ""
echo "✅ ============================================="
echo "✅  تم النشر بنجاح! 🎉"
echo "✅ ============================================="
echo ""
echo "📍 الخطوة التالية في لوحة HestiaCP:"
echo "   1. اذهب إلى Web → $DOMAIN → Edit"
echo "   2. Advanced Options → Proxy Template → NodeJS"
echo "   3. Save"
echo ""
echo "🌐 موقعك: https://$DOMAIN"
echo "📊 سجلات التطبيق: pm2 logs $DOMAIN"
echo ""
