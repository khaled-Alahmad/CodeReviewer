# نظام المصادقة - School Management System

## نظرة عامة

تم بناء نظام مصادقة متكامل وآمن للنظام المدرسي باستخدام Passport.js مع Local Strategy، يتضمن ثلاثة أنواع من المستخدمين بصلاحيات مختلفة.

## الأدوار الثلاثة للمستخدمين

### 1. إدارة المدرسة (Admin)
**الصلاحيات:**
- وصول كامل لجميع أجزاء النظام
- إدارة الطلاب والمعلمين
- إدارة الصفوف والمواد
- إدارة الحضور والدرجات
- إدارة الحسابات المالية
- إدارة إعدادات المدرسة
- إنشاء وتعديل حسابات المستخدمين

### 2. المعلمون (Teacher)
**الصلاحيات:**
- إضافة وتعديل درجات الطلاب المسجلين لديهم
- عرض معلومات الطلاب في صفوفهم
- عرض حضور الطلاب
- عرض المواد التي يدرسونها

**القيود:**
- لا يمكنهم حذف أو تعديل معلومات الطلاب
- لا يمكنهم الوصول للحسابات المالية
- لا يمكنهم تعديل إعدادات النظام

### 3. الأهالي (Parent)
**الصلاحيات:**
- الاطلاع على تقارير أولادهم فقط
- عرض درجات أولادهم
- عرض حضور أولادهم
- طباعة التقارير الدراسية

**القيود:**
- لا يمكنهم تعديل أي بيانات
- لا يمكنهم عرض معلومات طلاب آخرين

## البنية التقنية

### Backend

#### 1. قاعدة البيانات
**جدول Users:**
```sql
CREATE TABLE users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- Hashed with scrypt
  role user_role NOT NULL DEFAULT 'admin',
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**جدول Teacher_Users (ربط المعلمين):**
```sql
CREATE TABLE teacher_users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR UNIQUE REFERENCES users(id),
  teacher_id VARCHAR UNIQUE REFERENCES teachers(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**جدول Parent_Students (ربط الأهالي بالطلاب):**
```sql
CREATE TABLE parent_students (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR REFERENCES users(id),
  student_id VARCHAR REFERENCES students(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. تشفير كلمات المرور
- استخدام **scrypt** من Node.js crypto module
- كل كلمة مرور يتم تشفيرها مع salt عشوائي
- لا يمكن استرجاع كلمة المرور الأصلية

```typescript
// في server/auth.ts
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
```

#### 3. إدارة الجلسات (Sessions)
- استخدام **express-session** مع **connect-pg-simple**
- تخزين الجلسات في PostgreSQL
- مدة الجلسة: 30 يوماً
- تشفير cookie في بيئة الإنتاج

```typescript
const sessionSettings: session.SessionOptions = {
  store: new PostgresSessionStore({ 
    pool, 
    createTableIfMissing: true 
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
};
```

#### 4. Passport.js Strategy
```typescript
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user || !(await comparePasswords(password, user.password))) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }),
);
```

### Frontend

#### 1. AuthContext & useAuth Hook
```typescript
// في client/src/hooks/use-auth.tsx
export function useAuth() {
  const context = useContext(AuthContext);
  // user, isLoading, loginMutation, logoutMutation, registerMutation
  return context;
}
```

#### 2. ProtectedRoute Component
```typescript
// في client/src/lib/protected-route.tsx
export function ProtectedRoute({
  path,
  component: Component,
  allowedRoles, // اختياري - لتقييد الوصول حسب الدور
}) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <LoadingScreen />;
  if (!user) return <Redirect to="/auth" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <UnauthorizedScreen />;
  }
  
  return <Component />;
}
```

#### 3. صفحة المصادقة (AuthPage)
- تبويبات لتسجيل الدخول وإنشاء حساب جديد
- تصميم عربي RTL كامل
- Hero section مع شرح مزايا النظام
- رسائل خطأ واضحة بالعربية

## API Endpoints

### POST /api/register
إنشاء حساب جديد (للأهالي فقط - الإدارة تنشئ حسابات المعلمين والإداريين)

**⚠️ مهم:** التسجيل الذاتي يسمح فقط بإنشاء حسابات للأهالي. يتم فرض role="parent" تلقائياً.

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "fullName": "string",
  "email": "string" (optional)
}
```

**Response:** User object (بدون حقل password)

