import type { Metadata, Viewport } from 'next';
import Header from '@/components/common/Header';
import dynamic from 'next/dynamic';

const AboutUsInteractive = dynamic(() => import('./components/AboutUsInteractive'), { ssr: false });

export const metadata: Metadata = {
    title: 'About Us - Vertex Academy',
    description: 'Discover Vertex Academy\'s heritage as a unit of Thanga Ramachandran Educational Trust. Learn about our nine-year commitment to academic excellence, personalized attention, and holistic student development in Sholinganallur, Chennai.'
};

export const viewport: Viewport = {
    themeColor: '#0f172a',
};

export default function AboutUsPage() {
    const aboutUsData = {
        hero: {
            title: "Shaping Futures with Excellence",
            subtitle: "A legacy of educational excellence since 2016, transforming potential into achievement through expert guidance and proven success.",
            backgroundImage: "https://images.unsplash.com/photo-1592303637753-ce1e6b8a0ffb",
            backgroundAlt: "Diverse group of students collaborating on project in modern classroom with natural lighting and educational materials"
        },
        story: {
            title: "Our Story",
            description: "Vertex Academy stands as a proud unit of the prestigious Thanga Ramachandran Educational Trust, embodying nine years of unwavering commitment to academic excellence. Located in the heart of Sholinganallur, Chennai, we have established ourselves as a beacon of quality education, where tradition seamlessly meets innovation. Our journey began with a simple yet powerful vision: to create a learning environment where every student receives personalized attention, expert guidance, and the tools necessary to unlock their full potential. Today, with a proven track record of 95% success rates, we continue to transform lives through comprehensive curricula, dedicated faculty, and a holistic approach to education that nurtures not just academic excellence, but character, creativity, and critical thinking.",
            image: "https://images.unsplash.com/photo-1542335921-14e62352b0cf",
            imageAlt: "Modern educational institution building with glass facade and students walking on campus grounds during daytime",
            highlights: [
                {
                    icon: "AcademicCapIcon",
                    title: "Educational Trust Legacy",
                    description: "Part of the esteemed Thanga Ramachandran Educational Trust with decades of educational excellence"
                },
                {
                    icon: "SparklesIcon",
                    title: "Proven Track Record",
                    description: "95% success rate demonstrating our commitment to student achievement and academic excellence"
                },
                {
                    icon: "UserGroupIcon",
                    title: "Personalized Attention",
                    description: "Small batch sizes ensuring every student receives individual focus and customized learning support"
                }]

        },
        mvv: [
            {
                icon: "RocketLaunchIcon",
                title: "Our Mission",
                description: "To provide world-class education that empowers students with knowledge, skills, and values necessary for success in an ever-evolving global landscape. We strive to create confident, capable learners who excel academically while developing strong character and social responsibility.",
                color: "bg-gradient-to-br from-brand-primary to-brand-secondary"
            },
            {
                icon: "EyeIcon",
                title: "Our Vision",
                description: "To be recognized as Chennai's premier educational institution, setting the benchmark for academic excellence, innovative teaching methodologies, and holistic student development. We envision a future where every Vertex Academy graduate becomes a leader and positive change-maker in society.",
                color: "bg-gradient-to-br from-trust-builder to-brand-primary"
            },
            {
                icon: "HeartIcon",
                title: "Our Values",
                description: "Excellence in education, integrity in action, innovation in teaching, inclusivity in approach, and inspiration in outcomes. We believe in nurturing not just academic brilliance but also emotional intelligence, ethical values, and a lifelong love for learning.",
                color: "bg-gradient-to-br from-conversion-accent to-success"
            }],

        timeline: [
            {
                year: "2016",
                title: "Foundation Established",
                description: "Vertex Academy was founded as a unit of Thanga Ramachandran Educational Trust, beginning our journey of educational excellence in Sholinganallur.",
                icon: "FlagIcon"
            },
            {
                year: "2018",
                title: "Curriculum Innovation",
                description: "Introduced comprehensive teaching methodologies combining traditional wisdom with modern pedagogical approaches, setting new standards in education.",
                icon: "LightBulbIcon"
            },
            {
                year: "2020",
                title: "Digital Transformation",
                description: "Successfully transitioned to hybrid learning models, ensuring uninterrupted quality education during challenging times while maintaining our commitment to excellence.",
                icon: "ComputerDesktopIcon"
            },
            {
                year: "2022",
                title: "Expansion & Growth",
                description: "Expanded facilities and faculty strength, introducing specialized programs and achieving recognition as one of Chennai's leading educational institutions.",
                icon: "BuildingOffice2Icon"
            },
            {
                year: "2024",
                title: "Excellence Milestone",
                description: "Celebrated 95% success rate achievement, launched advanced learning programs, and received multiple awards for educational innovation and student outcomes.",
                icon: "TrophyIcon"
            },
            {
                year: "2025",
                title: "Future Forward",
                description: "Continuing our legacy of excellence with enhanced programs, state-of-the-art facilities, and unwavering commitment to shaping the leaders of tomorrow.",
                icon: "StarIcon"
            }],

        leaders: [
            {
                name: "Dr. Ramesh Kumar",
                position: "Principal & Academic Director",
                image: "https://img.rocket.new/generatedImages/rocket_gen_img_12b9c2bb3-1763293370864.png",
                imageAlt: "Professional headshot of middle-aged Indian man with grey hair in formal blue suit smiling confidently",
                bio: "With over 25 years of experience in educational leadership, Dr. Kumar brings a wealth of knowledge in curriculum development and academic excellence.",
                qualifications: [
                    "Ph.D. in Educational Leadership, University of Madras",
                    "M.Ed. in Curriculum & Instruction",
                    "B.Ed. with First Class Honors"],

                expertise: ["Curriculum Design", "Academic Strategy", "Educational Leadership", "Student Development"]
            },
            {
                name: "Mrs. Priya Sharma",
                position: "Vice Principal & Head of Academics",
                image: "https://img.rocket.new/generatedImages/rocket_gen_img_150f92757-1763295812976.png",
                imageAlt: "Professional portrait of Indian woman in her forties wearing maroon blazer with warm smile in office setting",
                bio: "Mrs. Sharma specializes in innovative teaching methodologies and has been instrumental in achieving our exceptional success rates.",
                qualifications: [
                    "M.Ed. in Educational Psychology",
                    "B.Ed. with Gold Medal",
                    "Advanced Diploma in Child Psychology"],

                expertise: ["Teaching Innovation", "Student Psychology", "Academic Counseling", "Performance Analysis"]
            },
            {
                name: "Mr. Arun Krishnan",
                position: "Head of Student Development",
                image: "https://img.rocket.new/generatedImages/rocket_gen_img_1517d7869-1763294003686.png",
                imageAlt: "Young Indian professional man in navy blue shirt with friendly expression in modern office environment",
                bio: "Mr. Krishnan focuses on holistic student development, ensuring every child receives personalized attention and support for overall growth.",
                qualifications: [
                    "M.A. in Educational Management",
                    "B.Ed. in Special Education",
                    "Certified Career Counselor"],

                expertise: ["Student Mentoring", "Career Guidance", "Personality Development", "Parent Engagement"]
            }],

        achievements: [
            {
                icon: "UserGroupIcon",
                value: "2,500+",
                label: "Students Taught",
                description: "Successful learners across all programs"
            },
            {
                icon: "TrophyIcon",
                value: "95%",
                label: "Success Rate",
                description: "Consistent academic excellence"
            },
            {
                icon: "AcademicCapIcon",
                value: "50+",
                label: "Expert Faculty",
                description: "Qualified and experienced educators"
            },
            {
                icon: "StarIcon",
                value: "9 Years",
                label: "Excellence",
                description: "Trusted educational partner since 2016"
            }],

        testimonials: [
            {
                name: "Mrs. Lakshmi Venkatesh",
                role: "Parent of Class 10 Student",
                image: "https://img.rocket.new/generatedImages/rocket_gen_img_1bca604bb-1763300779044.png",
                imageAlt: "Indian woman in her late thirties wearing traditional saree with warm smile in home setting",
                content: "Vertex Academy has been a blessing for our daughter. The personalized attention and expert guidance helped her improve from 65% to 92% in just one year. The teachers genuinely care about each student\'s progress and work closely with parents. We couldn\'t have asked for a better educational partner.",
                rating: 5
            },
            {
                name: "Mr. Rajesh Patel",
                role: "Parent of Class 8 Student",
                image: "https://img.rocket.new/generatedImages/rocket_gen_img_138e07571-1763295086046.png",
                imageAlt: "Professional Indian businessman in his forties wearing grey suit with confident expression in office",
                content: "The transformation in my son's academic performance and confidence has been remarkable. The small batch sizes ensure individual attention, and the comprehensive curriculum covers everything needed for success. The faculty's dedication and the institution's values align perfectly with what we seek for our child's education.",
                rating: 5
            },
            {
                name: "Mrs. Divya Ramachandran",
                role: "Parent of Class 12 Student",
                image: "https://img.rocket.new/generatedImages/rocket_gen_img_119406736-1763299171415.png",
                imageAlt: "Young Indian professional woman in blue formal attire with friendly smile in modern workspace",
                content: "As we prepared for board exams, Vertex Academy's structured approach and expert teaching made all the difference. The regular assessments, doubt-clearing sessions, and motivational support helped our daughter secure 96% in her boards. The trust and legacy of Thanga Ramachandran Educational Trust truly reflects in the quality of education provided.",
                rating: 5
            }]

    };

    return (
        <main className="min-h-screen bg-background">
            <Header />
            <div className="pt-20">
                <AboutUsInteractive data={aboutUsData} />
            </div>
        </main>);

}