'use client';

import React from 'react';
import HeroSection from './HeroSection';
import HeadOfInstitution from './HeadOfInstitution';
import FacultyGrid from './FacultyGrid';
import WhyOurTeachers from './WhyOurTeachers';

interface Subject {
    name: string;
    level: string;
}

interface Teacher {
    id: number;
    name: string;
    title: string;
    image: string;
    alt: string;
    qualification: string;
    experience: string;
    specialization: string[];
    subjects: Subject[];
    philosophy: string;
    achievements: string[];
    teachingStyle: string;
    department: string;
}

interface Achievement {
    icon: string;
    title: string;
    description: string;
}

interface HeadProfile {
    name: string;
    title: string;
    image: string;
    alt: string;
    qualification: string;
    experience: string;
    specialization: string;
    philosophy: string;
    achievements: Achievement[];
}

const TeachersInteractive: React.FC = () => {
    const headProfile: HeadProfile = {
        name: "Dr. Ramesh Kumar",
        title: "Principal & Academic Director",
        image: "https://img.rocket.new/generatedImages/rocket_gen_img_105b96742-1763300606680.png",
        alt: "Professional portrait of Dr. Ramesh Kumar, middle-aged Indian man with grey hair wearing navy blue suit and glasses, smiling confidently in modern office setting",
        qualification: "Ph.D. in Education, M.Sc. Mathematics",
        experience: "25+ Years",
        specialization: "Educational Leadership & Mathematics",
        philosophy: "Education is not the filling of a pail, but the lighting of a fire. At Vertex Academy, we believe in nurturing curiosity, fostering critical thinking, and building confidence in every student. Our approach combines traditional values with modern pedagogical methods to create well-rounded individuals ready to excel in an ever-changing world.",
        achievements: [
            {
                icon: "TrophyIcon",
                title: "National Excellence Award",
                description: "Recognized for outstanding contribution to education in 2023"
            },
            {
                icon: "AcademicCapIcon",
                title: "Educational Innovation",
                description: "Pioneered personalized learning methodologies"
            },
            {
                icon: "UserGroupIcon",
                title: "Student Success",
                description: "Mentored 5000+ students to academic excellence"
            },
            {
                icon: "BookOpenIcon",
                title: "Published Author",
                description: "Author of 3 books on modern teaching practices"
            }]

    };

    const teachers: Teacher[] = [
        {
            id: 1,
            name: "Mrs. Priya Sharma",
            title: "Senior Mathematics Teacher",
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_1d1a6cf71-1763301532880.png",
            alt: "Professional photo of Mrs. Priya Sharma, Indian woman in her 30s with long black hair wearing burgundy blazer, smiling warmly in classroom setting",
            qualification: "M.Sc. Mathematics, B.Ed.",
            experience: "12 Years",
            specialization: ["Algebra", "Geometry", "Calculus", "Trigonometry"],
            subjects: [
                { name: "Mathematics", level: "Class 6-10" },
                { name: "Advanced Mathematics", level: "Class 11-12" }],

            philosophy: "Mathematics is not about numbers, equations, or algorithms—it's about understanding patterns and developing logical thinking. I strive to make every concept relatable to real-world applications.",
            achievements: [
                "100% pass rate in board examinations for 5 consecutive years",
                "Trained students for national mathematics olympiads",
                "Developed innovative teaching modules for complex topics"],

            teachingStyle: "Interactive problem-solving with visual aids and real-life examples",
            department: "Mathematics"
        },
        {
            id: 2,
            name: "Mr. Arun Krishnan",
            title: "Physics & Chemistry Specialist",
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_1e97714b6-1763291772723.png",
            alt: "Professional headshot of Mr. Arun Krishnan, Indian man in his 40s with short black hair and beard wearing white shirt, standing in science laboratory",
            qualification: "M.Sc. Physics, M.Sc. Chemistry",
            experience: "15 Years",
            specialization: ["Mechanics", "Thermodynamics", "Organic Chemistry", "Physical Chemistry"],
            subjects: [
                { name: "Physics", level: "Class 8-12" },
                { name: "Chemistry", level: "Class 8-12" }],

            philosophy: "Science is best learned through experimentation and observation. I encourage students to question everything and discover answers through hands-on learning experiences.",
            achievements: [
                "Guided 50+ students to IIT-JEE success",
                "Published research papers in educational journals",
                "Established state-of-the-art laboratory practices"],

            teachingStyle: "Experiment-based learning with conceptual clarity focus",
            department: "Science"
        },
        {
            id: 3,
            name: "Ms. Lakshmi Venkat",
            title: "English Language Expert",
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_10d056ae9-1763294317999.png",
            alt: "Professional portrait of Ms. Lakshmi Venkat, young Indian woman with shoulder-length black hair wearing teal blouse, smiling confidently in library setting",
            qualification: "M.A. English Literature, B.Ed.",
            experience: "10 Years",
            specialization: ["Grammar", "Literature", "Creative Writing", "Communication Skills"],
            subjects: [
                { name: "English Language", level: "Class 6-10" },
                { name: "English Literature", level: "Class 11-12" }],

            philosophy: "Language is the gateway to expression and understanding. I focus on building confidence in communication while nurturing a love for literature and creative expression.",
            achievements: [
                "Students won multiple inter-school debate competitions",
                "Conducted creative writing workshops for 1000+ students",
                "Developed comprehensive grammar improvement programs"],

            teachingStyle: "Interactive discussions with emphasis on practical communication",
            department: "Languages"
        },
        {
            id: 4,
            name: "Dr. Suresh Babu",
            title: "Biology & Life Sciences Teacher",
            image: "https://images.unsplash.com/photo-1729162128021-f37dca3ff30d",
            alt: "Professional photo of Dr. Suresh Babu, middle-aged Indian man with grey-streaked hair wearing white lab coat and glasses, standing in biology laboratory",
            qualification: "Ph.D. Botany, M.Sc. Zoology",
            experience: "18 Years",
            specialization: ["Botany", "Zoology", "Human Anatomy", "Ecology"],
            subjects: [
                { name: "Biology", level: "Class 8-10" },
                { name: "Botany & Zoology", level: "Class 11-12" }],

            philosophy: "Biology is the study of life itself. I aim to instill wonder about the natural world while building strong foundational knowledge for medical and life science careers.",
            achievements: [
                "Mentored 100+ students into medical colleges",
                "Organized field trips and nature study programs",
                "Created comprehensive NEET preparation modules"],

            teachingStyle: "Visual learning with diagrams, models, and practical demonstrations",
            department: "Science"
        },
        {
            id: 5,
            name: "Mrs. Kavitha Rajan",
            title: "Social Studies & History Teacher",
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_110d8ebca-1763293372651.png",
            alt: "Professional portrait of Mrs. Kavitha Rajan, Indian woman in her 40s with tied-back hair wearing green saree, smiling warmly in classroom with historical maps",
            qualification: "M.A. History, M.A. Political Science",
            experience: "14 Years",
            specialization: ["Indian History", "World History", "Civics", "Geography"],
            subjects: [
                { name: "Social Studies", level: "Class 6-10" },
                { name: "History & Political Science", level: "Class 11-12" }],

            philosophy: "History teaches us who we are and where we come from. I make the past come alive through storytelling, helping students understand the present through historical context.",
            achievements: [
                "Organized heritage walks and historical site visits",
                "Students consistently score 95+ in board examinations",
                "Developed interactive timeline teaching methods"],

            teachingStyle: "Narrative-based teaching with multimedia presentations",
            department: "Social Studies"
        },
        {
            id: 6,
            name: "Mr. Vijay Kumar",
            title: "Computer Science Teacher",
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_1433cc5e9-1763293852448.png",
            alt: "Professional headshot of Mr. Vijay Kumar, young Indian man with short hair wearing blue shirt, smiling in modern computer laboratory",
            qualification: "M.Tech Computer Science, B.E.",
            experience: "8 Years",
            specialization: ["Programming", "Web Development", "Data Structures", "AI Basics"],
            subjects: [
                { name: "Computer Science", level: "Class 6-10" },
                { name: "Advanced Computing", level: "Class 11-12" }],

            philosophy: "Technology is the future, and coding is the new literacy. I focus on building logical thinking and problem-solving skills through hands-on programming projects.",
            achievements: [
                "Students won state-level coding competitions",
                "Introduced AI and machine learning basics curriculum",
                "Established coding club with 200+ active members"],

            teachingStyle: "Project-based learning with real-world applications",
            department: "Technology"
        },
        {
            id: 7,
            name: "Ms. Divya Menon",
            title: "Tamil Language Teacher",
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_1acd953c0-1763293371113.png",
            alt: "Professional portrait of Ms. Divya Menon, young Indian woman with long black hair wearing orange traditional dress, smiling in classroom with Tamil literature books",
            qualification: "M.A. Tamil Literature, B.Ed.",
            experience: "9 Years",
            specialization: ["Tamil Grammar", "Classical Literature", "Modern Poetry", "Language Skills"],
            subjects: [
                { name: "Tamil Language", level: "Class 6-10" },
                { name: "Tamil Literature", level: "Class 11-12" }],

            philosophy: "Language is culture, and Tamil is our heritage. I aim to preserve and promote our rich linguistic tradition while making learning enjoyable and relevant.",
            achievements: [
                "Students won inter-school Tamil elocution contests",
                "Organized Tamil cultural festivals annually",
                "Developed modern teaching aids for classical texts"],

            teachingStyle: "Cultural immersion with literature appreciation",
            department: "Languages"
        },
        {
            id: 8,
            name: "Mr. Karthik Subramanian",
            title: "Commerce & Accountancy Teacher",
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_12b9c2bb3-1763293370864.png",
            alt: "Professional photo of Mr. Karthik Subramanian, Indian man in his 30s with neat hair wearing grey suit, standing confidently in modern classroom",
            qualification: "M.Com, CA Inter, B.Ed.",
            experience: "11 Years",
            specialization: ["Accountancy", "Business Studies", "Economics", "Financial Management"],
            subjects: [
                { name: "Commerce", level: "Class 11-12" },
                { name: "Accountancy", level: "Class 11-12" }],

            philosophy: "Commerce education is about understanding the business world. I prepare students not just for exams but for real-world financial literacy and entrepreneurial thinking.",
            achievements: [
                "100% pass rate in commerce board examinations",
                "Mentored students for CA foundation success",
                "Organized business plan competitions"],

            teachingStyle: "Case study method with practical business scenarios",
            department: "Commerce"
        },
        {
            id: 9,
            name: "Mrs. Meena Iyer",
            title: "Sanskrit & Hindi Teacher",
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_110d8ebca-1763293372651.png",
            alt: "Professional portrait of Mrs. Meena Iyer, middle-aged Indian woman with traditional bindi wearing yellow saree, smiling warmly in classroom with Sanskrit texts",
            qualification: "M.A. Sanskrit, M.A. Hindi",
            experience: "16 Years",
            specialization: ["Sanskrit Grammar", "Vedic Literature", "Hindi Language", "Classical Texts"],
            subjects: [
                { name: "Sanskrit", level: "Class 6-10" },
                { name: "Hindi", level: "Class 6-10" }],

            philosophy: "Ancient languages hold timeless wisdom. I make Sanskrit and Hindi accessible and interesting by connecting classical knowledge with contemporary relevance.",
            achievements: [
                "Students achieved distinction in Sanskrit olympiads",
                "Conducted workshops on Vedic mathematics",
                "Preserved traditional teaching methods with modern tools"],

            teachingStyle: "Traditional methods enhanced with multimedia resources",
            department: "Languages"
        }];


    return (
        <div className="min-h-screen">
            <HeroSection />
            <HeadOfInstitution profile={headProfile} />
            <FacultyGrid teachers={teachers} />
            <WhyOurTeachers />
        </div>);

};

export default TeachersInteractive;