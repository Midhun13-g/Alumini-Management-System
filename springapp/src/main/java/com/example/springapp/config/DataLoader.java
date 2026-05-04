package com.example.springapp.config;

import com.example.springapp.entity.*;
import com.example.springapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepo;
    private final AlumniProfileRepository alumniProfileRepo;
    private final StudentProfileRepository studentProfileRepo;
    private final ConnectRepository connectRepo;
    private final MessageRepository messageRepo;
    private final MentorshipRepository mentorshipRepo;
    private final EventRepository eventRepo;
    private final EventRegistrationRepository eventRegRepo;
    private final JobPostRepository jobPostRepo;
    private final JobApplicationRepository jobAppRepo;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Fix any existing users with null role
        userRepo.findAll().forEach(u -> {
            if (u.getRole() == null) {
                u.setRole("ADMIN".equals(u.getUserType()) ? "ADMIN" : "USER");
                userRepo.save(u);
            }
        });

        // Always ensure admin account exists
        if (userRepo.findByEmail("admin@alumni.edu").isEmpty()) {
            User admin = new User();
            admin.setFirstName("Admin"); admin.setLastName("User");
            admin.setEmail("admin@alumni.edu");
            admin.setPassword(passwordEncoder.encode("password123"));
            admin.setUserType("ADMIN"); admin.setActive(true); admin.setRole("ADMIN");
            userRepo.save(admin);
            System.out.println("✅ Admin user created: admin@alumni.edu / password123");
        }

        if (userRepo.count() > 2) return; // skip full seeding if data already exists

        String pw = passwordEncoder.encode("password123");

        // ── Alumni ──────────────────────────────────────────────────────────
        String[][] alumniData = {
            {"Arjun",   "Sharma",   "arjun.sharma@alumni.edu",   "Software",   "Java,Spring Boot,AWS",          "2018", "true",  "https://linkedin.com/in/arjun-sharma"},
            {"Priya",   "Nair",     "priya.nair@alumni.edu",     "AI/ML",      "Python,TensorFlow,PyTorch",      "2019", "true",  "https://linkedin.com/in/priya-nair"},
            {"Rahul",   "Verma",    "rahul.verma@alumni.edu",    "Finance",    "Excel,Python,SQL",               "2017", "false", "https://linkedin.com/in/rahul-verma"},
            {"Sneha",   "Iyer",     "sneha.iyer@alumni.edu",     "Healthcare", "React,Node.js,MongoDB",          "2020", "true",  "https://linkedin.com/in/sneha-iyer"},
            {"Karan",   "Mehta",    "karan.mehta@alumni.edu",    "DevOps",     "Docker,Kubernetes,AWS,Terraform", "2016", "true",  "https://linkedin.com/in/karan-mehta"},
            {"Ananya",  "Reddy",    "ananya.reddy@alumni.edu",   "Software",   "React,TypeScript,GraphQL",       "2021", "false", "https://linkedin.com/in/ananya-reddy"},
            {"Vikram",  "Singh",    "vikram.singh@alumni.edu",   "Cybersec",   "Penetration Testing,SIEM,Python","2015", "true",  "https://linkedin.com/in/vikram-singh"},
            {"Meera",   "Pillai",   "meera.pillai@alumni.edu",   "Data Sci",   "R,Python,Tableau,SQL",           "2022", "false", "https://linkedin.com/in/meera-pillai"},
            {"Rohan",   "Gupta",    "rohan.gupta@alumni.edu",    "Blockchain", "Solidity,Web3.js,Rust",          "2019", "true",  "https://linkedin.com/in/rohan-gupta"},
            {"Divya",   "Krishnan", "divya.krishnan@alumni.edu", "Cloud",      "Azure,GCP,Terraform,Python",     "2020", "true",  "https://linkedin.com/in/divya-krishnan"},
        };

        List<User> alumniUsers = new ArrayList<>();
        for (String[] d : alumniData) {
            User u = new User();
            u.setFirstName(d[0]); u.setLastName(d[1]); u.setEmail(d[2]);
            u.setPassword(pw); u.setUserType("ALUMNI"); u.setActive(true); u.setRole("USER");
            u = userRepo.save(u);

            AlumniProfile p = new AlumniProfile();
            p.setUser(u); p.setIndustry(d[3]); p.setSkills(d[4]);
            p.setGraduationYear(Integer.parseInt(d[5]));
            p.setIsMentor(Boolean.parseBoolean(d[6]));
            p.setLinkedinUrl(d[7]);
            p.setBio("Experienced professional in " + d[3] + " with expertise in " + d[4].split(",")[0] + ".");
            p.setVerified(true);
            alumniProfileRepo.save(p);
            alumniUsers.add(u);
        }

        // ── Students ─────────────────────────────────────────────────────────
        String[][] studentData = {
            {"Aditya",   "Kumar",    "aditya.kumar@student.edu",   "CSE",         "2022", "STU001"},
            {"Pooja",    "Sharma",   "pooja.sharma@student.edu",   "ECE",         "2023", "STU002"},
            {"Nikhil",   "Joshi",    "nikhil.joshi@student.edu",   "IT",          "2021", "STU003"},
            {"Riya",     "Patel",    "riya.patel@student.edu",     "CSE",         "2024", "STU004"},
            {"Siddharth","Rao",      "siddharth.rao@student.edu",  "Mechanical",  "2022", "STU005"},
            {"Kavya",    "Menon",    "kavya.menon@student.edu",    "CSE",         "2023", "STU006"},
            {"Harsh",    "Agarwal",  "harsh.agarwal@student.edu",  "IT",          "2021", "STU007"},
            {"Tanvi",    "Desai",    "tanvi.desai@student.edu",    "ECE",         "2024", "STU008"},
            {"Manish",   "Tiwari",   "manish.tiwari@student.edu",  "CSE",         "2022", "STU009"},
            {"Shreya",   "Bose",     "shreya.bose@student.edu",    "IT",          "2023", "STU010"},
            {"Aryan",    "Malhotra", "aryan.malhotra@student.edu", "CSE",         "2021", "STU011"},
            {"Ishita",   "Saxena",   "ishita.saxena@student.edu",  "Mechanical",  "2024", "STU012"},
            {"Varun",    "Nair",     "varun.nair@student.edu",     "ECE",         "2022", "STU013"},
            {"Prachi",   "Jain",     "prachi.jain@student.edu",    "CSE",         "2023", "STU014"},
            {"Akash",    "Pandey",   "akash.pandey@student.edu",   "IT",          "2021", "STU015"},
        };

        List<User> studentUsers = new ArrayList<>();
        for (String[] d : studentData) {
            User u = new User();
            u.setFirstName(d[0]); u.setLastName(d[1]); u.setEmail(d[2]);
            u.setPassword(pw); u.setUserType("STUDENT"); u.setActive(true); u.setRole("USER");
            u = userRepo.save(u);

            StudentProfile p = new StudentProfile();
            p.setUser(u); p.setDepartment(d[3]);
            p.setYearOfJoining(Integer.parseInt(d[4]));
            p.setStudentId(d[5]);
            p.setStudentName(d[0] + " " + d[1]);
            p.setLinkedinUrl("https://linkedin.com/in/" + d[0].toLowerCase() + "-" + d[1].toLowerCase());
            studentProfileRepo.save(p);
            studentUsers.add(u);
        }

        // ── Admin user ────────────────────────────────────────────────────────
        User admin = new User();
        admin.setFirstName("Admin"); admin.setLastName("User");
        admin.setEmail("admin@alumni.edu"); admin.setPassword(pw);
        admin.setUserType("ADMIN"); admin.setActive(true); admin.setRole("ADMIN");
        userRepo.save(admin);

        // ── Connections ───────────────────────────────────────────────────────
        List<User> allUsers = new ArrayList<>();
        allUsers.addAll(alumniUsers);
        allUsers.addAll(studentUsers);

        Set<String> connPairs = new HashSet<>();
        List<ConnectEntity> acceptedConns = new ArrayList<>();
        Random rnd = new Random(42);

        // 20 ACCEPTED
        int accepted = 0;
        while (accepted < 20) {
            User a = allUsers.get(rnd.nextInt(allUsers.size()));
            User b = allUsers.get(rnd.nextInt(allUsers.size()));
            if (a.getId().equals(b.getId())) continue;
            String key = Math.min(a.getId(), b.getId()) + "-" + Math.max(a.getId(), b.getId());
            if (connPairs.contains(key)) continue;
            connPairs.add(key);
            ConnectEntity c = new ConnectEntity();
            c.setSender(a); c.setReceiver(b); c.setStatus(Status.ACCEPTED);
            c.setCreatedAt(LocalDateTime.now().minusDays(rnd.nextInt(60) + 1));
            acceptedConns.add(connectRepo.save(c));
            accepted++;
        }

        // 10 PENDING
        int pending = 0;
        while (pending < 10) {
            User a = allUsers.get(rnd.nextInt(allUsers.size()));
            User b = allUsers.get(rnd.nextInt(allUsers.size()));
            if (a.getId().equals(b.getId())) continue;
            String key = Math.min(a.getId(), b.getId()) + "-" + Math.max(a.getId(), b.getId());
            if (connPairs.contains(key)) continue;
            connPairs.add(key);
            ConnectEntity c = new ConnectEntity();
            c.setSender(a); c.setReceiver(b); c.setStatus(Status.PENDING);
            c.setCreatedAt(LocalDateTime.now().minusDays(rnd.nextInt(10) + 1));
            connectRepo.save(c);
            pending++;
        }

        // ── Messages ──────────────────────────────────────────────────────────
        String[][] chatLines = {
            {"Hi! Can you guide me on placements?", "Sure, happy to help! What's your target role?"},
            {"I'm aiming for SDE roles at product companies.", "Great! Focus on DSA and system design."},
            {"Can you review my resume?", "Of course, send it over!"},
            {"I've applied to 10 companies so far.", "That's a good start. Keep going!"},
            {"Any tips for technical interviews?", "Practice LeetCode medium problems daily."},
            {"How did you crack your first job?", "Referrals helped a lot. Build your network!"},
            {"Should I do an internship first?", "Yes, internships give great real-world exposure."},
            {"What skills should I focus on?", "Cloud and system design are in high demand now."},
            {"Thanks for all the advice!", "Anytime! Feel free to reach out anytime."},
            {"I got an interview call!", "Congratulations! You've got this!"},
            {"Nervous about the coding round.", "Stay calm, read the problem twice before coding."},
            {"I cleared the first round!", "Amazing! Keep the momentum going."},
            {"Final round is next week.", "Prepare well. Mock interviews help a lot."},
            {"I got the offer!", "Fantastic! Proud of you!"},
            {"Thank you so much for your mentorship.", "It was my pleasure. Best of luck!"},
        };

        for (ConnectEntity conn : acceptedConns) {
            int msgCount = 5 + rnd.nextInt(11); // 5–15
            LocalDateTime ts = LocalDateTime.now().minusDays(rnd.nextInt(30) + 1);
            for (int i = 0; i < msgCount; i++) {
                String[] pair = chatLines[i % chatLines.length];
                boolean senderTurn = (i % 2 == 0);
                User sender = senderTurn ? conn.getSender() : conn.getReceiver();
                MessageEntity msg = new MessageEntity();
                msg.setConnection(conn);
                msg.setSender(sender);
                msg.setContent(pair[senderTurn ? 0 : 1]);
                msg.setSentAt(ts.plusMinutes(i * 3L + rnd.nextInt(5)));
                messageRepo.save(msg);
            }
        }

        // ── Mentorship Requests ───────────────────────────────────────────────
        String[] mentorMsgs = {
            "I'd love guidance on breaking into the tech industry.",
            "Could you mentor me on system design concepts?",
            "I need help with my career roadmap in AI/ML.",
            "Looking for guidance on open source contributions.",
            "Would appreciate advice on startup vs big tech.",
            "Need help preparing for FAANG interviews.",
            "Can you guide me on cloud certifications?",
            "Looking for a mentor in the finance domain.",
            "Need advice on building a strong portfolio.",
            "Would love to learn from your experience in DevOps.",
        };

        Set<String> mentorPairs = new HashSet<>();
        int mPending = 0, mAccepted = 0;
        int si = 0, ai = 0;
        while (mPending < 5 || mAccepted < 5) {
            User student = studentUsers.get(si % studentUsers.size());
            User alumni  = alumniUsers.get(ai % alumniUsers.size());
            si++; ai++;
            String key = student.getId() + "-" + alumni.getId();
            if (mentorPairs.contains(key)) continue;
            mentorPairs.add(key);
            MentorshipRequest mr = new MentorshipRequest();
            mr.setStudent(student); mr.setAlumni(alumni);
            mr.setMessage(mentorMsgs[(mPending + mAccepted) % mentorMsgs.length]);
            mr.setCreatedAt(LocalDateTime.now().minusDays(rnd.nextInt(20) + 1));
            if (mAccepted < 5) { mr.setStatus(Status.ACCEPTED); mAccepted++; }
            else                { mr.setStatus(Status.PENDING);  mPending++;  }
            mentorshipRepo.save(mr);
        }

        // ── Events ────────────────────────────────────────────────────────────
        Object[][] eventsData = {
            {"Alumni Meet 2026",           "Annual alumni gathering with networking sessions and keynotes.",         LocalDateTime.now().plusDays(30),  "Main Auditorium, Campus"},
            {"AI Career Webinar",          "Explore career opportunities in Artificial Intelligence and ML.",       LocalDateTime.now().plusDays(10),  "Online (Zoom)"},
            {"Startup Networking Night",   "Connect with founders, investors, and fellow entrepreneurs.",           LocalDateTime.now().plusDays(20),  "Innovation Hub, Bangalore"},
            {"Resume & Interview Workshop","Expert-led session on crafting ATS-friendly resumes.",                  LocalDateTime.now().plusDays(7),   "Seminar Hall B"},
            {"Cloud Computing Bootcamp",   "Hands-on AWS and GCP workshop for students and professionals.",        LocalDateTime.now().plusDays(45),  "Tech Lab 3, Block C"},
            {"Women in Tech Summit",       "Celebrating and empowering women in technology.",                      LocalDateTime.now().plusDays(60),  "Convention Centre"},
            {"Open Source Hackathon",      "48-hour hackathon to build impactful open source projects.",           LocalDateTime.now().plusDays(15),  "Engineering Block"},
            {"Finance & Fintech Conclave", "Industry leaders discuss the future of finance and fintech.",          LocalDateTime.now().plusDays(25),  "Business School Auditorium"},
        };

        List<Event> savedEvents = new ArrayList<>();
        for (Object[] d : eventsData) {
            Event e = new Event();
            e.setTitle((String) d[0]); e.setDescription((String) d[1]);
            e.setDateTime((LocalDateTime) d[2]); e.setLocation((String) d[3]);
            e.setCreatedBy(alumniUsers.get(rnd.nextInt(alumniUsers.size())));
            savedEvents.add(eventRepo.save(e));
        }

        // Register some students for events
        for (int i = 0; i < Math.min(studentUsers.size(), savedEvents.size() * 2); i++) {
            try {
                EventRegistration er = new EventRegistration();
                er.setUser(studentUsers.get(i % studentUsers.size()));
                er.setEvent(savedEvents.get(i % savedEvents.size()));
                eventRegRepo.save(er);
            } catch (Exception ignored) {}
        }

        // ── Jobs ──────────────────────────────────────────────────────────────
        Object[][] jobsData = {
            {"Frontend Developer",        "Google",       "Build responsive UIs using React and TypeScript.",                    "React,TypeScript,CSS,HTML"},
            {"Backend Engineer",          "Amazon",       "Design and maintain scalable Spring Boot microservices.",             "Java,Spring Boot,MySQL,AWS"},
            {"DevOps Engineer",           "Microsoft",    "Manage CI/CD pipelines and cloud infrastructure.",                   "Docker,Kubernetes,Terraform,AWS"},
            {"Data Scientist",            "Flipkart",     "Build ML models for recommendation and fraud detection.",            "Python,TensorFlow,SQL,Spark"},
            {"Full Stack Developer",      "Razorpay",     "Work on both frontend and backend of our payments platform.",        "React,Node.js,PostgreSQL"},
            {"Cloud Architect",           "Infosys",      "Design cloud-native solutions on AWS and Azure.",                    "AWS,Azure,Terraform,Python"},
            {"Mobile Developer",          "Swiggy",       "Build cross-platform mobile apps using React Native.",               "React Native,JavaScript,REST APIs"},
            {"Security Engineer",         "Zomato",       "Identify and mitigate security vulnerabilities in our systems.",     "Penetration Testing,Python,SIEM"},
            {"ML Engineer",               "CRED",         "Deploy and optimize machine learning models at scale.",              "Python,MLflow,Kubernetes,PyTorch"},
            {"Blockchain Developer",      "Polygon",      "Build smart contracts and DeFi protocols on Ethereum.",             "Solidity,Web3.js,Rust,Ethereum"},
        };

        List<JobPost> savedJobs = new ArrayList<>();
        for (int i = 0; i < jobsData.length; i++) {
            Object[] d = jobsData[i];
            JobPost jp = new JobPost();
            jp.setTitle((String) d[0]); jp.setCompany((String) d[1]);
            jp.setDescription((String) d[2]); jp.setSkillsRequired((String) d[3]);
            jp.setPostedBy(alumniUsers.get(i % alumniUsers.size()));
            jp.setCreatedAt(LocalDateTime.now().minusDays(rnd.nextInt(15) + 1));
            savedJobs.add(jobPostRepo.save(jp));
        }

        // Students apply to jobs
        Set<String> appPairs = new HashSet<>();
        for (int i = 0; i < 15; i++) {
            User student = studentUsers.get(i % studentUsers.size());
            JobPost job   = savedJobs.get(rnd.nextInt(savedJobs.size()));
            String key = student.getId() + "-" + job.getId();
            if (appPairs.contains(key)) continue;
            appPairs.add(key);
            JobApplication app = new JobApplication();
            app.setStudent(student); app.setJob(job);
            app.setResumeLink("https://drive.google.com/resume/" + student.getFirstName().toLowerCase());
            app.setStatus(Status.PENDING);
            jobAppRepo.save(app);
        }

        System.out.println("✅ DataLoader: Seeded alumni, students, connections, messages, mentorship, events, jobs.");
    }
}
