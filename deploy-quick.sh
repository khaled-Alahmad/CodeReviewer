#!/bin/bash

# =====================================
# نشر سريع (تحديث الكود فقط)
# =====================================

set -e

# عدّل هذه القيم
VPS_USER="admin"
VPS_HOST="your-vps-ip.com"
DOMAIN="yourdomain.com"
REMOTE_PATH="/home/$VPS_USER/web/$DOMAIN/nodeapp"

echo "🔨 بناء المشروع..."
npm run build

echo "🚀 رفع التحديثات..."
rsync -avz --delete \
  dist/ $VPS_USER@$VPS_HOST:$REMOTE_PATH/dist/

echo "🔄 إعادة تشغيل التطبيق..."
ssh $VPS_USER@$VPS_HOST "cd $REMOTE_PATH && pm2 restart $DOMAIN"

echo "✅ تم التحديث بنجاح! 🎉"
