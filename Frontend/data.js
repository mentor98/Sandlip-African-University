export const student = {
  name: "Timothy Emmanuel",
  id: "SAU/CSC/2026/001",
  programme: "B.Sc. Computer Science",
  faculty: "Faculty of Sciences",
  department: "Department of Computer Science",
  level: "300 Level",
  semester: "First Semester",
  session: "2026/2027",
  email: "timothy.emmanuel@sau.edu.ng",
  phone: "+234 801 234 5678",
  admissionDate: "15 October 2024",
  status: "Active Student",
  cgpa: "4.37",
  currentGpa: "4.52",
  unitsRegistered: 13,
  maxUnitsAllowed: 24,
  minUnitsAllowed: 12,
  outstandingFees: "₦145,000",
  totalFees: "₦385,000",
  paidFees: "₦240,000"
};

export const nav = [
  ["Dashboard", "dashboard", "dashboard"],
  ["My Course", "courses", "courses"],
  ["Course Registration", "registration", "registration"],
  ["Results & Grades", "results", "results"],
  ["Reserve Accomodation", "accommodation", "accommodation"],
  ["Timetable", "timetable", "timetable"],
  ["Fees & Payments", "fees", "fees"],
  ["Printable Documents", "documents", "documents"],
  ["Print Biodata Form", "biodata", "biodata"],
  ["Student Community", "community", "community"],
  ["Convocation Payment", "convocation", "convocation"],
  ["My Profile", "profile", "profile"],
  ["Settings", "settings", "settings"],
  ["Change Password", "password", "password"],
  ["Logout", "logout", "logout"]
];

export const courses = [
  {
    code: "CSC 301",
    title: "Data Structures & Algorithms",
    units: 3,
    lecturer: "Dr. Sarah Williams",
    status: "Registered",
    time: "Mon & Wed • 08:00 – 10:00 AM",
    venue: "Software Lab A",
    attendance: "94%",
    description: "Advanced analysis of fundamental algorithms, dynamic programming, graph traversal, asymptotic notations, and complexity theory.",
    syllabus: ["Asymptotic Analysis & Big-O", "Trees & Heaps", "Graph Algorithms (Dijkstra, BFS, DFS)", "Dynamic Programming", "NP-Completeness"]
  },
  {
    code: "MAT 302",
    title: "Discrete Mathematics",
    units: 3,
    lecturer: "Dr. David Okoro",
    status: "Registered",
    time: "Mon & Thu • 10:00 – 12:00 PM",
    venue: "Science Hall 2",
    attendance: "88%",
    description: "Mathematical logic, set theory, combinatorics, proof techniques, graph theory, and recurrence relations.",
    syllabus: ["Propositional Logic", "Set Operations & Relations", "Combinatorics & Permutations", "Graph Theory Fundamentals", "Recurrence Relations"]
  },
  {
    code: "SEN 304",
    title: "Software Engineering",
    units: 2,
    lecturer: "Engr. Adaeze Eze",
    status: "Registered",
    time: "Wed • 02:00 – 04:00 PM",
    venue: "Innovation Lab B",
    attendance: "96%",
    description: "Principles of modern software development, Agile/Scrum methodologies, software architecture patterns, CI/CD, and system design.",
    syllabus: ["Software Lifecycle Models", "Agile & Scrum Practices", "UML & System Architecture", "Testing & QA", "CI/CD & DevOps"]
  },
  {
    code: "CSC 303",
    title: "Database Management Systems",
    units: 3,
    lecturer: "Dr. Chidi Nwosu",
    status: "Registered",
    time: "Fri • 08:00 – 11:00 AM",
    venue: "Computer Lab 1",
    attendance: "92%",
    description: "Relational database design, SQL, normalization (1NF-BCNF), ACID properties, indexing, and NoSQL databases.",
    syllabus: ["Entity-Relationship Modeling", "Relational Algebra & Advanced SQL", "Database Normalization", "Transactions & Concurrency", "NoSQL & Supabase Integration"]
  },
  {
    code: "GST 301",
    title: "Entrepreneurship Studies",
    units: 2,
    lecturer: "Mrs. R. Ibrahim",
    status: "Registered",
    time: "Tue • 12:00 – 02:00 PM",
    venue: "Main Auditorium",
    attendance: "90%",
    description: "Venture creation, business models, financial planning, intellectual property, and tech startup growth strategies in Africa.",
    syllabus: ["Opportunity Identification", "Business Model Canvas", "Financial Projections", "Pitching & Fundraising", "Intellectual Property Rights"]
  }
];

