var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  assessmentTypeEnum: () => assessmentTypeEnum,
  attendance: () => attendance,
  attendanceRelations: () => attendanceRelations,
  attendanceStatusEnum: () => attendanceStatusEnum,
  classSubjects: () => classSubjects,
  classSubjectsRelations: () => classSubjectsRelations,
  classes: () => classes,
  classesRelations: () => classesRelations,
  dateTypeEnum: () => dateTypeEnum,
  educationLevels: () => educationLevels,
  educationLevelsRelations: () => educationLevelsRelations,
  genderEnum: () => genderEnum,
  grades: () => grades,
  gradesRelations: () => gradesRelations,
  insertAttendanceSchema: () => insertAttendanceSchema,
  insertClassSchema: () => insertClassSchema,
  insertClassSubjectSchema: () => insertClassSubjectSchema,
  insertEducationLevelSchema: () => insertEducationLevelSchema,
  insertGradeSchema: () => insertGradeSchema,
  insertNotificationSchema: () => insertNotificationSchema,
  insertPaymentSchema: () => insertPaymentSchema,
  insertPaymentTransactionSchema: () => insertPaymentTransactionSchema,
  insertSchoolExpenseSchema: () => insertSchoolExpenseSchema,
  insertSchoolSettingsSchema: () => insertSchoolSettingsSchema,
  insertStudentAccountSchema: () => insertStudentAccountSchema,
  insertStudentSchema: () => insertStudentSchema,
  insertSubjectSchema: () => insertSubjectSchema,
  insertTeacherAdvanceSchema: () => insertTeacherAdvanceSchema,
  insertTeacherSalarySchema: () => insertTeacherSalarySchema,
  insertTeacherSchema: () => insertTeacherSchema,
  insertUserSchema: () => insertUserSchema,
  notifications: () => notifications,
  notificationsRelations: () => notificationsRelations,
  paymentStatusEnum: () => paymentStatusEnum,
  paymentTransactions: () => paymentTransactions,
  paymentTransactionsRelations: () => paymentTransactionsRelations,
  payments: () => payments,
  paymentsRelations: () => paymentsRelations,
  schoolExpenses: () => schoolExpenses,
  schoolExpensesRelations: () => schoolExpensesRelations,
  schoolSettings: () => schoolSettings,
  studentAccounts: () => studentAccounts,
  studentAccountsRelations: () => studentAccountsRelations,
  studentStatusEnum: () => studentStatusEnum,
  students: () => students,
  studentsRelations: () => studentsRelations,
  subjects: () => subjects,
  subjectsRelations: () => subjectsRelations,
  teacherAdvances: () => teacherAdvances,
  teacherAdvancesRelations: () => teacherAdvancesRelations,
  teacherSalaries: () => teacherSalaries,
  teacherSalariesRelations: () => teacherSalariesRelations,
  teacherStatusEnum: () => teacherStatusEnum,
  teachers: () => teachers,
  teachersRelations: () => teachersRelations,
  users: () => users
});
import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, date, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var studentStatusEnum = pgEnum("student_status", ["active", "suspended", "graduated", "transferred"]);
var teacherStatusEnum = pgEnum("teacher_status", ["active", "on_leave", "resigned"]);
var attendanceStatusEnum = pgEnum("attendance_status", ["present", "absent", "late", "excused"]);
var paymentStatusEnum = pgEnum("payment_status", ["paid", "pending", "overdue", "partial"]);
var genderEnum = pgEnum("gender", ["male", "female"]);
var assessmentTypeEnum = pgEnum("assessment_type", ["\u0645\u0630\u0627\u0643\u0631\u0629", "\u0627\u0645\u062A\u062D\u0627\u0646 \u0646\u0647\u0627\u0626\u064A", "\u0648\u0627\u062C\u0628", "\u0645\u0634\u0627\u0631\u0643\u0629", "\u0627\u062E\u062A\u0628\u0627\u0631 \u0642\u0635\u064A\u0631", "\u0645\u0634\u0631\u0648\u0639", "\u0646\u0634\u0627\u0637"]);
var dateTypeEnum = pgEnum("date_type", ["gregorian", "hijri"]);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"),
  // admin, teacher, parent
  createdAt: timestamp("created_at").defaultNow()
});
var students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  arabicName: text("arabic_name").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  gender: genderEnum("gender").notNull(),
  nationalId: text("national_id").unique(),
  enrollmentDate: date("enrollment_date").notNull(),
  classId: varchar("class_id").references(() => classes.id),
  parentName: text("parent_name").notNull(),
  parentPhone: text("parent_phone").notNull(),
  parentEmail: text("parent_email"),
  address: text("address"),
  medicalNotes: text("medical_notes"),
  status: studentStatusEnum("status").notNull().default("active"),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var teachers = pgTable("teachers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  arabicName: text("arabic_name").notNull(),
  email: text("email").unique().notNull(),
  phone: text("phone").notNull(),
  gender: genderEnum("gender").notNull(),
  dateOfBirth: date("date_of_birth"),
  hireDate: date("hire_date").notNull(),
  qualification: text("qualification"),
  specialization: text("specialization"),
  monthlySalary: decimal("monthly_salary", { precision: 10, scale: 2 }).notNull().default("0"),
  status: teacherStatusEnum("status").notNull().default("active"),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var subjects = pgTable("subjects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  arabicName: text("arabic_name").notNull(),
  code: text("code").unique().notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow()
});
var educationLevels = pgTable("education_levels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  // e.g., "الابتدائية", "المتوسطة", "الثانوية"
  order: integer("order").notNull(),
  // للترتيب
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow()
});
var classes = pgTable("classes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  educationLevelId: varchar("education_level_id").references(() => educationLevels.id),
  // المرحلة الدراسية
  name: text("name").notNull(),
  // e.g., "الصف الأول"
  grade: text("grade").notNull(),
  // e.g., "الأول", "الثاني"
  section: text("section").notNull(),
  // أ، ب، ج
  academicYear: text("academic_year").notNull(),
  // e.g., "2024-2025"
  capacity: integer("capacity").notNull().default(30),
  roomNumber: text("room_number"),
  teacherId: varchar("teacher_id").references(() => teachers.id),
  // Class teacher
  createdAt: timestamp("created_at").defaultNow()
});
var classSubjects = pgTable("class_subjects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  educationLevelId: varchar("education_level_id").notNull().references(() => educationLevels.id),
  grade: text("grade").notNull(),
  subjectId: varchar("subject_id").notNull().references(() => subjects.id),
  teacherId: varchar("teacher_id").references(() => teachers.id),
  weeklyHours: integer("weekly_hours").notNull().default(2),
  createdAt: timestamp("created_at").defaultNow()
});
var grades = pgTable("grades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => students.id),
  subjectId: varchar("subject_id").notNull().references(() => subjects.id),
  classId: varchar("class_id").notNull().references(() => classes.id),
  semester: text("semester").notNull(),
  // e.g., "الفصل الأول", "الفصل الثاني", "الفصل الثالث"
  assessmentType: assessmentTypeEnum("assessment_type").notNull(),
  score: decimal("score", { precision: 5, scale: 2 }).notNull(),
  maxScore: decimal("max_score", { precision: 5, scale: 2 }).notNull().default("100"),
  date: date("date").notNull(),
  teacherId: varchar("teacher_id").references(() => teachers.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});
