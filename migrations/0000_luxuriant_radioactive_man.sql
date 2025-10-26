CREATE TABLE `attendance` (
	`id` varchar(255) NOT NULL,
	`student_id` varchar(255) NOT NULL,
	`class_id` varchar(255) NOT NULL,
	`date` date NOT NULL,
	`status` enum('present','absent','late','excused') NOT NULL,
	`notes` text,
	`recorded_by` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `attendance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `class_subjects` (
	`id` varchar(255) NOT NULL,
	`education_level_id` varchar(255) NOT NULL,
	`grade` text NOT NULL,
	`subject_id` varchar(255) NOT NULL,
	`teacher_id` varchar(255),
	`weekly_hours` int NOT NULL DEFAULT 2,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `class_subjects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `classes` (
	`id` varchar(255) NOT NULL,
	`education_level_id` varchar(255),
	`name` text NOT NULL,
	`grade` text NOT NULL,
	`section` text NOT NULL,
	`academic_year` text NOT NULL,
	`capacity` int NOT NULL DEFAULT 30,
	`room_number` text,
	`teacher_id` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `classes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `education_levels` (
	`id` varchar(255) NOT NULL,
	`name` text NOT NULL,
	`order` int NOT NULL,
	`description` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `education_levels_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `grades` (
	`id` varchar(255) NOT NULL,
	`student_id` varchar(255) NOT NULL,
	`subject_id` varchar(255) NOT NULL,
	`class_id` varchar(255) NOT NULL,
	`semester` text NOT NULL,
	`assessment_type` enum('مذاكرة','امتحان نهائي','واجب','مشاركة','اختبار قصير','مشروع','نشاط') NOT NULL,
	`score` decimal(5,2) NOT NULL,
	`max_score` decimal(5,2) NOT NULL DEFAULT '100',
	`date` date NOT NULL,
	`teacher_id` varchar(255),
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `grades_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` varchar(255) NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`type` text NOT NULL,
	`target_audience` text NOT NULL,
	`target_class_id` varchar(255),
	`priority` text NOT NULL DEFAULT ('normal'),
	`is_read` boolean NOT NULL DEFAULT false,
	`created_by` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `parent_students` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`student_id` varchar(255) NOT NULL,
	`relationship` text NOT NULL DEFAULT ('parent'),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `parent_students_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payment_transactions` (
	`id` varchar(255) NOT NULL,
	`student_account_id` varchar(255) NOT NULL,
	`student_id` varchar(255) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`payment_date` date NOT NULL,
	`payment_method` text,
	`receipt_number` text,
	`notes` text,
	`recorded_by` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `payment_transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` varchar(255) NOT NULL,
	`student_id` varchar(255) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`due_date` date NOT NULL,
	`payment_date` date,
	`status` enum('paid','pending','overdue','partial') NOT NULL DEFAULT 'pending',
	`payment_type` text NOT NULL,
	`academic_year` text NOT NULL,
	`month` text,
	`notes` text,
	`receipt_number` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `school_expenses` (
	`id` varchar(255) NOT NULL,
	`category` text NOT NULL,
	`description` text NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`expense_date` date NOT NULL,
	`payment_method` text,
	`receipt_number` text,
	`vendor_name` text,
	`notes` text,
	`recorded_by` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `school_expenses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `school_settings` (
	`id` varchar(255) NOT NULL,
	`school_name` text NOT NULL,
	`school_name_arabic` text NOT NULL,
	`current_academic_year` text NOT NULL,
	`currency` text NOT NULL DEFAULT ('SAR'),
	`date_type` enum('gregorian','hijri') NOT NULL DEFAULT 'gregorian',
	`phone` text,
	`email` text,
	`address` text,
	`logo_url` text,
	`primary_color` text DEFAULT ('#3b82f6'),
	`accent_color` text DEFAULT ('#10b981'),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `school_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `section_subject_teachers` (
	`id` varchar(255) NOT NULL,
	`class_id` varchar(255) NOT NULL,
	`subject_id` varchar(255) NOT NULL,
	`teacher_id` varchar(255) NOT NULL,
	`is_lead` boolean NOT NULL DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `section_subject_teachers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `student_accounts` (
	`id` varchar(255) NOT NULL,
	`student_id` varchar(255) NOT NULL,
	`total_amount_due` decimal(10,2) NOT NULL DEFAULT '0',
	`total_paid` decimal(10,2) NOT NULL DEFAULT '0',
	`current_balance` decimal(10,2) NOT NULL DEFAULT '0',
	`academic_year` text NOT NULL,
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `student_accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `student_accounts_student_id_unique` UNIQUE(`student_id`)
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` varchar(255) NOT NULL,
	`arabic_name` text NOT NULL,
	`date_of_birth` date NOT NULL,
	`gender` enum('male','female') NOT NULL,
	`national_id` text,
	`enrollment_date` date NOT NULL,
	`class_id` varchar(255),
	`parent_name` text NOT NULL,
	`parent_phone` text NOT NULL,
	`parent_email` text,
	`address` text,
	`medical_notes` text,
	`status` enum('active','suspended','graduated','transferred') NOT NULL DEFAULT 'active',
	`photo_url` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `students_id` PRIMARY KEY(`id`),
	CONSTRAINT `students_national_id_unique` UNIQUE(`national_id`)
);
--> statement-breakpoint
CREATE TABLE `subjects` (
	`id` varchar(255) NOT NULL,
	`name` text NOT NULL,
	`arabic_name` text NOT NULL,
	`code` text NOT NULL,
	`description` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `subjects_id` PRIMARY KEY(`id`),
	CONSTRAINT `subjects_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `teacher_advances` (
	`id` varchar(255) NOT NULL,
	`teacher_id` varchar(255) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`advance_date` date NOT NULL,
	`deduction_month` text,
	`status` text NOT NULL DEFAULT ('pending'),
	`notes` text,
	`recorded_by` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `teacher_advances_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teacher_attendance` (
	`id` varchar(255) NOT NULL,
	`teacher_id` varchar(255) NOT NULL,
	`date` date NOT NULL,
	`status` enum('present','absent','paid_leave','unpaid_leave','sick_leave') NOT NULL,
	`deduct_from_salary` boolean NOT NULL DEFAULT false,
	`notes` text,
	`recorded_by` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `teacher_attendance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teacher_salaries` (
	`id` varchar(255) NOT NULL,
	`teacher_id` varchar(255) NOT NULL,
	`month` text NOT NULL,
	`base_salary` decimal(10,2) NOT NULL,
	`bonuses` decimal(10,2) NOT NULL DEFAULT '0',
	`deductions` decimal(10,2) NOT NULL DEFAULT '0',
	`advances_deducted` decimal(10,2) NOT NULL DEFAULT '0',
	`net_salary` decimal(10,2) NOT NULL,
	`payment_date` date,
	`status` text NOT NULL DEFAULT ('pending'),
	`notes` text,
	`recorded_by` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `teacher_salaries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teacher_users` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`teacher_id` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `teacher_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `teacher_users_user_id_unique` UNIQUE(`user_id`),
	CONSTRAINT `teacher_users_teacher_id_unique` UNIQUE(`teacher_id`)
);
--> statement-breakpoint
CREATE TABLE `teachers` (
	`id` varchar(255) NOT NULL,
	`arabic_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`gender` enum('male','female') NOT NULL,
	`date_of_birth` date,
	`hire_date` date NOT NULL,
	`qualification` text,
	`specialization` text,
	`monthly_salary` decimal(10,2) NOT NULL DEFAULT '0',
	`status` enum('active','on_leave','resigned') NOT NULL DEFAULT 'active',
	`photo_url` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `teachers_id` PRIMARY KEY(`id`),
	CONSTRAINT `teachers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(255) NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`role` enum('admin','teacher','parent') NOT NULL DEFAULT 'admin',
	`full_name` text,
	`email` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_student_id_students_id_fk` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_class_id_classes_id_fk` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_recorded_by_teachers_id_fk` FOREIGN KEY (`recorded_by`) REFERENCES `teachers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `class_subjects` ADD CONSTRAINT `class_subjects_education_level_id_education_levels_id_fk` FOREIGN KEY (`education_level_id`) REFERENCES `education_levels`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `class_subjects` ADD CONSTRAINT `class_subjects_subject_id_subjects_id_fk` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `class_subjects` ADD CONSTRAINT `class_subjects_teacher_id_teachers_id_fk` FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `classes` ADD CONSTRAINT `classes_education_level_id_education_levels_id_fk` FOREIGN KEY (`education_level_id`) REFERENCES `education_levels`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `classes` ADD CONSTRAINT `classes_teacher_id_teachers_id_fk` FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `grades` ADD CONSTRAINT `grades_student_id_students_id_fk` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `grades` ADD CONSTRAINT `grades_subject_id_subjects_id_fk` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `grades` ADD CONSTRAINT `grades_class_id_classes_id_fk` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `grades` ADD CONSTRAINT `grades_teacher_id_teachers_id_fk` FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_target_class_id_classes_id_fk` FOREIGN KEY (`target_class_id`) REFERENCES `classes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `parent_students` ADD CONSTRAINT `parent_students_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `parent_students` ADD CONSTRAINT `parent_students_student_id_students_id_fk` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment_transactions` ADD CONSTRAINT `payment_transactions_student_account_id_student_accounts_id_fk` FOREIGN KEY (`student_account_id`) REFERENCES `student_accounts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment_transactions` ADD CONSTRAINT `payment_transactions_student_id_students_id_fk` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment_transactions` ADD CONSTRAINT `payment_transactions_recorded_by_users_id_fk` FOREIGN KEY (`recorded_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_student_id_students_id_fk` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `school_expenses` ADD CONSTRAINT `school_expenses_recorded_by_users_id_fk` FOREIGN KEY (`recorded_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `section_subject_teachers` ADD CONSTRAINT `section_subject_teachers_class_id_classes_id_fk` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `section_subject_teachers` ADD CONSTRAINT `section_subject_teachers_subject_id_subjects_id_fk` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `section_subject_teachers` ADD CONSTRAINT `section_subject_teachers_teacher_id_teachers_id_fk` FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_accounts` ADD CONSTRAINT `student_accounts_student_id_students_id_fk` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `students` ADD CONSTRAINT `students_class_id_classes_id_fk` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `teacher_advances` ADD CONSTRAINT `teacher_advances_teacher_id_teachers_id_fk` FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `teacher_advances` ADD CONSTRAINT `teacher_advances_recorded_by_users_id_fk` FOREIGN KEY (`recorded_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `teacher_attendance` ADD CONSTRAINT `teacher_attendance_teacher_id_teachers_id_fk` FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `teacher_attendance` ADD CONSTRAINT `teacher_attendance_recorded_by_users_id_fk` FOREIGN KEY (`recorded_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `teacher_salaries` ADD CONSTRAINT `teacher_salaries_teacher_id_teachers_id_fk` FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `teacher_salaries` ADD CONSTRAINT `teacher_salaries_recorded_by_users_id_fk` FOREIGN KEY (`recorded_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `teacher_users` ADD CONSTRAINT `teacher_users_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `teacher_users` ADD CONSTRAINT `teacher_users_teacher_id_teachers_id_fk` FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE no action ON UPDATE no action;