export const availableCourses = [
  { code: "AIT 305", title: "Introduction to Artificial Intelligence", units: 3, lecturer: "Dr. B. Adeyemi", status: "Available" },
  { code: "CSC 305", title: "Computer Networks & Security", units: 3, lecturer: "Dr. N. Hassan", status: "Available" },
  { code: "SEN 306", title: "Human-Computer Interaction", units: 2, lecturer: "Mr. T. Alabi", status: "Available" },
  { code: "DAT 301", title: "Data Science & Machine Learning", units: 3, lecturer: "Dr. F. Oduwole", status: "Available" }
];

export const semesterResults = {
  "1st Semester 2024/2025": { gpa: "4.10", courses: [["CSC 101", 3, "A", "5.0"], ["MAT 101", 3, "B", "4.0"], ["PHY 101", 3, "A", "5.0"], ["GST 101", 2, "A", "5.0"]] },
  "2nd Semester 2024/2025": { gpa: "4.25", courses: [["CSC 102", 3, "A", "5.0"], ["MAT 102", 3, "B", "4.0"], ["STA 102", 3, "A", "5.0"], ["GST 102", 2, "A", "5.0"]] },
  "1st Semester 2025/2026": { gpa: "4.40", courses: [["CSC 201", 3, "A", "5.0"], ["MAT 201", 3, "A", "5.0"], ["SEN 201", 2, "B", "4.0"], ["CSC 203", 3, "A", "5.0"]] },
  "2nd Semester 2025/2026": { gpa: "4.48", courses: [["CSC 202", 3, "A", "5.0"], ["MAT 202", 3, "A", "5.0"], ["SEN 202", 2, "A", "5.0"], ["CSC 204", 3, "B", "4.0"]] },
  "1st Semester 2026/2027": { gpa: "4.52", courses: [["CSC 301", 3, "A", "5.0"], ["MAT 302", 3, "B", "4.0"], ["SEN 304", 2, "A", "5.0"], ["CSC 303", 3, "A", "5.0"], ["GST 301", 2, "B", "4.0"]] }
};

export const results = [
  ["CSC 301", "Data Structures & Algorithms", "3", "A", "5.0"],
  ["MAT 302", "Discrete Mathematics", "3", "B", "4.0"],
  ["SEN 304", "Software Engineering", "2", "A", "5.0"],
  ["CSC 303", "Database Management Systems", "3", "A", "5.0"],
  ["GST 301", "Entrepreneurship Studies", "2", "B", "4.0"]
];

export const timetable = [
  { day: "Monday", time: "08:00 – 10:00 AM", course: "CSC 301", title: "Data Structures & Algorithms", venue: "Software Lab A", lecturer: "Dr. Sarah Williams", type: "Lecture" },
  { day: "Monday", time: "10:00 – 12:00 PM", course: "MAT 302", title: "Discrete Mathematics", venue: "Science Hall 2", lecturer: "Dr. David Okoro", type: "Lecture" },
  { day: "Tuesday", time: "12:00 – 02:00 PM", course: "GST 301", title: "Entrepreneurship Studies", venue: "Main Auditorium", lecturer: "Mrs. R. Ibrahim", type: "Lecture" },
  { day: "Wednesday", time: "08:00 – 10:00 AM", course: "CSC 301", title: "Data Structures Practical", venue: "Software Lab A", lecturer: "Dr. Sarah Williams", type: "Lab" },
  { day: "Wednesday", time: "02:00 – 04:00 PM", course: "SEN 304", title: "Software Engineering", venue: "Innovation Lab B", lecturer: "Engr. Adaeze Eze", type: "Lecture" },
  { day: "Thursday", time: "10:00 – 12:00 PM", course: "MAT 302", title: "Discrete Mathematics Tutorial", venue: "Science Hall 2", lecturer: "Dr. David Okoro", type: "Tutorial" },
  { day: "Friday", time: "08:00 – 11:00 AM", course: "CSC 303", title: "Database Management Systems", venue: "Computer Lab 1", lecturer: "Dr. Chidi Nwosu", type: "Lab & Lecture" }
];

