# دليل النشر على HestiaCP

## 📦 محتويات الحزمة

هذا الملف المضغوط يحتوي على:
- `dist/` - المشروع المبني للإنتاج
- `package.json` - قائمة الحزم المطلوبة
- `database_backup.sql` - نسخة احتياطية من قاعدة البيانات
- `.env.production.example` - ملف مثال لمتغيرات البيئة
- `shared/` - الملفات المشتركة المطلوبة

## 🚀 خطوات النشر على HestiaCP

### 1️⃣ إعداد قاعدة البيانات

1. سجل دخول إلى HestiaCP
2. اذهب إلى **Databases** → **PostgreSQL**
3. أنشئ قاعدة بيانات جديدة:
   - اسم القاعدة: `school_db` (أو أي اسم تريده)
   - مستخدم: أنشئ مستخدم جديد
   - كلمة المرور: احفظها

4. **استيراد البيانات:**
   - افتح phpPgAdmin أو استخدم SSH
   - نفذ الأمر التالي لاستيراد البيانات:
   ```bash
   psql -U username -d database_name < database_backup.sql
   ```

### 2️⃣ رفع الملفات

1. ارفع محتويات الملف المضغوط إلى مجلد التطبيق الخاص بك
2. يمكنك استخدام FTP أو File Manager في HestiaCP

### 3️⃣ تثبيت Node.js والحزم

1. تأكد من تثبيت Node.js (الإصدار 18 أو أحدث)
2. افتح SSH أو Terminal في HestiaCP
3. انتقل إلى مجلد المشروع:
   ```bash
   cd /path/to/your/project
   ```

4. ثبت الحزم المطلوبة:
   ```bash
   npm install --production
   ```

### 4️⃣ إعداد ملف البيئة

1. انسخ ملف `.env.production.example` إلى `.env`:
   ```bash
   cp .env.production.example .env
   ```

2. عدّل ملف `.env` بمعلوماتك:
   ```bash
   nano .env
   ```

3. ضع معلومات قاعدة البيانات الصحيحة:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   ```

### 5️⃣ تشغيل التطبيق

#### الطريقة الأولى - استخدام PM2 (موصى بها):

```bash
# تثبيت PM2
npm install -g pm2

# تشغيل التطبيق
pm2 start dist/index.js --name school-app

# حفظ التطبيق ليعمل تلقائياً عند إعادة التشغيل
pm2 save
pm2 startup
```

#### الطريقة الثانية - استخدام npm:

```bash
npm start
```

#### الطريقة الثالثة - استخدام systemd:

أنشئ ملف خدمة systemd:

```bash
sudo nano /etc/systemd/system/school-app.service
```

أضف المحتوى التالي:

```ini
[Unit]
Description=School Management System
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/your/project
Environment=NODE_ENV=production
ExecStart=/usr/bin/node dist/index.js
Restart=always

[Install]
WantedBy=multi-user.target
```

ثم:
```bash
sudo systemctl daemon-reload
sudo systemctl start school-app
sudo systemctl enable school-app
```

### 6️⃣ إعداد Reverse Proxy (NGINX)

في HestiaCP، أضف تكوين NGINX:

```nginx
location / {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

### 7️⃣ التحقق من التشغيل

1. تحقق من أن التطبيق يعمل:
   ```bash
   pm2 status
   # أو
   curl http://localhost:5000
   ```

2. افتح المتصفح واذهب إلى رابط موقعك

## 🔧 استكشاف الأخطاء

### المشكلة: لا يمكن الاتصال بقاعدة البيانات

**الحل:**
- تحقق من صحة `DATABASE_URL` في ملف `.env`
- تأكد من أن PostgreSQL يعمل: `systemctl status postgresql`
- تأكد من أن المستخدم لديه صلاحيات الوصول

### المشكلة: خطأ في المنفذ (Port already in use)

**الحل:**
- غيّر المنفذ في ملف `.env` إلى منفذ آخر مثل 3000 أو 8080
- أو أوقف التطبيق الذي يستخدم المنفذ 5000

### المشكلة: الملفات الثابتة لا تظهر

**الحل:**
- تأكد من بناء المشروع: `npm run build`
- تحقق من وجود مجلد `dist/public`

## 📝 متطلبات السيرفر

- Node.js 18 أو أحدث
- PostgreSQL 14 أو أحدث
- الذاكرة: على الأقل 1GB RAM
- المساحة: على الأقل 500MB

## 🔐 الأمان

1. **غيّر SESSION_SECRET** في ملف `.env` إلى قيمة عشوائية آمنة
2. **استخدم HTTPS** للاتصالات الآمنة
3. **قم بتحديث الحزم** بانتظام: `npm update`
4. **نسخ احتياطي** لقاعدة البيانات بشكل دوري

## 📞 الدعم

إذا واجهت أي مشاكل:
1. راجع سجلات PM2: `pm2 logs school-app`
2. راجع سجلات النظام: `journalctl -u school-app`
3. تحقق من سجلات NGINX: `/var/log/nginx/error.log`

---

**ملاحظة:** هذا التطبيق مبني باستخدام React + Express + PostgreSQL