var attendance = pgTable("attendance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => students.id),
  classId: varchar("class_id").notNull().references(() => classes.id),
  date: date("date").notNull(),
  status: attendanceStatusEnum("status").notNull(),
  notes: text("notes"),
  recordedBy: varchar("recorded_by").references(() => teachers.id),
  createdAt: timestamp("created_at").defaultNow()
});
var payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => students.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: date("due_date").notNull(),
  paymentDate: date("payment_date"),
  status: paymentStatusEnum("status").notNull().default("pending"),
  paymentType: text("payment_type").notNull(),
  // tuition, registration, transport, etc.
  academicYear: text("academic_year").notNull(),
  month: text("month"),
  // for monthly fees
  notes: text("notes"),
  receiptNumber: text("receipt_number"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var studentAccounts = pgTable("student_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().unique().references(() => students.id),
  totalAmountDue: decimal("total_amount_due", { precision: 10, scale: 2 }).notNull().default("0"),
  totalPaid: decimal("total_paid", { precision: 10, scale: 2 }).notNull().default("0"),
  currentBalance: decimal("current_balance", { precision: 10, scale: 2 }).notNull().default("0"),
  academicYear: text("academic_year").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var paymentTransactions = pgTable("payment_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentAccountId: varchar("student_account_id").notNull().references(() => studentAccounts.id),
  studentId: varchar("student_id").notNull().references(() => students.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentDate: date("payment_date").notNull(),
  paymentMethod: text("payment_method"),
  // cash, bank_transfer, card, etc.
  receiptNumber: text("receipt_number"),
  notes: text("notes"),
  recordedBy: varchar("recorded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow()
});
var notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(),
  // announcement, alert, reminder, event
  targetAudience: text("target_audience").notNull(),
  // all, students, parents, teachers, specific_class
  targetClassId: varchar("target_class_id").references(() => classes.id),
  priority: text("priority").notNull().default("normal"),
  // low, normal, high, urgent
  isRead: boolean("is_read").notNull().default(false),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow()
});
var schoolSettings = pgTable("school_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolName: text("school_name").notNull(),
  schoolNameArabic: text("school_name_arabic").notNull(),
  currentAcademicYear: text("current_academic_year").notNull(),
  currency: text("currency").notNull().default("SAR"),
  dateType: dateTypeEnum("date_type").notNull().default("gregorian"),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  logoUrl: text("logo_url"),
  primaryColor: text("primary_color").default("#3b82f6"),
  accentColor: text("accent_color").default("#10b981"),
  updatedAt: timestamp("updated_at").defaultNow()
});
var teacherSalaries = pgTable("teacher_salaries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teacherId: varchar("teacher_id").notNull().references(() => teachers.id),
  month: text("month").notNull(),
  // e.g., "2025-01"
  baseSalary: decimal("base_salary", { precision: 10, scale: 2 }).notNull(),
  bonuses: decimal("bonuses", { precision: 10, scale: 2 }).notNull().default("0"),
  deductions: decimal("deductions", { precision: 10, scale: 2 }).notNull().default("0"),
  advancesDeducted: decimal("advances_deducted", { precision: 10, scale: 2 }).notNull().default("0"),
  netSalary: decimal("net_salary", { precision: 10, scale: 2 }).notNull(),
  paymentDate: date("payment_date"),
  status: text("status").notNull().default("pending"),
  // pending, paid
  notes: text("notes"),
  recordedBy: varchar("recorded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var teacherAdvances = pgTable("teacher_advances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teacherId: varchar("teacher_id").notNull().references(() => teachers.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  advanceDate: date("advance_date").notNull(),
  deductionMonth: text("deduction_month"),
  // e.g., "2025-02" - when it will be deducted
  status: text("status").notNull().default("pending"),
  // pending, deducted
  notes: text("notes"),
  recordedBy: varchar("recorded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow()
});
var schoolExpenses = pgTable("school_expenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(),
  // utilities, maintenance, supplies, transportation, etc.
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  expenseDate: date("expense_date").notNull(),
  paymentMethod: text("payment_method"),
  // cash, bank_transfer, card
  receiptNumber: text("receipt_number"),
  vendorName: text("vendor_name"),
  notes: text("notes"),
  recordedBy: varchar("recorded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow()
});
var studentsRelations = relations(students, ({ one, many }) => ({
  class: one(classes, {
    fields: [students.classId],
    references: [classes.id]
  }),
  grades: many(grades),
  attendance: many(attendance),
  payments: many(payments),
  account: one(studentAccounts),
  paymentTransactions: many(paymentTransactions)
}));
var teachersRelations = relations(teachers, ({ many }) => ({
  classes: many(classes),
  classSubjects: many(classSubjects),
  grades: many(grades),
  attendanceRecords: many(attendance),
  salaries: many(teacherSalaries),
  advances: many(teacherAdvances)
}));
var educationLevelsRelations = relations(educationLevels, ({ many }) => ({
  classes: many(classes),
  classSubjects: many(classSubjects)
}));
var classesRelations = relations(classes, ({ one, many }) => ({
  educationLevel: one(educationLevels, {
    fields: [classes.educationLevelId],
    references: [educationLevels.id]
  }),
  teacher: one(teachers, {
    fields: [classes.teacherId],
    references: [teachers.id]
  }),
  students: many(students),
  grades: many(grades),
  attendance: many(attendance),
  notifications: many(notifications)
}));
var subjectsRelations = relations(subjects, ({ many }) => ({
  classSubjects: many(classSubjects),
  grades: many(grades)
}));
var classSubjectsRelations = relations(classSubjects, ({ one }) => ({
  educationLevel: one(educationLevels, {
    fields: [classSubjects.educationLevelId],
    references: [educationLevels.id]
  }),
  subject: one(subjects, {
    fields: [classSubjects.subjectId],
    references: [subjects.id]
  }),
  teacher: one(teachers, {
    fields: [classSubjects.teacherId],
    references: [teachers.id]
  })
}));
var gradesRelations = relations(grades, ({ one }) => ({
  student: one(students, {
    fields: [grades.studentId],
    references: [students.id]
  }),
  subject: one(subjects, {
    fields: [grades.subjectId],
    references: [subjects.id]
  }),
  class: one(classes, {
    fields: [grades.classId],
    references: [classes.id]
  }),
  teacher: one(teachers, {
    fields: [grades.teacherId],
    references: [teachers.id]
  })
}));
var attendanceRelations = relations(attendance, ({ one }) => ({
  student: one(students, {
    fields: [attendance.studentId],
    references: [students.id]
  }),
  class: one(classes, {
    fields: [attendance.classId],
    references: [classes.id]
  }),
  recordedByTeacher: one(teachers, {
    fields: [attendance.recordedBy],
    references: [teachers.id]
  })
}));
var paymentsRelations = relations(payments, ({ one }) => ({
  student: one(students, {
    fields: [payments.studentId],
    references: [students.id]
  })
}));
var studentAccountsRelations = relations(studentAccounts, ({ one, many }) => ({
  student: one(students, {
    fields: [studentAccounts.studentId],
    references: [students.id]
  }),
  transactions: many(paymentTransactions)
}));
var paymentTransactionsRelations = relations(paymentTransactions, ({ one }) => ({
  studentAccount: one(studentAccounts, {
    fields: [paymentTransactions.studentAccountId],
    references: [studentAccounts.id]
  }),
  student: one(students, {
    fields: [paymentTransactions.studentId],
    references: [students.id]
  }),
  recordedByUser: one(users, {
    fields: [paymentTransactions.recordedBy],
    references: [users.id]
  })
}));
var notificationsRelations = relations(notifications, ({ one }) => ({
  targetClass: one(classes, {
    fields: [notifications.targetClassId],
    references: [classes.id]
  }),
  creator: one(users, {
    fields: [notifications.createdBy],
    references: [users.id]
  })
}));
var teacherSalariesRelations = relations(teacherSalaries, ({ one }) => ({
  teacher: one(teachers, {
    fields: [teacherSalaries.teacherId],
    references: [teachers.id]
  }),
  recordedByUser: one(users, {
    fields: [teacherSalaries.recordedBy],
    references: [users.id]
  })
}));
var teacherAdvancesRelations = relations(teacherAdvances, ({ one }) => ({
  teacher: one(teachers, {
    fields: [teacherAdvances.teacherId],
    references: [teachers.id]
  }),
  recordedByUser: one(users, {
    fields: [teacherAdvances.recordedBy],
    references: [users.id]
  })
}));
var schoolExpensesRelations = relations(schoolExpenses, ({ one }) => ({
  recordedByUser: one(users, {
    fields: [schoolExpenses.recordedBy],
    references: [users.id]
  })
}));
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertTeacherSchema = createInsertSchema(teachers).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertSubjectSchema = createInsertSchema(subjects).omit({
  id: true,
  createdAt: true
});
var insertEducationLevelSchema = createInsertSchema(educationLevels).omit({
  id: true,
  createdAt: true
});
var insertClassSchema = createInsertSchema(classes).omit({
  id: true,
  createdAt: true
});
var insertClassSubjectSchema = createInsertSchema(classSubjects).omit({
  id: true,
  createdAt: true
});
var insertGradeSchema = createInsertSchema(grades).omit({
  id: true,
  createdAt: true
});
var insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
  createdAt: true
});
var insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true
});
var insertSchoolSettingsSchema = createInsertSchema(schoolSettings).omit({
  id: true,
  updatedAt: true
});
var insertStudentAccountSchema = createInsertSchema(studentAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertPaymentTransactionSchema = createInsertSchema(paymentTransactions).omit({
  id: true,
  createdAt: true
});
var insertTeacherSalarySchema = createInsertSchema(teacherSalaries).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertTeacherAdvanceSchema = createInsertSchema(teacherAdvances).omit({
  id: true,
  createdAt: true
});
var insertSchoolExpenseSchema = createInsertSchema(schoolExpenses).omit({
  id: true,
  createdAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, and, desc, gte, lte, like } from "drizzle-orm";
var DatabaseStorage = class {
  // Users
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  // Students
  async getAllStudents() {
    return await db.select().from(students).orderBy(desc(students.createdAt));
  }
  async getStudent(id) {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student || void 0;
  }
  async getStudentsByClass(classId) {
    return await db.select().from(students).where(eq(students.classId, classId));
  }
  async createStudent(student) {
    const [newStudent] = await db.insert(students).values(student).returning();
    return newStudent;
  }
  async updateStudent(id, student) {
    const [updated] = await db.update(students).set({ ...student, updatedAt: /* @__PURE__ */ new Date() }).where(eq(students.id, id)).returning();
    return updated;
  }
  async deleteStudent(id) {
    await db.transaction(async (tx) => {
      await tx.delete(paymentTransactions).where(eq(paymentTransactions.studentId, id));
      await tx.delete(studentAccounts).where(eq(studentAccounts.studentId, id));
      await tx.delete(payments).where(eq(payments.studentId, id));
      await tx.delete(attendance).where(eq(attendance.studentId, id));
      await tx.delete(grades).where(eq(grades.studentId, id));
      await tx.delete(students).where(eq(students.id, id));
    });
  }
  async searchStudents(query) {
    return await db.select().from(students).where(like(students.arabicName, `%${query}%`)).orderBy(desc(students.createdAt));
  }
  // Teachers
  async getAllTeachers() {
    return await db.select().from(teachers).orderBy(desc(teachers.createdAt));
  }
  async getTeacher(id) {
    const [teacher] = await db.select().from(teachers).where(eq(teachers.id, id));
    return teacher || void 0;
  }
  async createTeacher(teacher) {
    const [newTeacher] = await db.insert(teachers).values(teacher).returning();
    return newTeacher;
  }
  async updateTeacher(id, teacher) {
    const [updated] = await db.update(teachers).set({ ...teacher, updatedAt: /* @__PURE__ */ new Date() }).where(eq(teachers.id, id)).returning();
    return updated;
  }
  async deleteTeacher(id) {
    await db.transaction(async (tx) => {
      await tx.delete(teacherAdvances).where(eq(teacherAdvances.teacherId, id));
      await tx.delete(teacherSalaries).where(eq(teacherSalaries.teacherId, id));
      await tx.delete(classSubjects).where(eq(classSubjects.teacherId, id));
      await tx.update(classes).set({ teacherId: null }).where(eq(classes.teacherId, id));
      await tx.update(grades).set({ teacherId: null }).where(eq(grades.teacherId, id));
      await tx.update(attendance).set({ recordedBy: null }).where(eq(attendance.recordedBy, id));
      await tx.delete(teachers).where(eq(teachers.id, id));
    });
  }
  // Subjects
  async getAllSubjects() {
    return await db.select().from(subjects).orderBy(subjects.arabicName);
  }
  async getSubject(id) {
    const [subject] = await db.select().from(subjects).where(eq(subjects.id, id));
    return subject || void 0;
  }
  async createSubject(subject) {
    const [newSubject] = await db.insert(subjects).values(subject).returning();
    return newSubject;
  }
  async updateSubject(id, subject) {
    const [updated] = await db.update(subjects).set(subject).where(eq(subjects.id, id)).returning();
    return updated;
  }
  async deleteSubject(id) {
    await db.delete(subjects).where(eq(subjects.id, id));
  }
  // Education Levels
  async getAllEducationLevels() {
    return await db.select().from(educationLevels).orderBy(educationLevels.order);
  }
  async getEducationLevel(id) {
    const [level] = await db.select().from(educationLevels).where(eq(educationLevels.id, id));
    return level || void 0;
  }
  async createEducationLevel(level) {
    const [newLevel] = await db.insert(educationLevels).values(level).returning();
    return newLevel;
  }
  async updateEducationLevel(id, level) {
    const [updated] = await db.update(educationLevels).set(level).where(eq(educationLevels.id, id)).returning();
    return updated;
  }
  async deleteEducationLevel(id) {
    await db.delete(educationLevels).where(eq(educationLevels.id, id));
  }
  // Classes
  async getAllClasses() {
    return await db.select().from(classes).orderBy(classes.grade, classes.section);
  }
  async getClass(id) {
    const [classData] = await db.select().from(classes).where(eq(classes.id, id));
    return classData || void 0;
  }
  async getClassesByEducationLevel(levelId) {
    return await db.select().from(classes).where(eq(classes.educationLevelId, levelId)).orderBy(classes.grade, classes.section);
  }
  async createClass(classData) {
    const [newClass] = await db.insert(classes).values(classData).returning();
    return newClass;
  }
  async updateClass(id, classData) {
    const [updated] = await db.update(classes).set(classData).where(eq(classes.id, id)).returning();
    return updated;
  }
  async deleteClass(id) {
    await db.delete(classes).where(eq(classes.id, id));
  }
  // Class Subjects (Grade-level)
  async getGradeSubjects(educationLevelId, grade) {
    return await db.select().from(classSubjects).where(and(
      eq(classSubjects.educationLevelId, educationLevelId),
      eq(classSubjects.grade, grade)
    ));
  }
  async getAllClassSubjects() {
    return await db.select().from(classSubjects);
  }
  async createClassSubject(classSubject) {
    const [newClassSubject] = await db.insert(classSubjects).values(classSubject).returning();
    return newClassSubject;
  }
  async deleteClassSubject(id) {
    await db.delete(classSubjects).where(eq(classSubjects.id, id));
  }
  // Grades
  async getAllGrades() {
    return await db.select().from(grades).orderBy(desc(grades.date));
  }
  async getStudentGrades(studentId) {
    return await db.select().from(grades).where(eq(grades.studentId, studentId)).orderBy(desc(grades.date));
  }
  async getClassGrades(classId) {
    return await db.select().from(grades).where(eq(grades.classId, classId)).orderBy(desc(grades.date));
  }
  async createGrade(grade) {
    const percentage = Number(grade.score) / Number(grade.maxScore) * 100;
    const [newGrade] = await db.insert(grades).values({ ...grade, percentage: percentage.toString() }).returning();
    return newGrade;
  }
  async updateGrade(id, grade) {
    const [updated] = await db.update(grades).set(grade).where(eq(grades.id, id)).returning();
    return updated;
  }
  async deleteGrade(id) {
    await db.delete(grades).where(eq(grades.id, id));
  }
  // Attendance
  async getStudentAttendance(studentId, startDate, endDate) {
    if (startDate && endDate) {
      return await db.select().from(attendance).where(
        and(
          eq(attendance.studentId, studentId),
          gte(attendance.date, startDate),
          lte(attendance.date, endDate)
        )
      ).orderBy(desc(attendance.date));
    }
    return await db.select().from(attendance).where(eq(attendance.studentId, studentId)).orderBy(desc(attendance.date));
  }
  async getClassAttendance(classId, date2) {
    return await db.select().from(attendance).where(and(
      eq(attendance.classId, classId),
      eq(attendance.date, date2)
    ));
  }
  async getAllAttendance() {
    return await db.select().from(attendance);
  }
  async createAttendance(attendanceData) {
    const [newAttendance] = await db.insert(attendance).values(attendanceData).returning();
    return newAttendance;
  }
  async updateAttendance(id, attendanceData) {
    const [updated] = await db.update(attendance).set(attendanceData).where(eq(attendance.id, id)).returning();
    return updated;
  }
  // Payments
  async getStudentPayments(studentId) {
    return await db.select().from(payments).where(eq(payments.studentId, studentId)).orderBy(desc(payments.dueDate));
  }
  async getAllPayments() {
    return await db.select().from(payments).orderBy(desc(payments.dueDate));
  }
  async getPendingPayments() {
    return await db.select().from(payments).where(eq(payments.status, "pending")).orderBy(desc(payments.dueDate));
  }
  async createPayment(payment) {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }
  async updatePayment(id, payment) {
    const [updated] = await db.update(payments).set({ ...payment, updatedAt: /* @__PURE__ */ new Date() }).where(eq(payments.id, id)).returning();
    return updated;
  }
  // Notifications
  async getAllNotifications() {
    return await db.select().from(notifications).orderBy(desc(notifications.createdAt));
  }
  async getNotification(id) {
    const [notification] = await db.select().from(notifications).where(eq(notifications.id, id));
    return notification || void 0;
  }
  async createNotification(notification) {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }
  async markNotificationAsRead(id) {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
  }
  // School Settings
  async getSchoolSettings() {
    const [settings] = await db.select().from(schoolSettings).limit(1);
    return settings || void 0;
  }
  async updateSchoolSettings(settings) {
    const existing = await this.getSchoolSettings();
    if (existing) {
      const [updated] = await db.update(schoolSettings).set({ ...settings, updatedAt: /* @__PURE__ */ new Date() }).where(eq(schoolSettings.id, existing.id)).returning();
      return updated;
    } else {
      const [created] = await db.insert(schoolSettings).values(settings).returning();
      return created;
    }
  }
  // Student Accounts
  async getStudentAccount(studentId) {
    const [account] = await db.select().from(studentAccounts).where(eq(studentAccounts.studentId, studentId));
    return account || void 0;
  }
  async createStudentAccount(account) {
    const [newAccount] = await db.insert(studentAccounts).values(account).returning();
    return newAccount;
  }
  async updateStudentAccount(id, account) {
    const [updated] = await db.update(studentAccounts).set({ ...account, updatedAt: /* @__PURE__ */ new Date() }).where(eq(studentAccounts.id, id)).returning();
    return updated;
  }
  async getAllStudentAccounts() {
    return await db.select().from(studentAccounts).orderBy(desc(studentAccounts.createdAt));
  }
  // Payment Transactions
  async getStudentTransactions(studentId) {
    return await db.select().from(paymentTransactions).where(eq(paymentTransactions.studentId, studentId)).orderBy(desc(paymentTransactions.paymentDate));
  }
  async createPaymentTransaction(transaction) {
    const [newTransaction] = await db.insert(paymentTransactions).values(transaction).returning();
    return newTransaction;
  }
  async getAllTransactions() {
    return await db.select().from(paymentTransactions).orderBy(desc(paymentTransactions.paymentDate));
  }
  async deletePaymentTransaction(id) {
    const [transaction] = await db.select().from(paymentTransactions).where(eq(paymentTransactions.id, id));
    if (!transaction) return;
    await db.delete(paymentTransactions).where(eq(paymentTransactions.id, id));
    const account = await this.getStudentAccount(transaction.studentId);
    if (account) {
      const newTotalPaid = Number(account.totalPaid) - Number(transaction.amount);
      const newBalance = Number(account.totalAmountDue) - newTotalPaid;
      await this.updateStudentAccount(account.id, {
        totalPaid: newTotalPaid.toFixed(2),
        currentBalance: newBalance.toFixed(2)
      });
    }
  }
  // Teacher Salaries
  async getTeacherSalaries(teacherId) {
    return await db.select().from(teacherSalaries).where(eq(teacherSalaries.teacherId, teacherId)).orderBy(desc(teacherSalaries.month));
  }
  async getAllTeacherSalaries(month) {
    if (month) {
      return await db.select().from(teacherSalaries).where(eq(teacherSalaries.month, month)).orderBy(desc(teacherSalaries.createdAt));
    }
    return await db.select().from(teacherSalaries).orderBy(desc(teacherSalaries.month));
  }
  async createTeacherSalary(salary) {
    const [newSalary] = await db.insert(teacherSalaries).values(salary).returning();
    return newSalary;
  }
  async updateTeacherSalary(id, salary) {
    const [updated] = await db.update(teacherSalaries).set({ ...salary, updatedAt: /* @__PURE__ */ new Date() }).where(eq(teacherSalaries.id, id)).returning();
    return updated;
  }
  async deleteTeacherSalary(id) {
    await db.delete(teacherSalaries).where(eq(teacherSalaries.id, id));
  }
  // Teacher Advances
  async getTeacherAdvances(teacherId) {
    return await db.select().from(teacherAdvances).where(eq(teacherAdvances.teacherId, teacherId)).orderBy(desc(teacherAdvances.advanceDate));
  }
  async getAllTeacherAdvances(status) {
    if (status) {
      return await db.select().from(teacherAdvances).where(eq(teacherAdvances.status, status)).orderBy(desc(teacherAdvances.advanceDate));
    }
    return await db.select().from(teacherAdvances).orderBy(desc(teacherAdvances.advanceDate));
  }
  async createTeacherAdvance(advance) {
    const [newAdvance] = await db.insert(teacherAdvances).values(advance).returning();
    return newAdvance;
  }
  async updateTeacherAdvance(id, advance) {
    const [updated] = await db.update(teacherAdvances).set(advance).where(eq(teacherAdvances.id, id)).returning();
    return updated;
  }
  async deleteTeacherAdvance(id) {
    await db.delete(teacherAdvances).where(eq(teacherAdvances.id, id));
  }
  // School Expenses
  async getAllSchoolExpenses(startDate, endDate) {
    if (startDate && endDate) {
      return await db.select().from(schoolExpenses).where(and(
        gte(schoolExpenses.expenseDate, startDate),
        lte(schoolExpenses.expenseDate, endDate)
      )).orderBy(desc(schoolExpenses.expenseDate));
    }
    return await db.select().from(schoolExpenses).orderBy(desc(schoolExpenses.expenseDate));
  }
  async getSchoolExpensesByCategory(category) {
    return await db.select().from(schoolExpenses).where(eq(schoolExpenses.category, category)).orderBy(desc(schoolExpenses.expenseDate));
  }
  async createSchoolExpense(expense) {
    const [newExpense] = await db.insert(schoolExpenses).values(expense).returning();
    return newExpense;
  }
  async updateSchoolExpense(id, expense) {
    const [updated] = await db.update(schoolExpenses).set(expense).where(eq(schoolExpenses.id, id)).returning();
    return updated;
  }
  async deleteSchoolExpense(id) {
    await db.delete(schoolExpenses).where(eq(schoolExpenses.id, id));
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/students", async (req, res) => {
    try {
      const students2 = await storage.getAllStudents();
      res.json(students2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch students" });
    }
  });
  app2.get("/api/students/:id", async (req, res) => {
    try {
      const student = await storage.getStudent(req.params.id);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch student" });
    }
  });
  app2.get("/api/students/class/:classId", async (req, res) => {
    try {
      const students2 = await storage.getStudentsByClass(req.params.classId);
      res.json(students2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch students by class" });
    }
  });
  app2.post("/api/students", async (req, res) => {
    try {
      const validatedData = insertStudentSchema.parse(req.body);
      const student = await storage.createStudent(validatedData);
      res.status(201).json(student);
    } catch (error) {
      res.status(400).json({ error: "Invalid student data" });
    }
  });
  app2.patch("/api/students/:id", async (req, res) => {
    try {
      const { id, createdAt, updatedAt, ...updateData } = req.body;
      const updateSchema = insertStudentSchema.partial();
      const validatedData = updateSchema.parse(updateData);
      const student = await storage.updateStudent(req.params.id, validatedData);
      res.json(student);
    } catch (error) {
      res.status(400).json({ error: "Failed to update student" });
    }
  });
  app2.delete("/api/students/:id", async (req, res) => {
    try {
      await storage.deleteStudent(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete student" });
    }
  });
  app2.get("/api/students/search/:query", async (req, res) => {
    try {
      const students2 = await storage.searchStudents(req.params.query);
      res.json(students2);
    } catch (error) {
      res.status(500).json({ error: "Failed to search students" });
    }
  });
  app2.get("/api/teachers", async (req, res) => {
    try {
      const teachers2 = await storage.getAllTeachers();
      res.json(teachers2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teachers" });
    }
  });
  app2.get("/api/teachers/:id", async (req, res) => {
    try {
      const teacher = await storage.getTeacher(req.params.id);
      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }
      res.json(teacher);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teacher" });
    }
  });
  app2.post("/api/teachers", async (req, res) => {
    try {
      const validatedData = insertTeacherSchema.parse(req.body);
      const teacher = await storage.createTeacher(validatedData);
      res.status(201).json(teacher);
    } catch (error) {
      console.error("Teacher creation error:", error);
      if (error.code === "23505" && error.constraint === "teachers_email_unique") {
        return res.status(400).json({ error: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0645\u0648\u062C\u0648\u062F \u0628\u0627\u0644\u0641\u0639\u0644. \u0627\u0644\u0631\u062C\u0627\u0621 \u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0628\u0631\u064A\u062F \u0622\u062E\u0631." });
      }
      res.status(400).json({ error: "\u062E\u0637\u0623 \u0641\u064A \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u062F\u062E\u0644\u0629" });
    }
  });
  app2.patch("/api/teachers/:id", async (req, res) => {
    try {
      const { id, createdAt, updatedAt, ...updateData } = req.body;
      const updateSchema = insertTeacherSchema.partial();
      const validatedData = updateSchema.parse(updateData);
      const teacher = await storage.updateTeacher(req.params.id, validatedData);
      res.json(teacher);
    } catch (error) {
      console.error("Teacher update error:", error);
      if (error.code === "23505" && error.constraint === "teachers_email_unique") {
        return res.status(400).json({ error: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0645\u0648\u062C\u0648\u062F \u0628\u0627\u0644\u0641\u0639\u0644. \u0627\u0644\u0631\u062C\u0627\u0621 \u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0628\u0631\u064A\u062F \u0622\u062E\u0631." });
      }
      res.status(400).json({ error: "\u0641\u0634\u0644 \u062A\u062D\u062F\u064A\u062B \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0639\u0644\u0645" });
    }
  });
  app2.delete("/api/teachers/:id", async (req, res) => {
    try {
      await storage.deleteTeacher(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete teacher" });
    }
  });
  app2.get("/api/subjects", async (req, res) => {
    try {
      const subjects2 = await storage.getAllSubjects();
      res.json(subjects2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subjects" });
    }
  });
  app2.post("/api/subjects", async (req, res) => {
    try {
      const validatedData = insertSubjectSchema.parse(req.body);
      const subject = await storage.createSubject(validatedData);
      res.status(201).json(subject);
    } catch (error) {
      res.status(400).json({ error: "Invalid subject data" });
    }
  });
  app2.patch("/api/subjects/:id", async (req, res) => {
    try {
      const { id, createdAt, ...updateData } = req.body;
      const updateSchema = insertSubjectSchema.partial();
      const validatedData = updateSchema.parse(updateData);
      const subject = await storage.updateSubject(req.params.id, validatedData);
      res.json(subject);
    } catch (error) {
      res.status(400).json({ error: "Failed to update subject" });
    }
  });
  app2.delete("/api/subjects/:id", async (req, res) => {
    try {
      await storage.deleteSubject(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete subject" });
    }
  });
  app2.get("/api/education-levels", async (req, res) => {
    try {
      const levels = await storage.getAllEducationLevels();
      res.json(levels);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch education levels" });
    }
  });
  app2.get("/api/education-levels/:id", async (req, res) => {
    try {
      const level = await storage.getEducationLevel(req.params.id);
      if (!level) {
        return res.status(404).json({ error: "Education level not found" });
      }
      res.json(level);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch education level" });
    }
  });
  app2.post("/api/education-levels", async (req, res) => {
    try {
      const validatedData = insertEducationLevelSchema.parse(req.body);
      const level = await storage.createEducationLevel(validatedData);
      res.status(201).json(level);
    } catch (error) {
      res.status(400).json({ error: "Invalid education level data" });
    }
  });
  app2.patch("/api/education-levels/:id", async (req, res) => {
    try {
      const { id, ...updateData } = req.body;
      const updateSchema = insertEducationLevelSchema.partial();
      const validatedData = updateSchema.parse(updateData);
      const level = await storage.updateEducationLevel(req.params.id, validatedData);
      res.json(level);
    } catch (error) {
      res.status(400).json({ error: "Failed to update education level" });
    }
  });
  app2.delete("/api/education-levels/:id", async (req, res) => {
    try {
      await storage.deleteEducationLevel(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete education level" });
    }
  });
  app2.get("/api/classes", async (req, res) => {
    try {
      const classes2 = await storage.getAllClasses();
      res.json(classes2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch classes" });
    }
  });
  app2.get("/api/classes/:id", async (req, res) => {
    try {
      const classData = await storage.getClass(req.params.id);
      if (!classData) {
        return res.status(404).json({ error: "Class not found" });
      }
      res.json(classData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch class" });
    }
  });
  app2.get("/api/classes/level/:levelId", async (req, res) => {
    try {
      const classes2 = await storage.getClassesByEducationLevel(req.params.levelId);
      res.json(classes2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch classes by education level" });
    }
  });
  app2.post("/api/classes", async (req, res) => {
    try {
      const validatedData = insertClassSchema.parse(req.body);
      const classData = await storage.createClass(validatedData);
      res.status(201).json(classData);
    } catch (error) {
      res.status(400).json({ error: "Invalid class data" });
    }
  });
  app2.patch("/api/classes/:id", async (req, res) => {
    try {
      const { id, createdAt, ...updateData } = req.body;
      const updateSchema = insertClassSchema.partial();
      const validatedData = updateSchema.parse(updateData);
      const classData = await storage.updateClass(req.params.id, validatedData);
      res.json(classData);
    } catch (error) {
      res.status(400).json({ error: "Failed to update class" });
    }
  });
  app2.delete("/api/classes/:id", async (req, res) => {
    try {
      await storage.deleteClass(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete class" });
    }
  });
  app2.get("/api/class-subjects", async (req, res) => {
    try {
      const classSubjects2 = await storage.getAllClassSubjects();
      res.json(classSubjects2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch class subjects" });
    }
  });
  app2.get("/api/grade-subjects/:educationLevelId/:grade", async (req, res) => {
    try {
      const classSubjects2 = await storage.getGradeSubjects(req.params.educationLevelId, req.params.grade);
      res.json(classSubjects2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch grade subjects" });
    }
  });
  app2.post("/api/class-subjects", async (req, res) => {
    try {
      const validatedData = insertClassSubjectSchema.parse(req.body);
      const classSubject = await storage.createClassSubject(validatedData);
      res.status(201).json(classSubject);
    } catch (error) {
      res.status(400).json({ error: "Invalid class subject data" });
    }
  });
  app2.delete("/api/class-subjects/:id", async (req, res) => {
    try {
      await storage.deleteClassSubject(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete class subject" });
    }
  });
  app2.get("/api/grades", async (req, res) => {
    try {
      const grades2 = await storage.getAllGrades();
      res.json(grades2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch all grades" });
    }
  });
  app2.get("/api/grades/class/all", async (req, res) => {
    try {
      const grades2 = await storage.getAllGrades();
      res.json(grades2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch all grades" });
    }
  });
  app2.get("/api/grades/student/:studentId", async (req, res) => {
    try {
      const grades2 = await storage.getStudentGrades(req.params.studentId);
      res.json(grades2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch student grades" });
    }
  });
  app2.get("/api/grades/class/:classId", async (req, res) => {
    try {
      const grades2 = await storage.getClassGrades(req.params.classId);
      res.json(grades2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch class grades" });
    }
  });
  app2.post("/api/grades", async (req, res) => {
    try {
      const validatedData = insertGradeSchema.parse(req.body);
      const scoreNum = parseFloat(validatedData.score);
      const maxScoreNum = parseFloat(validatedData.maxScore);
      if (scoreNum > maxScoreNum) {
        return res.status(400).json({
          error: `\u0627\u0644\u0639\u0644\u0627\u0645\u0629 \u0627\u0644\u062A\u064A \u062D\u0635\u0644 \u0639\u0644\u064A\u0647\u0627 \u0627\u0644\u0637\u0627\u0644\u0628 (${validatedData.score}) \u0644\u0627 \u064A\u0645\u0643\u0646 \u0623\u0646 \u062A\u0632\u064A\u062F \u0639\u0646 \u0627\u0644\u0639\u0644\u0627\u0645\u0629 \u0627\u0644\u0646\u0647\u0627\u0626\u064A\u0629 (${validatedData.maxScore})`
        });
      }
      const grade = await storage.createGrade(validatedData);
      res.status(201).json(grade);
    } catch (error) {
      res.status(400).json({ error: "Invalid grade data" });
    }
  });
  app2.patch("/api/grades/:id", async (req, res) => {
    try {
      const { id, createdAt, ...updateData } = req.body;
      const updateSchema = insertGradeSchema.partial();
      const validatedData = updateSchema.parse(updateData);
      if (validatedData.score && validatedData.maxScore) {
        const scoreNum = parseFloat(validatedData.score);
        const maxScoreNum = parseFloat(validatedData.maxScore);
        if (scoreNum > maxScoreNum) {
          return res.status(400).json({
            error: `\u0627\u0644\u0639\u0644\u0627\u0645\u0629 \u0627\u0644\u062A\u064A \u062D\u0635\u0644 \u0639\u0644\u064A\u0647\u0627 \u0627\u0644\u0637\u0627\u0644\u0628 (${validatedData.score}) \u0644\u0627 \u064A\u0645\u0643\u0646 \u0623\u0646 \u062A\u0632\u064A\u062F \u0639\u0646 \u0627\u0644\u0639\u0644\u0627\u0645\u0629 \u0627\u0644\u0646\u0647\u0627\u0626\u064A\u0629 (${validatedData.maxScore})`
          });
        }
      }
      const grade = await storage.updateGrade(req.params.id, validatedData);
      res.json(grade);
    } catch (error) {
      res.status(400).json({ error: "Failed to update grade" });
    }
  });
  app2.delete("/api/grades/:id", async (req, res) => {
    try {
      await storage.deleteGrade(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete grade" });
    }
  });
  app2.get("/api/attendance/student/:studentId", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const attendance2 = await storage.getStudentAttendance(
        req.params.studentId,
        startDate,
        endDate
      );
      res.json(attendance2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch student attendance" });
    }
  });
  app2.get("/api/attendance/class/:classId/:date", async (req, res) => {
    try {
      const attendance2 = await storage.getClassAttendance(req.params.classId, req.params.date);
      res.json(attendance2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch class attendance" });
    }
  });
  app2.post("/api/attendance", async (req, res) => {
    try {
      const validatedData = insertAttendanceSchema.parse(req.body);
      const attendance2 = await storage.createAttendance(validatedData);
      res.status(201).json(attendance2);
    } catch (error) {
      res.status(400).json({ error: "Invalid attendance data" });
    }
  });
  app2.patch("/api/attendance/:id", async (req, res) => {
    try {
      const { id, createdAt, ...updateData } = req.body;
      const updateSchema = insertAttendanceSchema.partial();
      const validatedData = updateSchema.parse(updateData);
      const attendance2 = await storage.updateAttendance(req.params.id, validatedData);
      res.json(attendance2);
    } catch (error) {
      res.status(400).json({ error: "Failed to update attendance" });
    }
  });
  app2.get("/api/payments", async (req, res) => {
    try {
      const payments2 = await storage.getAllPayments();
      res.json(payments2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });
  app2.get("/api/payments/student/:studentId", async (req, res) => {
    try {
      const payments2 = await storage.getStudentPayments(req.params.studentId);
      res.json(payments2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch student payments" });
    }
  });
  app2.get("/api/payments/pending", async (req, res) => {
    try {
      const payments2 = await storage.getPendingPayments();
      res.json(payments2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pending payments" });
    }
  });
  app2.post("/api/payments", async (req, res) => {
    try {
      const validatedData = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(validatedData);
      res.status(201).json(payment);
    } catch (error) {
      res.status(400).json({ error: "Invalid payment data" });
    }
  });
  app2.patch("/api/payments/:id", async (req, res) => {
    try {
      const { id, createdAt, updatedAt, ...updateData } = req.body;
      const updateSchema = insertPaymentSchema.partial();
      const validatedData = updateSchema.parse(updateData);
      const payment = await storage.updatePayment(req.params.id, validatedData);
      res.json(payment);
    } catch (error) {
      res.status(400).json({ error: "Failed to update payment" });
    }
  });
  app2.get("/api/accounting/accounts", async (req, res) => {
    try {
      const accounts = await storage.getAllStudentAccounts();
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch student accounts" });
    }
  });
  app2.get("/api/accounting/accounts/:studentId", async (req, res) => {
    try {
      const account = await storage.getStudentAccount(req.params.studentId);
      if (!account) {
        return res.status(404).json({ error: "Student account not found" });
      }
      res.json(account);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch student account" });
    }
  });
  app2.post("/api/accounting/accounts", async (req, res) => {
    try {
      const validatedData = insertStudentAccountSchema.parse(req.body);
      const account = await storage.createStudentAccount(validatedData);
      res.status(201).json(account);
    } catch (error) {
      res.status(400).json({ error: "Invalid account data" });
    }
  });
  app2.patch("/api/accounting/accounts/:id", async (req, res) => {
    try {
      const { id, createdAt, updatedAt, ...updateData } = req.body;
      const updateSchema = insertStudentAccountSchema.partial();
      const validatedData = updateSchema.parse(updateData);
      const account = await storage.updateStudentAccount(req.params.id, validatedData);
      res.json(account);
    } catch (error) {
      res.status(400).json({ error: "Failed to update account" });
    }
  });
  app2.post("/api/accounting/payments", async (req, res) => {
    try {
      const validatedData = insertPaymentTransactionSchema.parse(req.body);
      const transaction = await storage.createPaymentTransaction(validatedData);
      const account = await storage.getStudentAccount(validatedData.studentId);
      if (account) {
        const newTotalPaid = Number(account.totalPaid) + Number(validatedData.amount);
        const newBalance = Number(account.totalAmountDue) - newTotalPaid;
        await storage.updateStudentAccount(account.id, {
          totalPaid: newTotalPaid.toString(),
          currentBalance: newBalance.toString()
        });
      }
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ error: "Invalid payment transaction data" });
    }
  });
  app2.get("/api/accounting/transactions/:studentId", async (req, res) => {
    try {
      const transactions = await storage.getStudentTransactions(req.params.studentId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch student transactions" });
    }
  });
  app2.get("/api/accounting/transactions", async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch all transactions" });
    }
  });
  app2.delete("/api/accounting/transactions/:id", async (req, res) => {
    try {
      await storage.deletePaymentTransaction(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete payment transaction" });
    }
  });
  app2.get("/api/notifications", async (req, res) => {
    try {
      const notifications2 = await storage.getAllNotifications();
      res.json(notifications2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });
  app2.post("/api/notifications", async (req, res) => {
    try {
      const validatedData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(validatedData);
      res.status(201).json(notification);
    } catch (error) {
      res.status(400).json({ error: "Invalid notification data" });
    }
  });
  app2.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });
  app2.get("/api/school-settings", async (req, res) => {
    try {
      const settings = await storage.getSchoolSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch school settings" });
    }
  });
  app2.patch("/api/school-settings", async (req, res) => {
    try {
      const validatedData = insertSchoolSettingsSchema.partial().parse(req.body);
      const settings = await storage.updateSchoolSettings(validatedData);
      res.json(settings);
    } catch (error) {
      console.error("Failed to update school settings:", error);
      res.status(400).json({ error: "Failed to update school settings" });
    }
  });
  app2.get("/api/teacher-salaries/:teacherId", async (req, res) => {
    try {
      const salaries = await storage.getTeacherSalaries(req.params.teacherId);
      res.json(salaries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teacher salaries" });
    }
  });
  app2.get("/api/teacher-salaries", async (req, res) => {
    try {
      const { month } = req.query;
      const salaries = await storage.getAllTeacherSalaries(month);
      res.json(salaries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch all teacher salaries" });
    }
  });
  app2.post("/api/teacher-salaries", async (req, res) => {
    try {
      const validatedData = insertTeacherSalarySchema.parse(req.body);
      const pendingAdvances = (await storage.getTeacherAdvances(validatedData.teacherId)).filter((advance) => advance.status === "pending");
      const totalAdvances = pendingAdvances.reduce((sum, advance) => sum + Number(advance.amount), 0);
      const baseAmount = Number(validatedData.baseSalary);
      const bonusAmount = Number(validatedData.bonuses || 0);
      const deductionAmount = Number(validatedData.deductions || 0);
      const grossSalary = baseAmount + bonusAmount - deductionAmount;
      const netSalary = Math.max(0, grossSalary - totalAdvances);
      const salaryData = {
        ...validatedData,
        advancesDeducted: totalAdvances.toFixed(2),
        netSalary: netSalary.toFixed(2)
      };
      const salary = await storage.createTeacherSalary(salaryData);
      for (const advance of pendingAdvances) {
        await storage.updateTeacherAdvance(advance.id, { status: "deducted" });
      }
      res.status(201).json(salary);
    } catch (error) {
      res.status(400).json({ error: "Invalid teacher salary data" });
    }
  });
  app2.patch("/api/teacher-salaries/:id", async (req, res) => {
    try {
      const { id, createdAt, updatedAt, ...updateData } = req.body;
      const updateSchema = insertTeacherSalarySchema.partial();
      const validatedData = updateSchema.parse(updateData);
      const salary = await storage.updateTeacherSalary(req.params.id, validatedData);
      res.json(salary);
    } catch (error) {
      res.status(400).json({ error: "Failed to update teacher salary" });
    }
  });
  app2.delete("/api/teacher-salaries/:id", async (req, res) => {
    try {
      await storage.deleteTeacherSalary(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete teacher salary" });
    }
  });
  app2.get("/api/teacher-advances/:teacherId", async (req, res) => {
    try {
      const advances = await storage.getTeacherAdvances(req.params.teacherId);
      res.json(advances);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teacher advances" });
    }
  });
  app2.get("/api/teacher-advances", async (req, res) => {
    try {
      const { status } = req.query;
      const advances = await storage.getAllTeacherAdvances(status);
      res.json(advances);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch all teacher advances" });
    }
  });
  app2.post("/api/teacher-advances", async (req, res) => {
    try {
      const validatedData = insertTeacherAdvanceSchema.parse(req.body);
      const advance = await storage.createTeacherAdvance(validatedData);
      res.status(201).json(advance);
    } catch (error) {
      res.status(400).json({ error: "Invalid teacher advance data" });
    }
  });
  app2.patch("/api/teacher-advances/:id", async (req, res) => {
    try {
      const { id, createdAt, ...updateData } = req.body;
      const updateSchema = insertTeacherAdvanceSchema.partial();
      const validatedData = updateSchema.parse(updateData);
      const advance = await storage.updateTeacherAdvance(req.params.id, validatedData);
      res.json(advance);
    } catch (error) {
      res.status(400).json({ error: "Failed to update teacher advance" });
    }
  });
  app2.delete("/api/teacher-advances/:id", async (req, res) => {
    try {
      await storage.deleteTeacherAdvance(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete teacher advance" });
    }
  });
  app2.get("/api/school-expenses", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const expenses = await storage.getAllSchoolExpenses(startDate, endDate);
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch school expenses" });
    }
  });
  app2.get("/api/school-expenses/category/:category", async (req, res) => {
    try {
      const expenses = await storage.getSchoolExpensesByCategory(req.params.category);
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch expenses by category" });
    }
  });
  app2.post("/api/school-expenses", async (req, res) => {
    try {
      const validatedData = insertSchoolExpenseSchema.parse(req.body);
      const expense = await storage.createSchoolExpense(validatedData);
      res.status(201).json(expense);
    } catch (error) {
      res.status(400).json({ error: "Invalid school expense data" });
    }
  });
  app2.patch("/api/school-expenses/:id", async (req, res) => {
    try {
      const { id, createdAt, ...updateData } = req.body;
      const updateSchema = insertSchoolExpenseSchema.partial();
      const validatedData = updateSchema.parse(updateData);
      const expense = await storage.updateSchoolExpense(req.params.id, validatedData);
      res.json(expense);
    } catch (error) {
      res.status(400).json({ error: "Failed to update school expense" });
    }
  });
  app2.delete("/api/school-expenses/:id", async (req, res) => {
    try {
      await storage.deleteSchoolExpense(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete school expense" });
    }
  });
  app2.get("/api/dashboard/stats", async (req, res) => {
    try {
      const { year, months } = req.query;
      const allStudents = await storage.getAllStudents();
      const allTeachers = await storage.getAllTeachers();
      const allClasses = await storage.getAllClasses();
      const accounts = await storage.getAllStudentAccounts();
      let transactions = await storage.getAllTransactions();
      let salaries = await storage.getAllTeacherSalaries();
      let advances = await storage.getAllTeacherAdvances();
      if (year && months) {
        const selectedYear = parseInt(year);
        const selectedMonths = months.split(",").map((m) => parseInt(m));
        transactions = transactions.filter((t) => {
          if (!t.paymentDate) return false;
          const paymentDate = new Date(t.paymentDate);
          const paymentYear = paymentDate.getFullYear();
          const paymentMonth = paymentDate.getMonth() + 1;
          return paymentYear === selectedYear && selectedMonths.includes(paymentMonth);
        });
        salaries = salaries.filter((s) => {
          const [yearStr, monthStr] = s.month.split("-");
          const year2 = parseInt(yearStr);
          const month = parseInt(monthStr);
          return year2 === selectedYear && selectedMonths.includes(month);
        });
        advances = advances.filter((a) => {
          if (!a.advanceDate) return false;
          const advanceDate = new Date(a.advanceDate);
          const advanceYear = advanceDate.getFullYear();
          const advanceMonth = advanceDate.getMonth() + 1;
          return advanceYear === selectedYear && selectedMonths.includes(advanceMonth);
        });
        const studentIdsWithTransactions = new Set(transactions.map((t) => t.studentId));
        const studentsWithActivity = allStudents.filter((s) => studentIdsWithTransactions.has(s.id));
        const teacherIdsWithActivity = /* @__PURE__ */ new Set([
          ...salaries.map((s) => s.teacherId),
          ...advances.map((a) => a.teacherId)
        ]);
        const teachersWithActivity = allTeachers.filter((t) => teacherIdsWithActivity.has(t.id));
        const classIdsWithActivity = new Set(
          studentsWithActivity.map((s) => s.classId).filter(Boolean)
        );
        const totalStudents = studentsWithActivity.length;
        const activeStudents = studentsWithActivity.filter((s) => s.status === "active").length;
        const activeTeachers = teachersWithActivity.filter((t) => t.status === "active").length;
        const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
        const pendingPayments = accounts.filter((acc) => Number(acc.currentBalance) > 0).length;
        res.json({
          totalStudents,
          activeStudents,
          activeTeachers,
          totalRevenue,
          pendingPayments,
          totalClasses: classIdsWithActivity.size
        });
      } else {
        const totalStudents = allStudents.length;
        const activeStudents = allStudents.filter((s) => s.status === "active").length;
        const activeTeachers = allTeachers.filter((t) => t.status === "active").length;
        const allExpenses = await storage.getAllSchoolExpenses();
        const revenue = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
        const expenses = allExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
        const salariesTotal = salaries.reduce((sum, s) => sum + Number(s.netSalary), 0);
        const totalRevenue = revenue - expenses - salariesTotal;
        const pendingPayments = accounts.filter((acc) => Number(acc.currentBalance) > 0).length;
        res.json({
          totalStudents,
          activeStudents,
          activeTeachers,
          totalRevenue,
          pendingPayments,
          totalClasses: allClasses.length
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });
  app2.get("/api/database/backup", async (req, res) => {
    try {
      const students2 = await storage.getAllStudents();
      const teachers2 = await storage.getAllTeachers();
      const subjects2 = await storage.getAllSubjects();
      const educationLevels2 = await storage.getAllEducationLevels();
      const classes2 = await storage.getAllClasses();
      const classSubjects2 = await storage.getAllClassSubjects();
      const grades2 = await storage.getAllGrades();
      const attendance2 = await storage.getAllAttendance();
      const payments2 = await storage.getAllPayments();
      const accounts = await storage.getAllStudentAccounts();
      const transactions = await storage.getAllTransactions();
      const notifications2 = await storage.getAllNotifications();
      const settings = await storage.getSchoolSettings();
      const salaries = await storage.getAllTeacherSalaries();
      const advances = await storage.getAllTeacherAdvances();
      const expenses = await storage.getAllSchoolExpenses();
      const timestamp2 = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
      const filename = `school_backup_${timestamp2}.sql`;
      res.setHeader("Content-Type", "application/sql");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      let sql3 = `-- School Management System Database Backup
`;
      sql3 += `-- Generated: ${(/* @__PURE__ */ new Date()).toISOString()}
`;
      sql3 += `-- Database: MySQL/MariaDB Compatible

`;
      sql3 += `SET NAMES utf8mb4;
`;
      sql3 += `SET CHARACTER SET utf8mb4;

`;
      const escapeSql = (val) => {
        if (val === null || val === void 0) return "NULL";
        if (typeof val === "boolean") return val ? "1" : "0";
        if (typeof val === "number") return val.toString();
        if (typeof val === "string") return `'${val.replace(/'/g, "''").replace(/\\/g, "\\\\")}'`;
        if (val instanceof Date) return `'${val.toISOString().replace("T", " ").replace("Z", "").substring(0, 19)}'`;
        return `'${String(val).replace(/'/g, "''").replace(/\\/g, "\\\\")}'`;
      };
      if (educationLevels2.length > 0) {
        sql3 += `-- Education Levels
`;
        sql3 += `INSERT INTO \`education_levels\` (\`id\`, \`name\`, \`order\`, \`description\`, \`created_at\`) VALUES
`;
        sql3 += educationLevels2.map(
          (level) => `(${escapeSql(level.id)}, ${escapeSql(level.name)}, ${escapeSql(level.order)}, ${escapeSql(level.description)}, ${escapeSql(level.createdAt)})`
        ).join(",\n") + ";\n\n";
      }
      if (classes2.length > 0) {
        sql3 += `-- Classes
`;
        sql3 += `INSERT INTO \`classes\` (\`id\`, \`education_level_id\`, \`name\`, \`grade\`, \`section\`, \`academic_year\`, \`capacity\`, \`room_number\`, \`teacher_id\`, \`created_at\`) VALUES
`;
        sql3 += classes2.map(
          (cls) => `(${escapeSql(cls.id)}, ${escapeSql(cls.educationLevelId)}, ${escapeSql(cls.name)}, ${escapeSql(cls.grade)}, ${escapeSql(cls.section)}, ${escapeSql(cls.academicYear)}, ${escapeSql(cls.capacity)}, ${escapeSql(cls.roomNumber)}, ${escapeSql(cls.teacherId)}, ${escapeSql(cls.createdAt)})`
        ).join(",\n") + ";\n\n";
      }
      if (students2.length > 0) {
        sql3 += `-- Students
`;
        sql3 += `INSERT INTO \`students\` (\`id\`, \`arabic_name\`, \`date_of_birth\`, \`gender\`, \`national_id\`, \`enrollment_date\`, \`class_id\`, \`parent_name\`, \`parent_phone\`, \`parent_email\`, \`address\`, \`medical_notes\`, \`status\`, \`photo_url\`, \`created_at\`, \`updated_at\`) VALUES
`;
        sql3 += students2.map(
          (student) => `(${escapeSql(student.id)}, ${escapeSql(student.arabicName)}, ${escapeSql(student.dateOfBirth)}, ${escapeSql(student.gender)}, ${escapeSql(student.nationalId)}, ${escapeSql(student.enrollmentDate)}, ${escapeSql(student.classId)}, ${escapeSql(student.parentName)}, ${escapeSql(student.parentPhone)}, ${escapeSql(student.parentEmail)}, ${escapeSql(student.address)}, ${escapeSql(student.medicalNotes)}, ${escapeSql(student.status)}, ${escapeSql(student.photoUrl)}, ${escapeSql(student.createdAt)}, ${escapeSql(student.updatedAt)})`
        ).join(",\n") + ";\n\n";
      }
      if (teachers2.length > 0) {
        sql3 += `-- Teachers
`;
        sql3 += `INSERT INTO \`teachers\` (\`id\`, \`arabic_name\`, \`email\`, \`phone\`, \`gender\`, \`date_of_birth\`, \`hire_date\`, \`qualification\`, \`specialization\`, \`monthly_salary\`, \`status\`, \`photo_url\`, \`created_at\`, \`updated_at\`) VALUES
`;
        sql3 += teachers2.map(
          (teacher) => `(${escapeSql(teacher.id)}, ${escapeSql(teacher.arabicName)}, ${escapeSql(teacher.email)}, ${escapeSql(teacher.phone)}, ${escapeSql(teacher.gender)}, ${escapeSql(teacher.dateOfBirth)}, ${escapeSql(teacher.hireDate)}, ${escapeSql(teacher.qualification)}, ${escapeSql(teacher.specialization)}, ${escapeSql(teacher.monthlySalary)}, ${escapeSql(teacher.status)}, ${escapeSql(teacher.photoUrl)}, ${escapeSql(teacher.createdAt)}, ${escapeSql(teacher.updatedAt)})`
        ).join(",\n") + ";\n\n";
      }
      if (subjects2.length > 0) {
        sql3 += `-- Subjects
`;
        sql3 += `INSERT INTO \`subjects\` (\`id\`, \`name\`, \`arabic_name\`, \`code\`, \`description\`, \`created_at\`) VALUES
`;
        sql3 += subjects2.map(
          (subject) => `(${escapeSql(subject.id)}, ${escapeSql(subject.name)}, ${escapeSql(subject.arabicName)}, ${escapeSql(subject.code)}, ${escapeSql(subject.description)}, ${escapeSql(subject.createdAt)})`
        ).join(",\n") + ";\n\n";
      }
      if (classSubjects2.length > 0) {
        sql3 += `-- Class Subjects
`;
        sql3 += `INSERT INTO \`class_subjects\` (\`id\`, \`class_id\`, \`subject_id\`, \`teacher_id\`, \`weekly_hours\`, \`created_at\`) VALUES
`;
        sql3 += classSubjects2.map(
          (cs) => `(${escapeSql(cs.id)}, ${escapeSql(cs.classId)}, ${escapeSql(cs.subjectId)}, ${escapeSql(cs.teacherId)}, ${escapeSql(cs.weeklyHours)}, ${escapeSql(cs.createdAt)})`
        ).join(",\n") + ";\n\n";
      }
      if (grades2.length > 0) {
        sql3 += `-- Grades
`;
        sql3 += `INSERT INTO \`grades\` (\`id\`, \`student_id\`, \`subject_id\`, \`class_id\`, \`semester\`, \`assessment_type\`, \`assessment_name\`, \`score\`, \`max_score\`, \`percentage\`, \`date\`, \`teacher_id\`, \`notes\`, \`created_at\`) VALUES
`;
        sql3 += grades2.map(
          (grade) => `(${escapeSql(grade.id)}, ${escapeSql(grade.studentId)}, ${escapeSql(grade.subjectId)}, ${escapeSql(grade.classId)}, ${escapeSql(grade.semester)}, ${escapeSql(grade.assessmentType)}, ${escapeSql(grade.assessmentName)}, ${escapeSql(grade.score)}, ${escapeSql(grade.maxScore)}, ${escapeSql(grade.percentage)}, ${escapeSql(grade.date)}, ${escapeSql(grade.teacherId)}, ${escapeSql(grade.notes)}, ${escapeSql(grade.createdAt)})`
        ).join(",\n") + ";\n\n";
      }
      if (attendance2.length > 0) {
        sql3 += `-- Attendance
`;
        sql3 += `INSERT INTO \`attendance\` (\`id\`, \`student_id\`, \`class_id\`, \`date\`, \`status\`, \`notes\`, \`recorded_by\`, \`created_at\`) VALUES
`;
        sql3 += attendance2.map(
          (att) => `(${escapeSql(att.id)}, ${escapeSql(att.studentId)}, ${escapeSql(att.classId)}, ${escapeSql(att.date)}, ${escapeSql(att.status)}, ${escapeSql(att.notes)}, ${escapeSql(att.recordedBy)}, ${escapeSql(att.createdAt)})`
        ).join(",\n") + ";\n\n";
      }
      if (accounts.length > 0) {
        sql3 += `-- Student Accounts
`;
        sql3 += `INSERT INTO \`student_accounts\` (\`id\`, \`student_id\`, \`total_amount_due\`, \`total_paid\`, \`current_balance\`, \`academic_year\`, \`notes\`, \`created_at\`, \`updated_at\`) VALUES
`;
        sql3 += accounts.map(
          (acc) => `(${escapeSql(acc.id)}, ${escapeSql(acc.studentId)}, ${escapeSql(acc.totalAmountDue)}, ${escapeSql(acc.totalPaid)}, ${escapeSql(acc.currentBalance)}, ${escapeSql(acc.academicYear)}, ${escapeSql(acc.notes)}, ${escapeSql(acc.createdAt)}, ${escapeSql(acc.updatedAt)})`
        ).join(",\n") + ";\n\n";
      }
      if (transactions.length > 0) {
        sql3 += `-- Payment Transactions
`;
        sql3 += `INSERT INTO \`payment_transactions\` (\`id\`, \`student_account_id\`, \`student_id\`, \`amount\`, \`payment_date\`, \`payment_method\`, \`receipt_number\`, \`notes\`, \`recorded_by\`, \`created_at\`) VALUES
`;
        sql3 += transactions.map(
          (trans) => `(${escapeSql(trans.id)}, ${escapeSql(trans.studentAccountId)}, ${escapeSql(trans.studentId)}, ${escapeSql(trans.amount)}, ${escapeSql(trans.paymentDate)}, ${escapeSql(trans.paymentMethod)}, ${escapeSql(trans.receiptNumber)}, ${escapeSql(trans.notes)}, ${escapeSql(trans.recordedBy)}, ${escapeSql(trans.createdAt)})`
        ).join(",\n") + ";\n\n";
      }
      if (salaries.length > 0) {
        sql3 += `-- Teacher Salaries
`;
        sql3 += `INSERT INTO \`teacher_salaries\` (\`id\`, \`teacher_id\`, \`month\`, \`base_salary\`, \`bonuses\`, \`deductions\`, \`advances_deducted\`, \`net_salary\`, \`payment_date\`, \`status\`, \`notes\`, \`recorded_by\`, \`created_at\`, \`updated_at\`) VALUES
`;
        sql3 += salaries.map(
          (sal) => `(${escapeSql(sal.id)}, ${escapeSql(sal.teacherId)}, ${escapeSql(sal.month)}, ${escapeSql(sal.baseSalary)}, ${escapeSql(sal.bonuses)}, ${escapeSql(sal.deductions)}, ${escapeSql(sal.advancesDeducted)}, ${escapeSql(sal.netSalary)}, ${escapeSql(sal.paymentDate)}, ${escapeSql(sal.status)}, ${escapeSql(sal.notes)}, ${escapeSql(sal.recordedBy)}, ${escapeSql(sal.createdAt)}, ${escapeSql(sal.updatedAt)})`
        ).join(",\n") + ";\n\n";
      }
      if (advances.length > 0) {
        sql3 += `-- Teacher Advances
`;
        sql3 += `INSERT INTO \`teacher_advances\` (\`id\`, \`teacher_id\`, \`amount\`, \`advance_date\`, \`deduction_month\`, \`status\`, \`notes\`, \`recorded_by\`, \`created_at\`) VALUES
`;
        sql3 += advances.map(
          (adv) => `(${escapeSql(adv.id)}, ${escapeSql(adv.teacherId)}, ${escapeSql(adv.amount)}, ${escapeSql(adv.advanceDate)}, ${escapeSql(adv.deductionMonth)}, ${escapeSql(adv.status)}, ${escapeSql(adv.notes)}, ${escapeSql(adv.recordedBy)}, ${escapeSql(adv.createdAt)})`
        ).join(",\n") + ";\n\n";
      }
      if (expenses.length > 0) {
        sql3 += `-- School Expenses
`;
        sql3 += `INSERT INTO \`school_expenses\` (\`id\`, \`category\`, \`description\`, \`amount\`, \`expense_date\`, \`payment_method\`, \`receipt_number\`, \`vendor_name\`, \`notes\`, \`recorded_by\`, \`created_at\`) VALUES
`;
        sql3 += expenses.map(
          (exp) => `(${escapeSql(exp.id)}, ${escapeSql(exp.category)}, ${escapeSql(exp.description)}, ${escapeSql(exp.amount)}, ${escapeSql(exp.expenseDate)}, ${escapeSql(exp.paymentMethod)}, ${escapeSql(exp.receiptNumber)}, ${escapeSql(exp.vendorName)}, ${escapeSql(exp.notes)}, ${escapeSql(exp.recordedBy)}, ${escapeSql(exp.createdAt)})`
        ).join(",\n") + ";\n\n";
      }
      if (settings) {
        sql3 += `-- School Settings
`;
        sql3 += `INSERT INTO \`school_settings\` (\`id\`, \`school_name\`, \`school_name_arabic\`, \`current_academic_year\`, \`currency\`, \`phone\`, \`email\`, \`address\`, \`logo_url\`, \`updated_at\`) VALUES
`;
        sql3 += `(${escapeSql(settings.id)}, ${escapeSql(settings.schoolName)}, ${escapeSql(settings.schoolNameArabic)}, ${escapeSql(settings.currentAcademicYear)}, ${escapeSql(settings.currency)}, ${escapeSql(settings.phone)}, ${escapeSql(settings.email)}, ${escapeSql(settings.address)}, ${escapeSql(settings.logoUrl)}, ${escapeSql(settings.updatedAt)});

`;
      }
      sql3 += `-- End of backup
`;
      res.send(sql3);
    } catch (error) {
      console.error("Database backup error:", error);
      res.status(500).json({ error: "Failed to create database backup" });
    }
  });
  app2.get("/api/export/excel", async (req, res) => {
    try {
      const XLSX = await import("xlsx");
      const students2 = await storage.getAllStudents();
      const teachers2 = await storage.getAllTeachers();
      const classes2 = await storage.getAllClasses();
      const subjects2 = await storage.getAllSubjects();
      const grades2 = await storage.getAllGrades();
      const attendance2 = await storage.getAllAttendance();
      const accounts = await storage.getAllStudentAccounts();
      const transactions = await storage.getAllTransactions();
      const salaries = await storage.getAllTeacherSalaries();
      const advances = await storage.getAllTeacherAdvances();
      const expenses = await storage.getAllSchoolExpenses();
      const settings = await storage.getSchoolSettings();
      const educationLevels2 = await storage.getAllEducationLevels();
      const workbook = XLSX.utils.book_new();
      if (students2.length > 0) {
        const studentsData = students2.map((s) => ({
          "\u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u062A\u0639\u0631\u064A\u0641\u064A": s.id,
          "\u0627\u0644\u0627\u0633\u0645 \u0628\u0627\u0644\u0639\u0631\u0628\u064A": s.arabicName,
          "\u0627\u0644\u062C\u0646\u0633": s.gender === "male" ? "\u0630\u0643\u0631" : "\u0623\u0646\u062B\u0649",
          "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0645\u064A\u0644\u0627\u062F": s.dateOfBirth,
          "\u0648\u0644\u064A \u0627\u0644\u0623\u0645\u0631": s.parentName,
          "\u0631\u0642\u0645 \u0648\u0644\u064A \u0627\u0644\u0623\u0645\u0631": s.parentPhone,
          "\u0627\u0644\u0639\u0646\u0648\u0627\u0646": s.address || "",
          "\u0627\u0644\u062D\u0627\u0644\u0629": s.status === "active" ? "\u0646\u0634\u0637" : "\u063A\u064A\u0631 \u0646\u0634\u0637",
          "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u062A\u0633\u062C\u064A\u0644": s.enrollmentDate
        }));
        const studentsSheet = XLSX.utils.json_to_sheet(studentsData);
        XLSX.utils.book_append_sheet(workbook, studentsSheet, "\u0627\u0644\u0637\u0644\u0627\u0628");
      }
      if (teachers2.length > 0) {
        const teachersData = teachers2.map((t) => ({
          "\u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u062A\u0639\u0631\u064A\u0641\u064A": t.id,
          "\u0627\u0644\u0627\u0633\u0645 \u0628\u0627\u0644\u0639\u0631\u0628\u064A": t.arabicName,
          "\u0627\u0644\u062C\u0646\u0633": t.gender === "male" ? "\u0630\u0643\u0631" : "\u0623\u0646\u062B\u0649",
          "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641": t.phone,
          "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A": t.email || "",
          "\u0627\u0644\u0645\u0624\u0647\u0644": t.qualification || "",
          "\u0627\u0644\u062A\u062E\u0635\u0635": t.specialization || "",
          "\u0627\u0644\u0631\u0627\u062A\u0628 \u0627\u0644\u0634\u0647\u0631\u064A": t.monthlySalary,
          "\u0627\u0644\u062D\u0627\u0644\u0629": t.status === "active" ? "\u0646\u0634\u0637" : "\u063A\u064A\u0631 \u0646\u0634\u0637",
          "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u062A\u0639\u064A\u064A\u0646": t.hireDate
        }));
        const teachersSheet = XLSX.utils.json_to_sheet(teachersData);
        XLSX.utils.book_append_sheet(workbook, teachersSheet, "\u0627\u0644\u0645\u0639\u0644\u0645\u064A\u0646");
      }
      if (classes2.length > 0) {
        const classesData = classes2.map((c) => ({
          "\u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u062A\u0639\u0631\u064A\u0641\u064A": c.id,
          "\u0627\u0633\u0645 \u0627\u0644\u0635\u0641": c.name,
          "\u0627\u0644\u0635\u0641": c.grade,
          "\u0627\u0644\u0634\u0639\u0628\u0629": c.section,
          "\u0627\u0644\u0633\u0639\u0629": c.capacity,
          "\u063A\u0631\u0641\u0629 \u0627\u0644\u062F\u0631\u0627\u0633\u0629": c.roomNumber || ""
        }));
        const classesSheet = XLSX.utils.json_to_sheet(classesData);
        XLSX.utils.book_append_sheet(workbook, classesSheet, "\u0627\u0644\u0635\u0641\u0648\u0641");
      }
      if (accounts.length > 0) {
        const accountsData = accounts.map((a) => ({
          "\u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u062A\u0639\u0631\u064A\u0641\u064A": a.id,
          "\u0631\u0642\u0645 \u0627\u0644\u0637\u0627\u0644\u0628": a.studentId,
          "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0645\u0633\u062A\u062D\u0642\u0627\u062A": a.totalAmountDue,
          "\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u062F\u0641\u0648\u0639": a.totalPaid,
          "\u0627\u0644\u0631\u0635\u064A\u062F \u0627\u0644\u062D\u0627\u0644\u064A": a.currentBalance,
          "\u0627\u0644\u0639\u0627\u0645 \u0627\u0644\u062F\u0631\u0627\u0633\u064A": a.academicYear
        }));
        const accountsSheet = XLSX.utils.json_to_sheet(accountsData);
        XLSX.utils.book_append_sheet(workbook, accountsSheet, "\u062D\u0633\u0627\u0628\u0627\u062A \u0627\u0644\u0637\u0644\u0627\u0628");
      }
      if (transactions.length > 0) {
        const transactionsData = transactions.map((t) => ({
          "\u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u062A\u0639\u0631\u064A\u0641\u064A": t.id,
          "\u0631\u0642\u0645 \u0627\u0644\u0637\u0627\u0644\u0628": t.studentId,
          "\u0627\u0644\u0645\u0628\u0644\u063A": t.amount,
          "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u062F\u0641\u0639": t.paymentDate,
          "\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062F\u0641\u0639": t.paymentMethod,
          "\u0631\u0642\u0645 \u0627\u0644\u0625\u064A\u0635\u0627\u0644": t.receiptNumber || "",
          "\u0645\u0644\u0627\u062D\u0638\u0627\u062A": t.notes || ""
        }));
        const transactionsSheet = XLSX.utils.json_to_sheet(transactionsData);
        XLSX.utils.book_append_sheet(workbook, transactionsSheet, "\u0627\u0644\u0645\u0639\u0627\u0645\u0644\u0627\u062A \u0627\u0644\u0645\u0627\u0644\u064A\u0629");
      }
      if (salaries.length > 0) {
        const salariesData = salaries.map((s) => ({
          "\u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u062A\u0639\u0631\u064A\u0641\u064A": s.id,
          "\u0631\u0642\u0645 \u0627\u0644\u0645\u0639\u0644\u0645": s.teacherId,
          "\u0627\u0644\u0634\u0647\u0631": s.month,
          "\u0627\u0644\u0631\u0627\u062A\u0628 \u0627\u0644\u0623\u0633\u0627\u0633\u064A": s.baseSalary,
          "\u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062A": s.bonuses || 0,
          "\u0627\u0644\u062E\u0635\u0648\u0645\u0627\u062A": s.deductions || 0,
          "\u0627\u0644\u0633\u0644\u0641 \u0627\u0644\u0645\u062E\u0635\u0648\u0645\u0629": s.advancesDeducted || 0,
          "\u0635\u0627\u0641\u064A \u0627\u0644\u0631\u0627\u062A\u0628": s.netSalary,
          "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u062F\u0641\u0639": s.paymentDate || "",
          "\u0627\u0644\u062D\u0627\u0644\u0629": s.status
        }));
        const salariesSheet = XLSX.utils.json_to_sheet(salariesData);
        XLSX.utils.book_append_sheet(workbook, salariesSheet, "\u0631\u0648\u0627\u062A\u0628 \u0627\u0644\u0645\u0639\u0644\u0645\u064A\u0646");
      }
      if (expenses.length > 0) {
        const expensesData = expenses.map((e) => ({
          "\u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u062A\u0639\u0631\u064A\u0641\u064A": e.id,
          "\u0627\u0644\u0641\u0626\u0629": e.category,
          "\u0627\u0644\u0648\u0635\u0641": e.description,
          "\u0627\u0644\u0645\u0628\u0644\u063A": e.amount,
          "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0645\u0635\u0631\u0648\u0641": e.expenseDate,
          "\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062F\u0641\u0639": e.paymentMethod,
          "\u0631\u0642\u0645 \u0627\u0644\u0625\u064A\u0635\u0627\u0644": e.receiptNumber || "",
          "\u0627\u0633\u0645 \u0627\u0644\u0645\u0648\u0631\u062F": e.vendorName || ""
        }));
        const expensesSheet = XLSX.utils.json_to_sheet(expensesData);
        XLSX.utils.book_append_sheet(workbook, expensesSheet, "\u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A");
      }
      if (attendance2.length > 0) {
        const attendanceData = attendance2.map((a) => ({
          "\u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u062A\u0639\u0631\u064A\u0641\u064A": a.id,
          "\u0631\u0642\u0645 \u0627\u0644\u0637\u0627\u0644\u0628": a.studentId,
          "\u0631\u0642\u0645 \u0627\u0644\u0635\u0641": a.classId,
          "\u0627\u0644\u062A\u0627\u0631\u064A\u062E": a.date,
          "\u0627\u0644\u062D\u0627\u0644\u0629": a.status === "present" ? "\u062D\u0627\u0636\u0631" : a.status === "absent" ? "\u063A\u0627\u0626\u0628" : a.status === "late" ? "\u0645\u062A\u0623\u062E\u0631" : "\u0645\u0639\u0630\u0648\u0631",
          "\u0645\u0644\u0627\u062D\u0638\u0627\u062A": a.notes || ""
        }));
        const attendanceSheet = XLSX.utils.json_to_sheet(attendanceData);
        XLSX.utils.book_append_sheet(workbook, attendanceSheet, "\u0627\u0644\u062D\u0636\u0648\u0631");
      }
      if (grades2.length > 0) {
        const gradesData = grades2.map((g) => ({
          "\u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u062A\u0639\u0631\u064A\u0641\u064A": g.id,
          "\u0631\u0642\u0645 \u0627\u0644\u0637\u0627\u0644\u0628": g.studentId,
          "\u0631\u0642\u0645 \u0627\u0644\u0645\u0627\u062F\u0629": g.subjectId,
          "\u0627\u0644\u062F\u0631\u062C\u0629": g.score,
          "\u0627\u0644\u062F\u0631\u062C\u0629 \u0627\u0644\u0643\u0644\u064A\u0629": g.maxScore,
          "\u0627\u0644\u0646\u0648\u0639": g.assessmentType,
          "\u0627\u0644\u062A\u0627\u0631\u064A\u062E": g.date
        }));
        const gradesSheet = XLSX.utils.json_to_sheet(gradesData);
        XLSX.utils.book_append_sheet(workbook, gradesSheet, "\u0627\u0644\u062F\u0631\u062C\u0627\u062A");
      }
      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const filename = `school_data_export_${today}.xlsx`;
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.send(buffer);
    } catch (error) {
      console.error("Excel export error:", error);
      res.status(500).json({ error: "Failed to export data to Excel" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json({ limit: "50mb" }));
app.use(express2.urlencoded({ extended: false, limit: "50mb" }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