export const assignments = [
  {
    id: "ASG-001",
    title: "Implement Self-Balancing AVL & Red-Black Trees",
    course: "CSC 301",
    lecturer: "Dr. Sarah Williams",
    deadline: "20 August 2026, 11:59 PM",
    status: "Pending",
    grade: "—",
    instructions: "Write a clean C++ or Python implementation of an AVL tree with rotation logic and benchmarking reports comparing performance against standard BSTs.",
    resources: "AVL_Tree_Specification.pdf",
    feedback: null
  },
  {
    id: "ASG-002",
    title: "Software Requirements Specification (SRS) Document",
    course: "SEN 304",
    lecturer: "Engr. Adaeze Eze",
    deadline: "16 August 2026, 11:59 PM",
    status: "Submitted",
    grade: "88%",
    instructions: "Produce an IEEE-compliant SRS document for a healthcare tele-consultation platform including UML use cases and ER diagrams.",
    resources: "IEEE_830_Template.docx",
    feedback: "Excellent requirement decomposition and well-structured use case scenarios."
  },
  {
    id: "ASG-003",
    title: "Set Theory & Proof Techniques Problem Set",
    course: "MAT 302",
    lecturer: "Dr. David Okoro",
    deadline: "12 August 2026, 11:59 PM",
    status: "Graded",
    grade: "92%",
    instructions: "Complete exercises 4.1 to 4.18 covering mathematical induction, pigeonhole principle, and modular arithmetic.",
    resources: "MAT302_ProblemSet_1.pdf",
    feedback: "Rigorous mathematical proofs. Minor error in Question 14 b."
  }
];

export const exams = [
  { course: "CSC 301", title: "Data Structures & Algorithms", date: "25 August 2026", time: "09:00 – 11:30 AM", venue: "CBT Centre Lab 1", seat: "Seat A-024" },
  { course: "MAT 302", title: "Discrete Mathematics", date: "28 August 2026", time: "09:00 – 11:30 AM", venue: "Science Hall 2", seat: "Seat B-117" },
  { course: "SEN 304", title: "Software Engineering", date: "02 September 2026", time: "01:00 – 03:30 PM", venue: "Innovation Lab B", seat: "Seat C-048" },
  { course: "CSC 303", title: "Database Management Systems", date: "05 September 2026", time: "09:00 – 12:00 PM", venue: "CBT Centre Lab 2", seat: "Seat D-012" },
  { course: "GST 301", title: "Entrepreneurship Studies", date: "08 September 2026", time: "02:00 – 04:00 PM", venue: "Main Auditorium", seat: "Seat E-205" }
];

export const feeBreakdown = [
  { item: "Tuition Fee", amount: "₦250,000", status: "Paid ₦200,000" },
  { item: "ICT & Portal Access Fee", amount: "₦45,000", status: "Paid ₦40,000" },
  { item: "Library & E-Resource Access", amount: "₦20,000", status: "Paid ₦20,000" },
  { item: "Laboratory & Practical Fee", amount: "₦40,000", status: "Outstanding ₦40,000" },
  { item: "Student Union & Medical Insurance", amount: "₦30,000", status: "Outstanding ₦30,000" }
];

export const feeTransactions = [
  { id: "SAU-PAY-2026-991", date: "08 Aug 2026", description: "Tuition Part Payment (First Instalment)", amount: "₦200,000", method: "Card (Paystack)", status: "Successful" },
  { id: "SAU-PAY-2026-814", date: "02 Aug 2026", description: "ICT & Portal Registration Fee", amount: "₦40,000", method: "Bank Transfer", status: "Successful" }
];

