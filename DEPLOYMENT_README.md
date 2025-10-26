# دليل النشر السريع - نظام إدارة المدرسة

## 📦 الملفات المتوفرة للنشر

1. **database_backup.sql** - نسخة احتياطية كاملة من قاعدة البيانات
2. **deploy.sh** - سكريبت نشر تلقائي لـ HestiaCP
3. **VPS_DEPLOYMENT.md** - دليل تفصيلي للنشر اليدوي
4. **.env.example** - مثال على ملف المتغيرات البيئية

## 🚀 طريقة النشر السريع (HestiaCP)

### الخطوة 1: تعديل ملف deploy.sh

افتح ملف `deploy.sh` وعدّل المتغيرات التالية:

```bash
VPS_USER="admin"                    # مستخدم VPS الخاص بك
VPS_HOST="your-vps-ip.com"         # IP أو Domain الـ VPS
DOMAIN="yourdomain.com"             # النطاق الخاص بك
DB_NAME="school_db"                 # اسم قاعدة البيانات
DB_USER="school_user"               # مستخدم قاعدة البيانات
DB_PASS="yourStrongPassword"        # كلمة مرور قوية
```

### الخطوة 2: تشغيل سكريبت النشر

```bash
chmod +x deploy.sh
./deploy.sh
```

### الخطوة 3: إعداد Proxy في HestiaCP

1. افتح لوحة HestiaCP
2. اذهب إلى **Web** → اختر النطاق → **Edit**
3. في **Advanced Options** → اختر **Proxy Template** → **NodeJS**
4. احفظ التغييرات

## 📝 طريقة النشر اليدوي (أي VPS)

راجع ملف **VPS_DEPLOYMENT.md** للحصول على تعليمات تفصيلية شاملة.

## 🗄️ استيراد قاعدة البيانات

### على VPS:

```bash
# إنشاء قاعدة البيانات
sudo -u postgres psql
CREATE DATABASE school_management;
CREATE USER school_admin WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE school_management TO school_admin;
\q

# استيراد النسخة الاحتياطية
psql -U school_admin -d school_management < database_backup.sql
```

## ⚙️ المتغيرات البيئية المطلوبة

أنشئ ملف `.env` من `.env.example`:

```bash
cp .env.example .env
nano .env
```

عدّل القيم التالية:
- `DATABASE_URL` - رابط الاتصال بقاعدة البيانات
- `SESSION_SECRET` - مفتاح عشوائي طويل (32 حرف على الأقل)
- `NODE_ENV=production`

## 🔧 بناء وتشغيل المشروع

```bash
# تثبيت التبعيات
npm install

# بناء المشروع
npm run build

# تطبيق تغييرات قاعدة البيانات
npm run db:push --force

# تشغيل التطبيق
npm start

# أو باستخدام PM2 (موصى به)
pm2 start npm --name "school-management" -- start
pm2 save
pm2 startup
```

## 🔐 الأمان

### تغيير كلمات المرور الافتراضية
تأكد من تغيير جميع كلمات المرور في:
- قاعدة البيانات
- ملف `.env`
- لوحة HestiaCP

### تفعيل Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### الحصول على SSL مجاني

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## 📊 مراقبة التطبيق

```bash
# عرض حالة التطبيق
pm2 status

# عرض السجلات المباشرة
pm2 logs school-management

# مراقبة الموارد
pm2 monit

# إعادة تشغيل التطبيق
pm2 restart school-management
```

## 🆘 استكشاف الأخطاء

### التطبيق لا يعمل؟

1. تحقق من السجلات: `pm2 logs school-management`
2. تحقق من اتصال قاعدة البيانات
3. تأكد من صحة متغيرات البيئة في `.env`

### مشاكل قاعدة البيانات؟

```bash
# التحقق من قاعدة البيانات
sudo -u postgres psql -l

# الاتصال بقاعدة البيانات
psql -U school_admin -d school_management

# عرض الجداول
\dt
```

## 📞 الدعم

للمساعدة الإضافية، راجع:
- `VPS_DEPLOYMENT.md` - دليل النشر الكامل
- سجلات التطبيق: `pm2 logs`
- سجلات النظام: `/var/log/nginx/error.log`

---

**ملاحظة**: هذا النظام تم تطويره بواسطة **TRENDIFY PLUS**