### POST /api/login
تسجيل الدخول

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:** User object (بدون حقل password)

### POST /api/logout
تسجيل الخروج

**Response:** 200 OK

### GET /api/user
الحصول على المستخدم الحالي

**Response:** User object (بدون حقل password) أو 401 إذا لم يكن مسجل الدخول

## Middleware للحماية

### 1. requireAuth
يتحقق من تسجيل الدخول فقط

```typescript
function requireAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "يجب تسجيل الدخول أولاً" });
  }
  next();
}
```

### 2. requireAdmin
يتحقق من صلاحيات الإدارة

```typescript
function requireAdmin(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "يجب تسجيل الدخول أولاً" });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "غير مصرح بهذا الإجراء" });
  }
  next();
}
```

### 3. requireTeacher
يتحقق من صلاحيات المعلم

```typescript
function requireTeacher(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "يجب تسجيل الدخول أولاً" });
  }
  if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
    return res.status(403).json({ error: "غير مصرح بهذا الإجراء" });
  }
  next();
}
```

## بيانات الاعتماد الافتراضية

### Admin Account
```
Username: admin
Password: admin123
Role: admin
Full Name: مدير النظام
Email: admin@school.com
```

**⚠️ مهم:** يجب تغيير كلمة المرور بعد أول تسجيل دخول في بيئة الإنتاج!

## متغيرات البيئة المطلوبة

```env
# في ملف .env
SESSION_SECRET=your-very-secret-session-key-here-change-in-production
DATABASE_URL=your-database-connection-string
NODE_ENV=production # or development
```

**⚠️ مهم:** 
- **SESSION_SECRET إلزامي** - النظام لن يعمل بدونه
- استخدم مفتاح سري قوي وطويل (32+ حرف)
- يمكن توليد مفتاح قوي باستخدام: `openssl rand -base64 32`
- لا تشارك المفتاح السري مع أحد

## إنشاء Admin User الأول

### الطريقة الوحيدة: استخدام Seed Script
```bash
npx tsx server/seed-admin.ts
```

**ملاحظة:** التسجيل الذاتي من خلال واجهة `/auth` يسمح فقط بإنشاء حسابات للأهالي (role="parent"). 
لإنشاء حسابات للمعلمين أو الإداريين، يجب استخدام Seed Script أو إنشائها من لوحة التحكم بواسطة Admin.

## الأمان والحماية

### ✅ ما تم تطبيقه:
1. ✅ تشفير كلمات المرور باستخدام scrypt
2. ✅ حماية CSRF عبر session tokens
3. ✅ HttpOnly cookies للحماية من XSS
4. ✅ Secure cookies في الإنتاج (HTTPS فقط)
5. ✅ Password hashing with random salt
6. ✅ Session expiry (30 days)
7. ✅ Role-based access control
8. ✅ Protected routes على الفرونت إند والباك إند
9. ✅ Schema validation للـ registration endpoint
10. ✅ إزالة password من جميع API responses
11. ✅ فرض role="parent" للتسجيل الذاتي
12. ✅ SESSION_SECRET مطلوب وإلزامي

### 🔒 التوصيات للإنتاج:
1. 🔐 استخدم HTTPS دائماً
2. 🔑 غيّر SESSION_SECRET قبل النشر
3. 👤 غيّر كلمة مرور admin الافتراضية
4. 📧 فعّل التحقق من البريد الإلكتروني
5. 🔄 أضف نظام استرجاع كلمة المرور
6. 🕐 قلل مدة الجلسة للمستخدمين الحساسين
7. 📊 راقب محاولات تسجيل الدخول الفاشلة
8. 🚫 أضف Rate Limiting للحماية من Brute Force

## الاختبار

تم اختبار النظام بالكامل باستخدام Playwright:

✅ إعادة التوجيه التلقائي للمستخدمين غير المسجلين  
✅ تسجيل الدخول بنجاح  
✅ إعادة التوجيه للـ Dashboard بعد تسجيل الدخول  
✅ تسجيل الخروج  
✅ حماية المسارات من الوصول غير المصرح  

## الدعم الفني

للمساعدة أو الاستفسارات:
- راجع ملف `replit.md` للتفاصيل التقنية
- راجع `server/auth.ts` للكود الخاص بالمصادقة
- راجع `client/src/hooks/use-auth.tsx` للاستخدام في الفرونت إند