export const libraryResources = [
  { title: "Introduction to Algorithms (4th Edition)", author: "Cormen, Leiserson, Rivest, Stein", course: "CSC 301", category: "Computer Science", format: "PDF", downloads: 1420 },
  { title: "Software Engineering: A Practitioner's Approach", author: "Roger S. Pressman", course: "SEN 304", category: "Engineering", format: "E-Book", downloads: 980 },
  { title: "Database System Concepts (7th Edition)", author: "Silberschatz, Korth, Sudarshan", course: "CSC 303", category: "Computer Science", format: "PDF", downloads: 1150 },
  { title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell & Peter Norvig", course: "AIT 305", category: "Artificial Intelligence", format: "PDF", downloads: 2100 },
  { title: "Discrete Mathematics and Its Applications", author: "Kenneth H. Rosen", course: "MAT 302", category: "Computer Science", format: "DOC", downloads: 870 },
  { title: "Building Scalable African Tech Ventures", author: "Sandlip Innovation Press", course: "GST 301", category: "Business", format: "Video", downloads: 640 }
];

export const lecturers = [
  {
    name: "Dr. Sarah Williams",
    title: "Senior Lecturer & AI Lead",
    dept: "Computer Science",
    email: "sarah.williams@sau.edu.ng",
    office: "Computing Complex, Office 302",
    hours: "Mon & Wed • 10:00 AM – 01:00 PM",
    courses: ["CSC 301", "AIT 305"],
    avatar: "SW",
    bio: "Ph.D. in Computer Science (Imperial College). Specializes in Deep Learning algorithms and high-performance graph processing."
  },
  {
    name: "Dr. David Okoro",
    title: "Associate Professor",
    dept: "Mathematics",
    email: "david.okoro@sau.edu.ng",
    office: "Science Building, Office 114",
    hours: "Tue & Thu • 11:00 AM – 02:00 PM",
    courses: ["MAT 302"],
    avatar: "DO",
    bio: "Research focuses on algebraic topology, cryptography, and discrete optimization structures."
  },
  {
    name: "Engr. Adaeze Eze",
    title: "Lecturer I & Lead Developer",
    dept: "Software Engineering",
    email: "adaeze.eze@sau.edu.ng",
    office: "Innovation Lab, Office 04",
    hours: "Wed & Fri • 01:00 PM – 04:00 PM",
    courses: ["SEN 304"],
    avatar: "AE",
    bio: "Ex-Google Software Engineer with 10+ years industry experience in cloud architecture and microservices."
  },
  {
    name: "Dr. Chidi Nwosu",
    title: "Senior Lecturer",
    dept: "Computer Science",
    email: "chidi.nwosu@sau.edu.ng",
    office: "Computing Complex, Office 208",
    hours: "Mon & Fri • 09:00 AM – 12:00 PM",
    courses: ["CSC 303"],
    avatar: "CN",
    bio: "Expert in distributed databases, SQL query optimization, and privacy-preserving data management."
  }
];

export const announcements = [
  { id: 1, title: "Course Registration Deadline Extended to 22 August", category: "Academic", date: "11 Aug 2026", content: "The Academic Affairs division has extended course registration for First Semester 2026/2027 until Friday, 22 August 2026. Please finalize your registration load.", unread: true },
  { id: 2, title: "First Semester Examination Timetable Released", category: "Examination", date: "10 Aug 2026", content: "The draft examination timetable is now published under the Examinations section. Please inspect your course venues and seat allocations.", unread: true },
  { id: 3, title: "Fee Instalment Payment Plans Available", category: "Finance", date: "08 Aug 2026", content: "Students with outstanding tuition fees can apply for the 2-stage flexible payment plan via the Fees & Payments section.", unread: false },
  { id: 4, title: "SAU Annual Innovation Hackathon 2026 Registration Open", category: "Events", date: "05 Aug 2026", content: "Compete for ₦2,500,000 in seed grants at the SAU Innovation Hackathon. Register your project team under the Innovation Hub.", unread: false }
];

export const events = [
  { id: "EVT-101", dateDay: "18", dateMonth: "AUG", title: "SAU Innovation Week 2026", venue: "Main Auditorium & Innovation Hub", category: "Campus", time: "09:00 AM Daily", status: "Registered" },
  { id: "EVT-102", dateDay: "22", dateMonth: "AUG", title: "AI & Robotics Hackathon Showcase", venue: "AI Research Center", category: "Technology", time: "10:00 AM – 06:00 PM", status: "Open" },
  { id: "EVT-103", dateDay: "03", dateMonth: "SEP", title: "Pan-African Tech Career Fair 2026", venue: "SAU Sports Complex", category: "Career", time: "09:00 AM – 04:00 PM", status: "Open" },
  { id: "EVT-104", dateDay: "15", dateMonth: "SEP", title: "Undergraduate Research Symposium", venue: "Science Complex Hall 1", category: "Research", time: "10:00 AM – 03:00 PM", status: "Open" }
];

export const communityPosts = [
  {
    id: "POST-101",
    author: "Emmanuel Timothy",
    authorRole: "B.Sc. Computer Science • 300L",
    avatar: "ET",
    time: "2 hours ago",
    category: "AI & Robotics",
    content: "Who is interested in forming a team for the upcoming SAU Innovation Hackathon? We are targeting an AI solution for smart agricultural yield prediction using satellite datasets!",
    likes: 24,
    comments: [
      { author: "Amina Bello", text: "Count me in! I can handle the TensorFlow model integration." },
      { author: "Chinedu Okeke", text: "Sounds awesome. I have experience with Flutter UI design." }
    ]
  },
  {
    id: "POST-102",
    author: "Dr. Sarah Williams",
    authorRole: "Senior Lecturer",
    avatar: "SW",
    time: "Yesterday",
    category: "Developers",
    content: "Reminder for CSC 301 students: The practical lab session on Graph Traversals (Dijkstra vs A* Search) will be held tomorrow at Software Lab A. Bring your laptops configured with C++/Python.",
    likes: 42,
    comments: [
      { author: "Kemi Adeleke", text: "Thank you Dr. Sarah! Will the lecture slides be available on the portal beforehand?" }
    ]
  }
];

export const innovationProjects = [
  {
    id: "PRJ-001",
    name: "AgroSense AI",
    team: "Emmanuel Timothy & Amina Bello",
    description: "AI-powered crop disease diagnosis and soil health monitoring app for smallholder farmers across West Africa.",
    tech: ["Python", "TensorFlow", "Flutter", "Supabase"],
    likes: 89,
    views: 520,
    github: "https://github.com/sau-innovators/agrosense-ai",
    demo: "https://agrosense.sau.app"
  },
  {
    id: "PRJ-002",
    name: "CampusCompanion SAU",
    team: "Team Alpha (Software Eng. 300L)",
    description: "Real-time automated campus navigation, shuttle booking, and peer tutoring platform tailored for SAU students.",
    tech: ["JavaScript", "Node.js", "Express", "PostgreSQL"],
    likes: 134,
    views: 890,
    github: "https://github.com/sau-innovators/campus-companion",
    demo: "https://companion.sau.app"
  }
];

export const researchItems = [
  { title: "Privacy-Preserving Federated Learning for Distributed Healthcare", lead: "Dr. Sarah Williams & Research Group", status: "Active Project", grant: "₦5,000,000 Grant", openPositions: 2 },
  { title: "Optimizing Renewable Microgrids using Deep Reinforcement Learning", lead: "Dr. David Okoro", status: "Call for Undergrad Research Assistants", grant: "SAU Seed Fund", openPositions: 3 },
  { title: "Natural Language Processing for Indigenous African Languages", lead: "Prof. K. Alabi", status: "Published in IEEE Transactions 2026", grant: "Pan-African AI Initiative", openPositions: 0 }
];

export const achievements = [
  { title: "Academic Excellence", desc: "Maintained a CGPA above 4.30 across 3 consecutive semesters", badge: "trophy", date: "July 2026" },
  { title: "Technology Contributor", desc: "Published 3 open-source projects on the SAU Innovation Hub", badge: "laptop", date: "June 2026" },
  { title: "Research Fellow", desc: "Co-authored undergraduate AI paper accepted at SAU Research Symposium", badge: "microscope", date: "May 2026" },
  { title: "Community Champion", desc: "Provided 50+ verified peer answers on the SAU Student Forum", badge: "handshake", date: "April 2026" }
];

export const leaderboard = [
  { rank: 1, name: "Amina Bello", level: "300L", programme: "Computer Science", points: 2850 },
  { rank: 2, name: "Chinedu Okeke", level: "400L", programme: "Software Engineering", points: 2710 },
  { rank: 3, name: "Emmanuel Timothy", level: "300L", programme: "Computer Science", points: 2640, current: true },
  { rank: 4, name: "Kemi Adeleke", level: "300L", programme: "Cyber Security", points: 2490 },
  { rank: 5, name: "Tunde Bakare", level: "200L", programme: "Artificial Intelligence", points: 2310 }
];

export const learningResources = [
  { id: "RES-01", title: "Data Structures & Algorithms Complete Notes", course: "CSC 301", type: "PDF", size: "4.2 MB", author: "Dr. Sarah Williams" },
  { id: "RES-02", title: "Discrete Math Past Exam Questions (2020-2025)", course: "MAT 302", type: "Past Questions", size: "8.1 MB", author: "Department of Mathematics" },
  { id: "RES-03", title: "Software Architecture & UML Diagram Video Tutorials", course: "SEN 304", type: "Video", size: "240 MB", author: "Engr. Adaeze Eze" },
  { id: "RES-04", title: "Database Systems Normalization & SQL Cheatsheet", course: "CSC 303", type: "Study Guide", size: "1.8 MB", author: "Dr. Chidi Nwosu" }
];

export const notificationsList = [
  { id: "NOT-01", title: "New Assignment Posted", text: "Dr. Sarah Williams posted 'Implement Self-Balancing AVL Trees' for CSC 301.", time: "10 mins ago", unread: true },
  { id: "NOT-02", title: "Result Published", text: "First Semester 2026/2027 continuous assessment grades for SEN 304 are released.", time: "2 hours ago", unread: true },
  { id: "NOT-03", title: "Fee Reminder", text: "Your outstanding balance of ₦145,000 is due on 30 August 2026.", time: "1 day ago", unread: true },
  { id: "NOT-04", title: "Event Reminder", text: "SAU Innovation Week begins on 18 August at the Main Auditorium.", time: "2 days ago", unread: false }
];

export const messagesData = [
  {
    contact: "Dr. Sarah Williams",
    role: "Lecturer • CSC 301",
    avatar: "SW",
    lastTime: "10:42 AM",
    messages: [
      { sender: "Dr. Sarah Williams", text: "Hello Emmanuel, your proposal for the AVL tree optimization assignment looks solid.", time: "10:30 AM" },
      { sender: "Emmanuel Timothy", text: "Thank you Dr. Sarah! I will be submitting the C++ benchmark reports tomorrow.", time: "10:42 AM" }
    ]
  },
  {
    contact: "Student Services & Support",
    role: "Administrative Office",
    avatar: "SS",
    lastTime: "Yesterday",
    messages: [
      { sender: "Student Services", text: "Your course registration overload approval request for 24 units has been approved by the Dean.", time: "Yesterday" }
    ]
  }
];

export const supportFaqs = [
  { q: "How do I request an official academic transcript?", a: "You can request an official transcript by visiting the Transcript section and clicking 'Download Transcript' or submitting a formal request ticket to the Registry." },
  { q: "What is the maximum credit units I can register per semester?", a: "The standard credit load is 12 to 24 units per semester. Overloads above 24 units require Departmental Board approval." },
  { q: "How can I apply for the fee instalment payment plan?", a: "Navigate to the Fees & Payments section, select 'Pay Now', and choose the 2-Stage Payment Plan option." }
];

export const supportTickets = [
  { ticketId: "TKT-8841", subject: "Course Registration Unit Discrepancy", category: "Academic", status: "Resolved", date: "04 Aug 2026" },
  { ticketId: "TKT-9102", subject: "Portal Fee Payment Receipt Download", category: "Finance", status: "In Progress", date: "09 Aug 2026" }
];
