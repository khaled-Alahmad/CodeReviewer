--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (165f042)
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: assessment_type; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.assessment_type AS ENUM (
    'مذاكرة',
    'امتحان نهائي',
    'واجب',
    'مشاركة',
    'اختبار قصير',
    'مشروع',
    'نشاط'
);


ALTER TYPE public.assessment_type OWNER TO neondb_owner;

--
-- Name: attendance_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.attendance_status AS ENUM (
    'present',
    'absent',
    'late',
    'excused'
);


ALTER TYPE public.attendance_status OWNER TO neondb_owner;

--
-- Name: date_type; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.date_type AS ENUM (
    'gregorian',
    'hijri'
);


ALTER TYPE public.date_type OWNER TO neondb_owner;

--
-- Name: gender; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.gender AS ENUM (
    'male',
    'female'
);


ALTER TYPE public.gender OWNER TO neondb_owner;

--
-- Name: payment_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.payment_status AS ENUM (
    'paid',
    'pending',
    'overdue',
    'partial'
);


ALTER TYPE public.payment_status OWNER TO neondb_owner;

--
-- Name: student_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.student_status AS ENUM (
    'active',
    'suspended',
    'graduated',
    'transferred'
);


ALTER TYPE public.student_status OWNER TO neondb_owner;

--
-- Name: teacher_attendance_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.teacher_attendance_status AS ENUM (
    'present',
    'absent',
    'paid_leave',
    'unpaid_leave',
    'sick_leave'
);


ALTER TYPE public.teacher_attendance_status OWNER TO neondb_owner;

--
-- Name: teacher_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.teacher_status AS ENUM (
    'active',
    'on_leave',
    'resigned'
);


