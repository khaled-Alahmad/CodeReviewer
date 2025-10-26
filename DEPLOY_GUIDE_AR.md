# 🚀 دليل النشر المباشر على HestiaCP

## ✅ ما تم إعداده:

تم إنشاء سكريبتات نشر تلقائية:

1. **`deploy.sh`** - النشر الكامل (أول مرة أو عند تغيير قاعدة البيانات)
2. **`deploy-quick.sh`** - تحديث سريع (فقط الكود)

---

## 📋 الخطوات المطلوبة:

### **المرحلة 1: إعداد VPS (مرة واحدة)**

#### 1. اتصل بـ VPS عبر SSH:
```bash
ssh root@your-vps-ip
```

#### 2. ثبّت إضافة Node.js:
```bash
cd /usr/local/src
git clone https://github.com/cristiancosano/hestiacp-nodejs.git
cd hestiacp-nodejs
chmod +x install.sh
./install.sh
```

#### 3. أنشئ قاعدة بيانات PostgreSQL:

**من واجهة HestiaCP:**
- اذهب إلى **Databases** → **PostgreSQL**
- اضغط **Add Database**
- املأ:
  - Database: `school_db`
  - User: `school_user`
  - Password: (كلمة مرور قوية - احفظها!)

**أو من Terminal:**
```bash
v-add-database admin school_db school_user YourStrongPass123 postgresql
```

#### 4. أنشئ النطاق (Domain) في HestiaCP:
- اذهب إلى **Web**
- اضغط **Add Web Domain**
- أدخل النطاق: `yourdomain.com`
- احفظ

#### 5. أنشئ مجلد التطبيق:
```bash
mkdir -p /home/admin/web/yourdomain.com/nodeapp
chown -R admin:admin /home/admin/web/yourdomain.com/nodeapp
```

---

### **المرحلة 2: إعداد SSH من Replit (مرة واحدة)**

#### 1. إنشاء SSH Key في Replit:
```bash
# في Shell الخاص بـ Replit
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""
cat ~/.ssh/id_rsa.pub
```

#### 2. انسخ المفتاح العام واذهب لـ VPS:
```bash
# على VPS
nano /home/admin/.ssh/authorized_keys
# الصق المفتاح العام واحفظ
```

#### 3. اختبر الاتصال من Replit:
```bash
ssh admin@your-vps-ip
# يجب أن يدخل مباشرة بدون كلمة مرور
```

---

### **المرحلة 3: تعديل سكريبت النشر**

افتح ملف `deploy.sh` وعدّل:

```bash
VPS_USER="admin"                    # مستخدم HestiaCP
VPS_HOST="123.45.67.89"            # IP الخاص بـ VPS (أو النطاق)
DOMAIN="yourdomain.com"             # النطاق الخاص بك
DB_NAME="school_db"                 # اسم قاعدة البيانات
DB_USER="school_user"               # مستخدم قاعدة البيانات
DB_PASS="YourStrongPass123"         # كلمة مرور قاعدة البيانات
```

افعل نفس الشيء لـ `deploy-quick.sh`

---

### **المرحلة 4: النشر! 🚀**

#### **النشر الكامل (أول مرة):**
```bash
# في Replit Shell
chmod +x deploy.sh
./deploy.sh
```

هذا سيقوم بـ:
- ✅ بناء المشروع
- ✅ رفع الملفات
- ✅ استيراد قاعدة البيانات
- ✅ تثبيت الحزم
- ✅ تشغيل التطبيق مع PM2

#### **تحديث سريع (بعد تعديل الكود):**
```bash
chmod +x deploy-quick.sh
./deploy-quick.sh
```

---

### **المرحلة 5: تفعيل Node.js في HestiaCP**

**مهم جداً - آخر خطوة!**

1. افتح لوحة HestiaCP
2. اذهب إلى **Web** → اختر `yourdomain.com`
3. اضغط **Edit**
4. **Advanced Options** → **Proxy Template** → اختر **"NodeJS"**
5. اضغط **Save**

الآن موقعك يعمل! 🎉

---

## 🔍 فحص الحالة والسجلات

### على VPS:
```bash
# حالة التطبيق
pm2 status

# السجلات المباشرة
pm2 logs yourdomain.com

# إعادة تشغيل
pm2 restart yourdomain.com

# إيقاف
pm2 stop yourdomain.com
```

### في HestiaCP:
- **Web** → النطاق → **Statistics**
- **Logs** → سجلات Nginx

---

## 🛠️ استكشاف الأخطاء

### المشكلة: لا يمكن الاتصال بـ VPS
**الحل:**
```bash
# تأكد من SSH key
ssh-add ~/.ssh/id_rsa
ssh -v admin@your-vps-ip
```

### المشكلة: 502 Bad Gateway
**الحل:**
1. تحقق من أن PM2 يعمل: `pm2 status`
2. تحقق من Port في `.env`: `PORT=5000`
3. أعد تطبيق Proxy Template في HestiaCP

### المشكلة: خطأ في قاعدة البيانات
**الحل:**
```bash
# على VPS
psql -U school_user -d school_db
# اختبر الاتصال
\dt  # عرض الجداول
```

---

## 🎯 النشر التلقائي (اختياري)

لنشر تلقائي عند كل تحديث:

1. ارفع المشروع على GitHub
2. أنشئ GitHub Action (ملف `.github/workflows/deploy.yml`)
3. كل مرة تدفع تحديث، سيُنشر تلقائياً!

---

## 📝 ملخص الأوامر السريعة

```bash
# النشر الكامل (أول مرة)
./deploy.sh

# تحديث سريع
./deploy-quick.sh

# فحص الحالة (على VPS)
ssh admin@vps "pm2 status"

# السجلات (على VPS)
ssh admin@vps "pm2 logs yourdomain.com --lines 50"
```

---

## ✅ قائمة التحقق النهائية

- [ ] تثبيت إضافة hestiacp-nodejs على VPS
- [ ] إنشاء قاعدة بيانات PostgreSQL
- [ ] إنشاء النطاق في HestiaCP
- [ ] إعداد SSH key بين Replit و VPS
- [ ] تعديل `deploy.sh` بمعلوماتك
- [ ] تشغيل `./deploy.sh`
- [ ] تفعيل Proxy Template "NodeJS" في HestiaCP
- [ ] فتح الموقع: `https://yourdomain.com`

---

**🎉 مبروك! موقعك الآن على الهواء مباشرة!**
