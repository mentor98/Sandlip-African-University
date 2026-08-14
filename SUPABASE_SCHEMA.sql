-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Students Table
CREATE TABLE IF NOT EXISTS public.students (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'SAU/CSC/2026/001',
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    programme VARCHAR(255) NOT NULL,
    faculty VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    level VARCHAR(20) NOT NULL DEFAULT '300L',
    cgpa NUMERIC(3,2) DEFAULT 4.37,
    current_gpa NUMERIC(3,2) DEFAULT 4.52,
    units_registered INT DEFAULT 13,
    max_units_allowed INT DEFAULT 24,
    min_units_allowed INT DEFAULT 12,
    outstanding_fees VARCHAR(50) DEFAULT '₦145,000',
    total_fees VARCHAR(50) DEFAULT '₦385,000',
    paid_fees VARCHAR(50) DEFAULT '₦240,000',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
    code VARCHAR(20) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    units INT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Compulsory',
    lecturer VARCHAR(255),
    time VARCHAR(100),
    venue VARCHAR(255),
    semester VARCHAR(50) DEFAULT '1st Semester 2026/2027',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Course Registrations Table
CREATE TABLE IF NOT EXISTS public.course_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(50) REFERENCES public.students(id) ON DELETE CASCADE,
    course_code VARCHAR(20) REFERENCES public.courses(code) ON DELETE CASCADE,
    semester VARCHAR(50) NOT NULL DEFAULT '1st Semester 2026/2027',
    status VARCHAR(50) DEFAULT 'Approved',
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, course_code, semester)
);

-- 5. Results & Grades Table
CREATE TABLE IF NOT EXISTS public.results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(50) REFERENCES public.students(id) ON DELETE CASCADE,
    course_code VARCHAR(20) NOT NULL,
    course_title VARCHAR(255) NOT NULL,
    units INT NOT NULL,
    score INT NOT NULL,
    grade VARCHAR(5) NOT NULL,
    grade_point NUMERIC(3,2) NOT NULL,
    semester VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Fee Payments & Transactions Table
CREATE TABLE IF NOT EXISTS public.payments (
    id VARCHAR(100) PRIMARY KEY,
    student_id VARCHAR(50) REFERENCES public.students(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount VARCHAR(50) NOT NULL,
    method VARCHAR(100) DEFAULT 'Paystack Gateway',
    status VARCHAR(50) DEFAULT 'Successful',
    reference VARCHAR(100) UNIQUE,
    date_paid TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Hostel Accommodations Table
CREATE TABLE IF NOT EXISTS public.accommodations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(50) REFERENCES public.students(id) ON DELETE CASCADE,
    hostel_name VARCHAR(255) NOT NULL,
    room_number VARCHAR(50) NOT NULL,
    bed_space VARCHAR(50) NOT NULL,
    fee_paid VARCHAR(50) NOT NULL,
    session VARCHAR(50) DEFAULT '2026/2027',
    status VARCHAR(50) DEFAULT 'Allocated',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Community Posts Table
CREATE TABLE IF NOT EXISTS public.community_posts (
    id VARCHAR(100) PRIMARY KEY,
    student_id VARCHAR(50) REFERENCES public.students(id) ON DELETE CASCADE,
    author VARCHAR(255) NOT NULL,
    author_role VARCHAR(255),
    avatar VARCHAR(50) DEFAULT 'ET',
    category VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    likes INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Allow Public Access for Application Operations
CREATE POLICY "Allow public read students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update students" ON public.students FOR ALL USING (true);

CREATE POLICY "Allow public read courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Allow public manage course_registrations" ON public.course_registrations FOR ALL USING (true);
CREATE POLICY "Allow public read results" ON public.results FOR SELECT USING (true);
CREATE POLICY "Allow public manage payments" ON public.payments FOR ALL USING (true);
CREATE POLICY "Allow public manage accommodations" ON public.accommodations FOR ALL USING (true);
CREATE POLICY "Allow public manage community_posts" ON public.community_posts FOR ALL USING (true);

INSERT INTO public.students (
    id, name, email, phone, programme, faculty, department, level, cgpa, current_gpa,
    units_registered, max_units_allowed, min_units_allowed, outstanding_fees, total_fees, paid_fees
) VALUES (
    'SAU/CSC/2026/001',
    ' Emmanuel Timothy',
    'student@sau.edu.ng',
    '+234 812 345 6789',
    'B.Sc. Computer Science',
    'Faculty of Sciences',
    'Department of Computer Science',
    '300L',
    4.37,
    4.52,
    13,
    24,
    12,
    '₦145,000',
    '₦385,000',
    '₦240,000'
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.courses (code, title, units, status, lecturer, time, venue, semester) VALUES
('CSC 301', 'Data Structures & Algorithms', 3, 'Compulsory', 'Dr. Sarah Williams', 'Mon 09:00 - 11:00 AM', 'Lecture Theatre B', '1st Semester 2026/2027'),
('CSC 303', 'Database Management Systems', 3, 'Compulsory', 'Dr. Chidi Nwosu', 'Wed 11:00 AM - 01:00 PM', 'Computer Lab 1', '1st Semester 2026/2027'),
('CSC 305', 'Operating Systems Principles', 3, 'Compulsory', 'Prof. A. O. Bello', 'Fri 08:00 - 10:00 AM', 'Lecture Theatre A', '1st Semester 2026/2027'),
('SEN 304', 'Software Engineering Architecture', 3, 'Compulsory', 'Engr. Adaeze Eze', 'Thu 02:00 - 04:00 PM', 'Software Lab A', '1st Semester 2026/2027'),
('GST 301', 'Entrepreneurship & Innovation', 1, 'Required', 'Dr. K. Alabi', 'Tue 01:00 - 02:00 PM', 'Main Auditorium', '1st Semester 2026/2027')
ON CONFLICT (code) DO NOTHING;