ALTER TYPE public.teacher_status OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: attendance; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.attendance (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    student_id character varying NOT NULL,
    class_id character varying NOT NULL,
    date date NOT NULL,
    status public.attendance_status NOT NULL,
    notes text,
    recorded_by character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.attendance OWNER TO neondb_owner;

--
-- Name: class_subjects; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.class_subjects (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    education_level_id character varying NOT NULL,
    grade text NOT NULL,
    subject_id character varying NOT NULL,
    teacher_id character varying,
    weekly_hours integer DEFAULT 2 NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.class_subjects OWNER TO neondb_owner;

--
-- Name: classes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.classes (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    grade text NOT NULL,
    section text NOT NULL,
    academic_year text NOT NULL,
    capacity integer DEFAULT 30 NOT NULL,
    room_number text,
    teacher_id character varying,
    created_at timestamp without time zone DEFAULT now(),
    education_level_id character varying
);


ALTER TABLE public.classes OWNER TO neondb_owner;

--
-- Name: education_levels; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.education_levels (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    "order" integer NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.education_levels OWNER TO neondb_owner;

--
-- Name: grades; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.grades (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    student_id character varying NOT NULL,
    subject_id character varying NOT NULL,
    class_id character varying NOT NULL,
    assessment_type public.assessment_type NOT NULL,
    score numeric(5,2) NOT NULL,
    max_score numeric(5,2) DEFAULT '100'::numeric NOT NULL,
    date date NOT NULL,
    teacher_id character varying,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    semester text NOT NULL
);


ALTER TABLE public.grades OWNER TO neondb_owner;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.notifications (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type text NOT NULL,
    target_audience text NOT NULL,
    target_class_id character varying,
    priority text DEFAULT 'normal'::text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    created_by character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.notifications OWNER TO neondb_owner;

--
-- Name: payment_transactions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.payment_transactions (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    student_account_id character varying NOT NULL,
    student_id character varying NOT NULL,
    amount numeric(10,2) NOT NULL,
    payment_date date NOT NULL,
    payment_method text,
    receipt_number text,
    notes text,
    recorded_by character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.payment_transactions OWNER TO neondb_owner;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.payments (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    student_id character varying NOT NULL,
    amount numeric(10,2) NOT NULL,
    due_date date NOT NULL,
    payment_date date,
    status public.payment_status DEFAULT 'pending'::public.payment_status NOT NULL,
    payment_type text NOT NULL,
    academic_year text NOT NULL,
    month text,
    notes text,
    receipt_number text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.payments OWNER TO neondb_owner;

--
-- Name: school_expenses; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.school_expenses (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    category text NOT NULL,
    description text NOT NULL,
    amount numeric(10,2) NOT NULL,
    expense_date date NOT NULL,
    payment_method text,
    receipt_number text,
    vendor_name text,
    notes text,
    recorded_by character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.school_expenses OWNER TO neondb_owner;

--
-- Name: school_settings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.school_settings (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    school_name text NOT NULL,
    school_name_arabic text NOT NULL,
    current_academic_year text NOT NULL,
    phone text,
    email text,
    address text,
    logo_url text,
    updated_at timestamp without time zone DEFAULT now(),
    currency text DEFAULT 'SAR'::text NOT NULL,
    primary_color text DEFAULT '#3b82f6'::text,
    accent_color text DEFAULT '#10b981'::text,
    date_type public.date_type DEFAULT 'gregorian'::public.date_type NOT NULL
);


ALTER TABLE public.school_settings OWNER TO neondb_owner;

--
-- Name: student_accounts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.student_accounts (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    student_id character varying NOT NULL,
    total_amount_due numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    total_paid numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    current_balance numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    academic_year text NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.student_accounts OWNER TO neondb_owner;

--
-- Name: students; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.students (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    arabic_name text NOT NULL,
    date_of_birth date NOT NULL,
    gender public.gender NOT NULL,
    national_id text,
    enrollment_date date NOT NULL,
    class_id character varying,
    parent_name text NOT NULL,
    parent_phone text NOT NULL,
    parent_email text,
    address text,
    medical_notes text,
    status public.student_status DEFAULT 'active'::public.student_status NOT NULL,
    photo_url text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.students OWNER TO neondb_owner;

--
-- Name: subjects; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.subjects (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    arabic_name text NOT NULL,
    code text NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.subjects OWNER TO neondb_owner;

--
-- Name: teacher_advances; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teacher_advances (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    teacher_id character varying NOT NULL,
    amount numeric(10,2) NOT NULL,
    advance_date date NOT NULL,
    deduction_month text,
    status text DEFAULT 'pending'::text NOT NULL,
    notes text,
    recorded_by character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.teacher_advances OWNER TO neondb_owner;

--
-- Name: teacher_attendance; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teacher_attendance (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    teacher_id character varying NOT NULL,
    date date NOT NULL,
    status public.teacher_attendance_status NOT NULL,
    deduct_from_salary boolean DEFAULT false NOT NULL,
    notes text,
    recorded_by character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.teacher_attendance OWNER TO neondb_owner;

--
-- Name: teacher_salaries; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teacher_salaries (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    teacher_id character varying NOT NULL,
    month text NOT NULL,
    base_salary numeric(10,2) NOT NULL,
    bonuses numeric(10,2) DEFAULT 0 NOT NULL,
    deductions numeric(10,2) DEFAULT 0 NOT NULL,
    advances_deducted numeric(10,2) DEFAULT 0 NOT NULL,
    net_salary numeric(10,2) NOT NULL,
    payment_date date,
    status text DEFAULT 'pending'::text NOT NULL,
    notes text,
    recorded_by character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.teacher_salaries OWNER TO neondb_owner;

--
-- Name: teachers; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teachers (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    arabic_name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    gender public.gender NOT NULL,
    date_of_birth date,
    hire_date date NOT NULL,
    qualification text,
    specialization text,
    monthly_salary numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    status public.teacher_status DEFAULT 'active'::public.teacher_status NOT NULL,
    photo_url text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.teachers OWNER TO neondb_owner;

--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    role text DEFAULT 'admin'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.attendance (id, student_id, class_id, date, status, notes, recorded_by, created_at) FROM stdin;
\.


--
-- Data for Name: class_subjects; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.class_subjects (id, education_level_id, grade, subject_id, teacher_id, weekly_hours, created_at) FROM stdin;
da8ff8d0-c72f-42ae-a8be-653b7b2cc7d7	bc477884-ffd1-47aa-8719-52ef715175db	الأول	e9c8a64a-deb2-467b-a9e0-c62287e2b944	9db46210-0725-49db-8c24-ad33bb925cb2	2	2025-10-06 21:09:58.710258
ac26a62d-0530-48b1-a237-39a4ee789557	bc477884-ffd1-47aa-8719-52ef715175db	الأول	a724c771-d1dc-415b-9cad-26e0cd1a1fa6	9db46210-0725-49db-8c24-ad33bb925cb2	2	2025-10-06 21:10:07.433041
\.


--
-- Data for Name: classes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.classes (id, name, grade, section, academic_year, capacity, room_number, teacher_id, created_at, education_level_id) FROM stdin;
7a3428ce-67cf-465d-98a6-bc02e3e1f6ac	الصف الأول - شعبة أ	الأول	أ	2025/2026	44	\N	\N	2025-10-06 13:35:20.300735	bc477884-ffd1-47aa-8719-52ef715175db
\.


--
-- Data for Name: education_levels; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.education_levels (id, name, "order", description, created_at) FROM stdin;
bc477884-ffd1-47aa-8719-52ef715175db	الابتدائية	1	\N	2025-10-06 13:29:21.215356
\.


--
-- Data for Name: grades; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.grades (id, student_id, subject_id, class_id, assessment_type, score, max_score, date, teacher_id, notes, created_at, semester) FROM stdin;
a2716245-1ffd-4ab1-bf65-3a021d3e4072	511d11ec-a6a4-49f4-a904-eae24ca4eda2	a724c771-d1dc-415b-9cad-26e0cd1a1fa6	7a3428ce-67cf-465d-98a6-bc02e3e1f6ac	مذاكرة	78.00	100.00	2025-10-06	\N	رصوه	2025-10-06 23:01:04.901816	الفصل الأول
61906ec9-f869-4620-a3a9-cf06d71afbc6	511d11ec-a6a4-49f4-a904-eae24ca4eda2	e9c8a64a-deb2-467b-a9e0-c62287e2b944	7a3428ce-67cf-465d-98a6-bc02e3e1f6ac	مذاكرة	80.00	100.00	2025-10-06	\N		2025-10-06 23:02:02.153683	الفصل الأول
03b5b7f6-50b6-4a58-a6bb-24165ac9317e	511d11ec-a6a4-49f4-a904-eae24ca4eda2	e9c8a64a-deb2-467b-a9e0-c62287e2b944	7a3428ce-67cf-465d-98a6-bc02e3e1f6ac	امتحان نهائي	80.00	100.00	2025-10-06	\N		2025-10-06 23:02:29.627188	الفصل الأول
0ca2095d-6099-4f89-ad80-3e7267bf8fcf	511d11ec-a6a4-49f4-a904-eae24ca4eda2	a724c771-d1dc-415b-9cad-26e0cd1a1fa6	7a3428ce-67cf-465d-98a6-bc02e3e1f6ac	امتحان نهائي	90.00	100.00	2025-10-06	\N		2025-10-06 23:03:02.675186	الفصل الأول
49b21899-e872-4b1d-9ad2-f71a1ea5e9c5	511d11ec-a6a4-49f4-a904-eae24ca4eda2	e9c8a64a-deb2-467b-a9e0-c62287e2b944	7a3428ce-67cf-465d-98a6-bc02e3e1f6ac	مذاكرة	105.00	100.00	2025-10-06	\N		2025-10-06 23:39:57.430891	الفصل الأول
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notifications (id, title, message, type, target_audience, target_class_id, priority, is_read, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: payment_transactions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.payment_transactions (id, student_account_id, student_id, amount, payment_date, payment_method, receipt_number, notes, recorded_by, created_at) FROM stdin;
d3ee5ef1-09a4-4a7c-87b3-ff28fee5adcb	e954e654-ec1c-4a8d-8a3d-3f91d496ab31	511d11ec-a6a4-49f4-a904-eae24ca4eda2	50.00	2025-10-06	cash	\N	\N	\N	2025-10-06 14:31:45.551881
206005c9-64f1-4be2-8fea-f8159c066ea0	e954e654-ec1c-4a8d-8a3d-3f91d496ab31	511d11ec-a6a4-49f4-a904-eae24ca4eda2	150.00	2025-10-06	cash	\N	\N	\N	2025-10-06 15:42:39.25302
466f6640-6d86-4bf0-882b-8019d1c09298	5dc78cf6-07de-48b4-a2fd-e6a8f21e9992	610afd35-216a-4bff-977b-532bca968d61	10.00	2025-10-06	cash	\N	\N	\N	2025-10-06 23:12:14.074291
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.payments (id, student_id, amount, due_date, payment_date, status, payment_type, academic_year, month, notes, receipt_number, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: school_expenses; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.school_expenses (id, category, description, amount, expense_date, payment_method, receipt_number, vendor_name, notes, recorded_by, created_at) FROM stdin;
faabe011-0d0f-456f-b003-1d5fba254326	maintenance	صيانة صفوف	50.00	2025-10-06	cash	\N	\N	\N	\N	2025-10-06 12:44:45.376706
\.


--
-- Data for Name: school_settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.school_settings (id, school_name, school_name_arabic, current_academic_year, phone, email, address, logo_url, updated_at, currency, primary_color, accent_color, date_type) FROM stdin;
2604c114-1da6-4b30-98e0-3d9a4b2e780c	Al awael	مدرسة الأوائل	2024-2025	+966 11 123 4567	info@alnoor.edu.sa	سوريا, إدلب, مساكن المعلمين, بجانب حديثة أمن الدولة	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZEAAAGRCAYAAACkIY5XAAABJ2lDQ1BBcHBsZSBSR0IAACiRlY+9SsNQGIaf04qCQxEJbsLBQVzEn61j0pYiONQokmRrkkMVbXI4Of506k14EQ4ujoLeQcVBcPIS3ARxcHCIEJxKn+n53uHl/aC24ba9Tm0Jhpk1fteTQRjJhRfmqQNAPym02+vtA2R5pviPgK83BMDrptv2OszGYqKNBX6A3VQVCYhtIL2y2oK4AZz4TFsQt4BjjvwWiEegMSh9AjTi0t+BhgnCCMQH4AyCMIIagBOX7gCOVdcWoJXrkTkdnFi502w2pZvmsZKHo8KqYSH3siQ3Ojd9q1Kg3FfudrU+V9LvejM+PI0gjGRpnwcIQKxMqqwiuTCXfyrE8/S76hg9gevD3EOVHX/D3Ras1qtsfQ2Wx3CvfwHzpVA+dKJVLAAAAAlwSFlzAAALEwAACxMBAJqcGAAABelpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMS0wNC0yOFQwMjoxOTowOSswMzowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjUtMDktMTdUMTU6NDI6NTkrMDM6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjUtMDktMTdUMTU6NDI6NTkrMDM6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0iQXBwbGUgUkdCIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjM3ZTkyMWY2LTMwZGUtYmI0Ny1iNGQ1LTUwMjA5MDAwN2U1NSIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjMzOGE5ODlmLTBjZjUtYmU0YS1hZTE4LWZmOTFmYTEwYTllMCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjJlNTU4YmM0LTJhNGYtMzg0NS05NzE2LTc1MGFiMjA1NWViMiI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MmU1NThiYzQtMmE0Zi0zODQ1LTk3MTYtNzUwYWIyMDU1ZWIyIiBzdEV2dDp3aGVuPSIyMDIxLTA0LTI4VDAyOjE5OjA5KzAzOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjM3ZTkyMWY2LTMwZGUtYmI0Ny1iNGQ1LTUwMjA5MDAwN2U1NSIgc3RFdnQ6d2hlbj0iMjAyNS0wOS0xN1QxNTo0Mjo1OSswMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNl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	2025-10-07 00:07:20.279	USD	#064f6a	#33c3ff	gregorian
\.


--
-- Data for Name: student_accounts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.student_accounts (id, student_id, total_amount_due, total_paid, current_balance, academic_year, notes, created_at, updated_at) FROM stdin;
e954e654-ec1c-4a8d-8a3d-3f91d496ab31	511d11ec-a6a4-49f4-a904-eae24ca4eda2	200.00	200.00	0.00	2024-2025	\N	2025-10-06 13:40:38.258486	2025-10-06 15:42:39.419
5dc78cf6-07de-48b4-a2fd-e6a8f21e9992	610afd35-216a-4bff-977b-532bca968d61	500.00	10.00	490.00	2024-2025	\N	2025-10-06 23:12:01.292354	2025-10-06 23:12:14.202
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.students (id, arabic_name, date_of_birth, gender, national_id, enrollment_date, class_id, parent_name, parent_phone, parent_email, address, medical_notes, status, photo_url, created_at, updated_at) FROM stdin;
511d11ec-a6a4-49f4-a904-eae24ca4eda2	محمد طرشة	1994-01-29	male	\N	2025-10-06	7a3428ce-67cf-465d-98a6-bc02e3e1f6ac	محمد طرشة	+905383848157			\N	active	\N	2025-10-06 13:40:37.986638	2025-10-06 13:40:37.986638
610afd35-216a-4bff-977b-532bca968d61	حسان طرشة	1994-01-01	male	\N	2025-10-06	7a3428ce-67cf-465d-98a6-bc02e3e1f6ac	محمد طرشة	+963968 655 624⁩			\N	active	\N	2025-10-06 23:12:01.020544	2025-10-06 23:12:01.020544
\.


--
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.subjects (id, name, arabic_name, code, description, created_at) FROM stdin;
e9c8a64a-deb2-467b-a9e0-c62287e2b944	الرياضيات	الرياضيات	MATH		2025-10-06 21:02:37.130337
a724c771-d1dc-415b-9cad-26e0cd1a1fa6	العربي	العربي	ARABIC		2025-10-06 21:09:12.514044
\.


--
-- Data for Name: teacher_advances; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.teacher_advances (id, teacher_id, amount, advance_date, deduction_month, status, notes, recorded_by, created_at) FROM stdin;
1decd047-41c8-4ccb-9a8b-9e0f285727f4	4fdded1e-b9ba-44e0-b08e-7c2f746d7037	1000.00	2025-10-08	\N	deducted	\N	\N	2025-10-08 15:10:35.669801
d98334c0-fbb7-4770-bb01-9cc59157c4c5	4fdded1e-b9ba-44e0-b08e-7c2f746d7037	500.00	2025-10-08	\N	pending	\N	\N	2025-10-08 15:22:47.221279
bf3d0ee4-2b36-4d4c-8b86-ddbe78e7bdb7	e249d384-f413-4542-92c4-ea78c0a2fa13	20.00	2025-10-08	\N	deducted	\N	\N	2025-10-08 15:16:56.868327
eb38a65f-477c-4908-b760-2c1cb854b891	ca20307a-9d06-4e4a-b018-45476dff601b	800.00	2025-10-08	\N	deducted	\N	\N	2025-10-08 15:27:15.056353
2ee6ea2d-66e8-4f98-a533-13222ddc1d78	893d2dc5-973e-4345-af3c-97240eca96d1	10.00	2025-10-08	\N	deducted	\N	\N	2025-10-08 15:43:52.677893
b694f2b9-8338-43d0-97ea-3472fd49b6e6	e249d384-f413-4542-92c4-ea78c0a2fa13	10.00	2025-10-08	\N	pending	\N	\N	2025-10-08 15:44:24.414841
228494e4-027e-4a7e-a1f1-f4ea1db9032f	9f1f0a03-c317-48be-85af-2b360449605c	50.00	2025-10-08	\N	pending	\N	\N	2025-10-08 15:45:54.079583
2ee7d336-513e-4cc2-a86f-520b4c10cf64	fe6c928f-0465-45ce-8491-262ae47f6b40	1500.00	2025-10-08	\N	pending	\N	\N	2025-10-08 15:58:31.086041
24bbf008-a738-4306-865b-9dc8052338e7	cf70aaa9-246a-414d-a150-b88094131e99	2500.00	2025-10-08	\N	pending	\N	\N	2025-10-08 16:05:32.52661
634a86e3-f079-4f4f-b61d-534da21d81f0	9db46210-0725-49db-8c24-ad33bb925cb2	250.00	2025-10-08	\N	pending	\N	\N	2025-10-08 16:22:56.204328
3f2a8fa0-2305-4de1-b92e-47859744e01c	9db46210-0725-49db-8c24-ad33bb925cb2	100.00	2025-10-08	\N	pending	\N	\N	2025-10-08 16:25:14.288615
9d3e8cd6-7245-4b03-901e-adb2d7e7daeb	9db46210-0725-49db-8c24-ad33bb925cb2	50.00	2025-10-08	\N	pending	\N	\N	2025-10-08 16:25:23.117839
d2b30ed0-42ed-4c58-a9dc-696d409cd44e	9db46210-0725-49db-8c24-ad33bb925cb2	10.00	2025-10-08	\N	pending	\N	\N	2025-10-08 16:26:22.651246
4c40448a-e771-43ea-9c7a-b3a612535a37	9db46210-0725-49db-8c24-ad33bb925cb2	1.00	2025-10-08	\N	pending	\N	\N	2025-10-08 16:27:02.998052
4d69e71f-69b6-4feb-8dcd-82c7aabb8c9c	9db46210-0725-49db-8c24-ad33bb925cb2	50.00	2025-10-08	\N	pending	\N	\N	2025-10-08 16:30:56.618835
a12c25fc-237d-44dc-b0d5-10e50ebb0277	e0556bf0-33aa-4de4-b384-4d9c06a0d3a9	3999.00	2025-10-08	\N	pending	\N	\N	2025-10-08 18:00:54.43673
493814c1-6f78-4703-bf2f-3fadcefff222	b38fa4b9-79f3-40a2-8c9e-2ecfa4286c73	10.00	2025-10-08	\N	pending	\N	\N	2025-10-08 18:04:16.749637
bc54b006-0122-411e-82e5-5a2874580e8f	b38fa4b9-79f3-40a2-8c9e-2ecfa4286c73	20.00	2025-10-08	\N	pending	\N	\N	2025-10-08 18:05:20.332312
f764736c-7866-4e20-a67e-da6a0d68e497	398080ad-2166-4ac8-88e0-06c571ad8bae	500.00	2025-10-08	\N	deducted	\N	\N	2025-10-08 18:08:42.665726
3c591cd3-cf04-48bd-8bec-4fc55500fa91	631f5a0d-d1d2-41d9-9160-166b93f61b53	1000.00	2025-10-08	\N	pending	\N	\N	2025-10-08 18:13:17.680229
\.


--
-- Data for Name: teacher_attendance; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.teacher_attendance (id, teacher_id, date, status, deduct_from_salary, notes, recorded_by, created_at) FROM stdin;
9e1595a6-a4b9-4917-837b-ff859517016f	398080ad-2166-4ac8-88e0-06c571ad8bae	2025-10-08	unpaid_leave	t	\N	\N	2025-10-08 19:22:56.609619
dcef3f1e-dce8-4fcd-a79f-d13df0650f5f	2e3200af-b806-4443-a40c-e75f91e18bac	2025-10-08	present	f	\N	\N	2025-10-08 19:22:56.605498
6d264964-6b61-48ab-8b80-dde42dd34d13	9c7ce462-0977-4442-abdb-8cba1990c69d	2025-10-08	present	f	\N	\N	2025-10-08 19:22:56.763113
0bce5a85-24bb-4bfb-8e06-b323eb9dbde9	76c9ed80-b1b0-47c4-a8e1-d823d6834ea6	2025-10-08	present	f	\N	\N	2025-10-08 19:22:56.763848
21a069ca-2454-4b25-8eee-7b6b1b4329a4	e249d384-f413-4542-92c4-ea78c0a2fa13	2025-10-08	present	f	\N	\N	2025-10-08 19:22:56.847822
c8bff614-ff05-4089-bfd0-12f294355fa7	9f1f0a03-c317-48be-85af-2b360449605c	2025-10-08	present	f	\N	\N	2025-10-08 19:22:56.856227
fed03caa-c40c-4eac-9171-da3c5b33054b	b38fa4b9-79f3-40a2-8c9e-2ecfa4286c73	2025-10-08	present	f	\N	\N	2025-10-08 19:22:56.607338
67211df0-ebd3-48bb-9bf7-cf86361a2978	e0556bf0-33aa-4de4-b384-4d9c06a0d3a9	2025-10-08	present	f	\N	\N	2025-10-08 19:22:56.767535
49f155a9-ec8b-4891-991e-f9bdb0119715	ca20307a-9d06-4e4a-b018-45476dff601b	2025-10-08	present	f	\N	\N	2025-10-08 19:22:56.847297
e7609c33-06e8-4d36-9197-018879dc7d15	cf70aaa9-246a-414d-a150-b88094131e99	2025-10-08	present	f	\N	\N	2025-10-08 19:22:56.604634
ccd43f53-22b5-47ca-a325-4a4ff7025eb9	893d2dc5-973e-4345-af3c-97240eca96d1	2025-10-08	present	f	\N	\N	2025-10-08 19:22:56.763885
10b7f233-033d-491d-b8a8-0a1f20215f4d	631f5a0d-d1d2-41d9-9160-166b93f61b53	2025-10-08	absent	f	\N	\N	2025-10-08 19:22:56.81633
49d64c35-cd9b-4381-86ed-7963d010a271	fe6c928f-0465-45ce-8491-262ae47f6b40	2025-10-08	present	f	\N	\N	2025-10-08 19:22:56.81757
fb93aaac-cee5-4012-a5c7-38db3311eb5f	4fdded1e-b9ba-44e0-b08e-7c2f746d7037	2025-10-08	present	f	\N	\N	2025-10-08 19:22:56.846875
c73578fe-5df2-4f2b-b8fa-11a16c7b4e3c	9db46210-0725-49db-8c24-ad33bb925cb2	2025-10-08	present	f	\N	\N	2025-10-08 19:22:56.904641
94e6dad8-72a2-40c4-9d28-a19aaa4e03a4	794d5e81-9db1-42de-8352-f03ce812d000	2025-10-08	present	f	\N	\N	2025-10-08 19:22:56.905624
\.


--
-- Data for Name: teacher_salaries; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.teacher_salaries (id, teacher_id, month, base_salary, bonuses, deductions, advances_deducted, net_salary, payment_date, status, notes, recorded_by, created_at, updated_at) FROM stdin;
88a7aa9d-f00e-487e-8518-6f945aa2dcc9	794d5e81-9db1-42de-8352-f03ce812d000	2025-10	5000.00	0.00	0.00	0.00	5000.00	2025-10-08	paid	\N	\N	2025-10-08 14:56:40.694387	2025-10-08 14:56:40.694387
4de2298a-1b22-4bbd-9e9f-9de1ab857e8a	9f1f0a03-c317-48be-85af-2b360449605c	2025-10	200.00	0.00	0.00	0.00	200.00	2025-10-08	paid	\N	\N	2025-10-08 15:01:20.84821	2025-10-08 15:01:20.84821
4e6152a1-3464-41b8-bdf8-f203e65d6216	9db46210-0725-49db-8c24-ad33bb925cb2	2025-10	500.00	0.00	0.00	0.00	500.00	2025-10-08	paid	\N	\N	2025-10-08 15:01:27.979228	2025-10-08 15:01:27.979228
16056442-2f05-4692-b786-dcc2cfe40759	4fdded1e-b9ba-44e0-b08e-7c2f746d7037	2025-10	5000.00	0.00	0.00	1000.00	4000.00	2025-10-08	paid	\N	\N	2025-10-08 15:12:24.233035	2025-10-08 15:12:46.833
f9ad94b5-a777-416c-81e1-f2e4faae0545	e249d384-f413-4542-92c4-ea78c0a2fa13	2025-10	200.00	0.00	0.00	20.00	180.00	2025-10-08	paid	\N	\N	2025-10-08 15:23:10.338642	2025-10-08 15:23:10.338642
21c2cbd1-2529-44fa-bf0c-0d3f10b9d413	ca20307a-9d06-4e4a-b018-45476dff601b	2025-10	3000.00	0.00	0.00	800.00	2200.00	2025-10-08	paid	\N	\N	2025-10-08 15:27:54.016224	2025-10-08 15:27:54.016224
d8adf1ee-ca94-4221-85af-6ad9ff5c3e4d	893d2dc5-973e-4345-af3c-97240eca96d1	2025-10	200.00	0.00	0.00	10.00	190.00	2025-10-08	paid	\N	\N	2025-10-08 15:44:01.529932	2025-10-08 15:44:01.529932
5240e335-432d-43e5-8dc1-aeed764c72ed	e0556bf0-33aa-4de4-b384-4d9c06a0d3a9	2025-10	4000.00	0.00	0.00	0.00	4000.00	2025-10-08	paid	\N	\N	2025-10-08 15:48:05.580677	2025-10-08 15:48:05.580677
8200cb40-9036-4d57-8990-e73b5cb56e92	9c7ce462-0977-4442-abdb-8cba1990c69d	2025-09	3500.00	0.00	0.00	0.00	3500.00	2025-09-15	paid	\N	\N	2025-10-08 15:48:21.791034	2025-10-08 15:48:21.791034
3eb1e2fc-fc62-4c53-bb9a-844584c6e036	76c9ed80-b1b0-47c4-a8e1-d823d6834ea6	2025-01	5000.00	0.00	0.00	0.00	5000.00	2025-01-20	paid	\N	\N	2025-10-08 15:48:41.568938	2025-10-08 15:48:41.568938
2680be14-4a4e-425a-897e-52da1e838a01	398080ad-2166-4ac8-88e0-06c571ad8bae	2025-10	3000.00	0.00	0.00	500.00	2500.00	2025-10-08	paid	\N	\N	2025-10-08 18:10:05.737213	2025-10-08 18:10:05.737213
\.


--
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.teachers (id, arabic_name, email, phone, gender, date_of_birth, hire_date, qualification, specialization, monthly_salary, status, photo_url, created_at, updated_at) FROM stdin;
9db46210-0725-49db-8c24-ad33bb925cb2	محمد طرشة		+905383848157	male	\N	2025-10-06	بكالوريوس	عربي	500.00	active	\N	2025-10-06 14:11:14.978121	2025-10-06 14:11:14.978121
794d5e81-9db1-42de-8352-f03ce812d000	معلم اختبار fu-eh6xv	test.fu-eh6xv@example.com	+966584544904	male	\N	2025-10-08	\N	\N	5000.00	active	\N	2025-10-08 14:55:43.792531	2025-10-08 14:55:43.792531
9f1f0a03-c317-48be-85af-2b360449605c	استاذ جديد	s@gmail.com	+90333333333	male	\N	2025-10-08	بكالوريوس	رياضيات	200.00	active	\N	2025-10-08 15:01:08.064178	2025-10-08 15:01:08.064178
4fdded1e-b9ba-44e0-b08e-7c2f746d7037	معلم اختبار 220ccS2A	testV0yY6a@test.com	0501234567	male	\N	2025-10-08	\N	\N	5000.00	active	\N	2025-10-08 15:10:26.489942	2025-10-08 15:10:26.489942
e249d384-f413-4542-92c4-ea78c0a2fa13	جديد جديد	w@gmail.com	+90455544545	male	\N	2025-10-08	بكالوريوس	رياضيات	200.00	active	\N	2025-10-08 15:16:38.165538	2025-10-08 15:16:38.165538
ca20307a-9d06-4e4a-b018-45476dff601b	معلم نظيف RgsS6j_r	cleanRgsS6j_r@test.com	0509999999	male	\N	2025-10-08	\N	\N	3000.00	active	\N	2025-10-08 15:25:01.197404	2025-10-08 15:25:01.197404
893d2dc5-973e-4345-af3c-97240eca96d1	حديث	sssssss@gmail.com	+90506	male	\N	2025-10-08	سس	d	200.00	active	\N	2025-10-08 15:43:38.623642	2025-10-08 15:43:38.623642
e0556bf0-33aa-4de4-b384-4d9c06a0d3a9	معلم أكتوبر Ru8XHI	octRu8XHI@test.com	0501111111	male	\N	2025-01-01	\N	\N	4000.00	active	\N	2025-10-08 15:47:47.337452	2025-10-08 15:47:47.337452
9c7ce462-0977-4442-abdb-8cba1990c69d	معلم سبتمبر 6vuXOy	sep6vuXOy@test.com	0502222222	male	\N	2025-01-01	\N	\N	3500.00	active	\N	2025-10-08 15:47:47.337452	2025-10-08 15:47:47.337452
76c9ed80-b1b0-47c4-a8e1-d823d6834ea6	معلم يناير DRdFu9	janDRdFu9@test.com	0503333333	male	\N	2024-01-01	\N	\N	5000.00	active	\N	2025-10-08 15:47:47.337452	2025-10-08 15:47:47.337452
fe6c928f-0465-45ce-8491-262ae47f6b40	معلم اختبار السلف Zi1-G-Rw	advtestZi1-G-Rw@test.com	0501234567	male	\N	2025-10-08	\N	\N	2000.00	active	\N	2025-10-08 15:56:00.935462	2025-10-08 15:56:00.935462
cf70aaa9-246a-414d-a150-b88094131e99	معلم اختبار السلف j0-FATuf	advtestj0-FATuf@test.com	0501234567	male	\N	2025-10-08	\N	\N	3000.00	active	\N	2025-10-08 16:03:39.028632	2025-10-08 16:03:39.028632
2e3200af-b806-4443-a40c-e75f91e18bac	محمد طرشة جديد	SSSSA@GMAIL.COM	+9066616161	male	\N	2025-10-08	جمعة	ميي	500.00	active	\N	2025-10-08 16:54:05.568161	2025-10-08 16:54:05.568161
b38fa4b9-79f3-40a2-8c9e-2ecfa4286c73	تجربة 10	TEST40@gmail.com	+9061161616	male	\N	2025-10-08	معهد	عربي	200.00	active	\N	2025-10-08 18:04:00.371135	2025-10-08 18:04:00.371135
398080ad-2166-4ac8-88e0-06c571ad8bae	تجربة اختبار 95bMPj	test95bMPj@example.com	0501111111	male	\N	2025-10-08	\N	\N	3000.00	active	\N	2025-10-08 18:08:34.178048	2025-10-08 18:08:34.178048
631f5a0d-d1d2-41d9-9160-166b93f61b53	اختبار سلفة H-3wkA	testH-3wkA@example.com	0501111111	male	\N	2025-10-08	\N	\N	5000.00	active	\N	2025-10-08 18:12:55.447357	2025-10-08 18:12:55.447357
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, username, password, role, created_at) FROM stdin;
\.


--
-- Name: attendance attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_pkey PRIMARY KEY (id);


--
-- Name: class_subjects class_subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.class_subjects
    ADD CONSTRAINT class_subjects_pkey PRIMARY KEY (id);


--
-- Name: classes classes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_pkey PRIMARY KEY (id);


--
-- Name: education_levels education_levels_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.education_levels
    ADD CONSTRAINT education_levels_pkey PRIMARY KEY (id);


--
-- Name: grades grades_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: payment_transactions payment_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payment_transactions
    ADD CONSTRAINT payment_transactions_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: school_expenses school_expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.school_expenses
    ADD CONSTRAINT school_expenses_pkey PRIMARY KEY (id);


--
-- Name: school_settings school_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.school_settings
    ADD CONSTRAINT school_settings_pkey PRIMARY KEY (id);


--
-- Name: student_accounts student_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_accounts
    ADD CONSTRAINT student_accounts_pkey PRIMARY KEY (id);


--
-- Name: student_accounts student_accounts_student_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_accounts
    ADD CONSTRAINT student_accounts_student_id_unique UNIQUE (student_id);


--
-- Name: students students_national_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_national_id_unique UNIQUE (national_id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: subjects subjects_code_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_code_unique UNIQUE (code);


--
-- Name: subjects subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY (id);


--
-- Name: teacher_advances teacher_advances_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_advances
    ADD CONSTRAINT teacher_advances_pkey PRIMARY KEY (id);


--
-- Name: teacher_attendance teacher_attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance
    ADD CONSTRAINT teacher_attendance_pkey PRIMARY KEY (id);


--
-- Name: teacher_salaries teacher_salaries_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_salaries
    ADD CONSTRAINT teacher_salaries_pkey PRIMARY KEY (id);


--
-- Name: teachers teachers_email_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_email_unique UNIQUE (email);


--
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: attendance attendance_class_id_classes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_class_id_classes_id_fk FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: attendance attendance_recorded_by_teachers_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_recorded_by_teachers_id_fk FOREIGN KEY (recorded_by) REFERENCES public.teachers(id);


--
-- Name: attendance attendance_student_id_students_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_student_id_students_id_fk FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: class_subjects class_subjects_education_level_id_education_levels_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.class_subjects
    ADD CONSTRAINT class_subjects_education_level_id_education_levels_id_fk FOREIGN KEY (education_level_id) REFERENCES public.education_levels(id);


--
-- Name: class_subjects class_subjects_subject_id_subjects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.class_subjects
    ADD CONSTRAINT class_subjects_subject_id_subjects_id_fk FOREIGN KEY (subject_id) REFERENCES public.subjects(id);


--
-- Name: class_subjects class_subjects_teacher_id_teachers_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.class_subjects
    ADD CONSTRAINT class_subjects_teacher_id_teachers_id_fk FOREIGN KEY (teacher_id) REFERENCES public.teachers(id);


--
-- Name: classes classes_education_level_id_education_levels_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_education_level_id_education_levels_id_fk FOREIGN KEY (education_level_id) REFERENCES public.education_levels(id);


--
-- Name: classes classes_teacher_id_teachers_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_teacher_id_teachers_id_fk FOREIGN KEY (teacher_id) REFERENCES public.teachers(id);


--
-- Name: grades grades_class_id_classes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_class_id_classes_id_fk FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: grades grades_student_id_students_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_student_id_students_id_fk FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: grades grades_subject_id_subjects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_subject_id_subjects_id_fk FOREIGN KEY (subject_id) REFERENCES public.subjects(id);


--
-- Name: grades grades_teacher_id_teachers_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_teacher_id_teachers_id_fk FOREIGN KEY (teacher_id) REFERENCES public.teachers(id);


--
-- Name: notifications notifications_created_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: notifications notifications_target_class_id_classes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_target_class_id_classes_id_fk FOREIGN KEY (target_class_id) REFERENCES public.classes(id);


--
-- Name: payment_transactions payment_transactions_recorded_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payment_transactions
    ADD CONSTRAINT payment_transactions_recorded_by_users_id_fk FOREIGN KEY (recorded_by) REFERENCES public.users(id);


--
-- Name: payment_transactions payment_transactions_student_account_id_student_accounts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payment_transactions
    ADD CONSTRAINT payment_transactions_student_account_id_student_accounts_id_fk FOREIGN KEY (student_account_id) REFERENCES public.student_accounts(id);


--
-- Name: payment_transactions payment_transactions_student_id_students_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payment_transactions
    ADD CONSTRAINT payment_transactions_student_id_students_id_fk FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: payments payments_student_id_students_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_student_id_students_id_fk FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: school_expenses school_expenses_recorded_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.school_expenses
    ADD CONSTRAINT school_expenses_recorded_by_users_id_fk FOREIGN KEY (recorded_by) REFERENCES public.users(id);


--
-- Name: student_accounts student_accounts_student_id_students_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_accounts
    ADD CONSTRAINT student_accounts_student_id_students_id_fk FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: students students_class_id_classes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_class_id_classes_id_fk FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: teacher_advances teacher_advances_recorded_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_advances
    ADD CONSTRAINT teacher_advances_recorded_by_users_id_fk FOREIGN KEY (recorded_by) REFERENCES public.users(id);


--
-- Name: teacher_advances teacher_advances_teacher_id_teachers_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_advances
    ADD CONSTRAINT teacher_advances_teacher_id_teachers_id_fk FOREIGN KEY (teacher_id) REFERENCES public.teachers(id);


--
-- Name: teacher_attendance teacher_attendance_recorded_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance
    ADD CONSTRAINT teacher_attendance_recorded_by_users_id_fk FOREIGN KEY (recorded_by) REFERENCES public.users(id);


--
-- Name: teacher_attendance teacher_attendance_teacher_id_teachers_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance
    ADD CONSTRAINT teacher_attendance_teacher_id_teachers_id_fk FOREIGN KEY (teacher_id) REFERENCES public.teachers(id);


--
-- Name: teacher_salaries teacher_salaries_recorded_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_salaries
    ADD CONSTRAINT teacher_salaries_recorded_by_users_id_fk FOREIGN KEY (recorded_by) REFERENCES public.users(id);


--
-- Name: teacher_salaries teacher_salaries_teacher_id_teachers_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_salaries
    ADD CONSTRAINT teacher_salaries_teacher_id_teachers_id_fk FOREIGN KEY (teacher_id) REFERENCES public.teachers(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

