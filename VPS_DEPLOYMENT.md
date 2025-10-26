# دليل نشر نظام إدارة المدرسة على VPS

## المتطلبات الأساسية

### على VPS:
- Ubuntu 20.04 أو أحدث
- Node.js 20.x
- PostgreSQL 14 أو أحدث
- Nginx (للـ reverse proxy)
- PM2 (لإدارة العمليات)

## خطوات النشر

### 1. تجهيز الخادم

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# تثبيت PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# تثبيت PM2 عالمياً
sudo npm install -g pm2

# تثبيت Nginx
sudo apt install -y nginx
```

### 2. إعداد قاعدة البيانات

```bash
# الدخول إلى PostgreSQL
sudo -u postgres psql

# إنشاء قاعدة بيانات ومستخدم
CREATE DATABASE school_management;
CREATE USER school_admin WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE school_management TO school_admin;
\q

# استيراد النسخة الاحتياطية
psql -U school_admin -d school_management < database_backup.sql
```

### 3. رفع المشروع

```bash
# إنشاء مجلد للمشروع
sudo mkdir -p /var/www/school-management
sudo chown -R $USER:$USER /var/www/school-management
cd /var/www/school-management

# رفع ملفات المشروع (استخدم scp أو git)
# مثال باستخدام scp من جهازك المحلي:
# scp -r /path/to/project/* user@your-vps-ip:/var/www/school-management/
```

### 4. تكوين المتغيرات البيئية

```bash
# إنشاء ملف .env
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://school_admin:your_secure_password@localhost:5432/school_management
SESSION_SECRET=your_very_long_random_secret_key_here
EOF
```

### 5. تثبيت التبعيات وبناء المشروع

```bash
# تثبيت التبعيات
npm install --production

# بناء المشروع
npm run build
```

### 6. تشغيل التطبيق باستخدام PM2

```bash
# تشغيل التطبيق
pm2 start npm --name "school-management" -- start

# حفظ التكوين للتشغيل التلقائي عند إعادة التشغيل
pm2 save
pm2 startup

# التحقق من الحالة
pm2 status
pm2 logs school-management
```

### 7. إعداد Nginx كـ Reverse Proxy

```bash
# إنشاء ملف تكوين Nginx
sudo nano /etc/nginx/sites-available/school-management
```

أضف المحتوى التالي:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# تفعيل التكوين
sudo ln -s /etc/nginx/sites-available/school-management /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. تثبيت SSL (اختياري لكن موصى به)

```bash
# تثبيت Certbot
sudo apt install -y certbot python3-certbot-nginx

# الحصول على شهادة SSL
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## الأوامر المفيدة

### إدارة التطبيق:
```bash
pm2 restart school-management    # إعادة تشغيل
pm2 stop school-management        # إيقاف
pm2 start school-management       # تشغيل
pm2 logs school-management        # عرض السجلات
pm2 monit                          # مراقبة الأداء
```

### نسخ احتياطي للقاعدة:
```bash
pg_dump -U school_admin school_management > backup_$(date +%Y%m%d_%H%M%S).sql
```

### استعادة من نسخة احتياطية:
```bash
psql -U school_admin -d school_management < backup_file.sql
```

## الأمان

1. **تغيير كلمات المرور الافتراضية**
2. **تفعيل Firewall:**
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```
3. **تحديث النظام بانتظام:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

## استكشاف الأخطاء

### التطبيق لا يعمل:
```bash
pm2 logs school-management --lines 100
```

### مشاكل قاعدة البيانات:
```bash
sudo -u postgres psql
\l                          # عرض القواعد
\c school_management        # الاتصال بالقاعدة
\dt                         # عرض الجداول
```

### مشاكل Nginx:
```bash
sudo nginx -t               # فحص التكوين
sudo tail -f /var/log/nginx/error.log
```

## ملاحظات مهمة

- **النسخ الاحتياطي**: قم بعمل نسخ احتياطية منتظمة لقاعدة البيانات
- **المراقبة**: راقب استخدام الموارد (CPU, RAM, Disk)
- **التحديثات**: حدّث التبعيات بانتظام: `npm update`
- **السجلات**: تحقق من السجلات بشكل دوري
