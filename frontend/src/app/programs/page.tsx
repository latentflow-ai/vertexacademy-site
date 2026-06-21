import type { Metadata, Viewport } from 'next';
import Header from '@/components/common/Header';
import dynamic from 'next/dynamic';

const ProgramsInteractive = dynamic(() => import('./components/ProgramsInteractive'), { ssr: false });

export const metadata: Metadata = {
    title: 'Academic Programs - Vertex Academy',
    description: 'Explore comprehensive academic programs at Vertex Academy for students aged 6-15. Small batch sizes, personalized attention, and 95% success rates across all courses in Sholinganallur, Chennai.'
};

export const viewport: Viewport = {
    themeColor: '#0f172a',
};

export default function ProgramsPage() {
    const programs = [
        {
            id: 'primary-foundation',
            title: 'Primary Foundation',
            subtitle: 'Classes 1-5',
            description: 'Building strong fundamentals in Mathematics, Science, and English with interactive learning methods and concept-based teaching approach.',
            image: "https://images.unsplash.com/photo-1662946979416-697d1116691f",
            alt: 'Young elementary school students sitting at desks with colorful books and learning materials in bright classroom',
            ageGroup: '6-10 years',
            batchSize: '8-10 students',
            duration: '12 months',
            successRate: '96%',
            gradient: 'from-blue-600/80 to-purple-600/80',
            features: [
                { icon: 'BookOpenIcon', text: 'Concept-based learning with visual aids' },
                { icon: 'PuzzlePieceIcon', text: 'Activity-based teaching methodology' },
                { icon: 'UserGroupIcon', text: 'Small batch size for individual attention' },
                { icon: 'ClipboardDocumentCheckIcon', text: 'Regular assessments and progress tracking' },
                { icon: 'ChatBubbleLeftRightIcon', text: 'Parent-teacher meetings every month' }],

            curriculum: ['Mathematics', 'Science', 'English', 'EVS', 'Mental Math', 'Creative Writing']
        },
        {
            id: 'middle-school-excellence',
            title: 'Middle School Excellence',
            subtitle: 'Classes 6-8',
            description: 'Comprehensive curriculum covering advanced concepts in Mathematics, Science, and Social Studies with exam-oriented preparation and skill development.',
            image: "https://images.unsplash.com/photo-1731067356461-9eb417cce8dd",
            alt: 'Middle school students in blue uniforms working together on science project with microscope in modern laboratory',
            ageGroup: '11-13 years',
            batchSize: '10-12 students',
            duration: '12 months',
            successRate: '95%',
            gradient: 'from-green-600/80 to-teal-600/80',
            features: [
                { icon: 'AcademicCapIcon', text: 'Board exam pattern preparation' },
                { icon: 'BeakerIcon', text: 'Practical-oriented science learning' },
                { icon: 'CalculatorIcon', text: 'Advanced problem-solving techniques' },
                { icon: 'DocumentTextIcon', text: 'Comprehensive study materials included' },
                { icon: 'ChartBarIcon', text: 'Weekly tests and performance analysis' }],

            curriculum: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Social Science', 'English Grammar']
        },
        {
            id: 'high-school-mastery',
            title: 'High School Mastery',
            subtitle: 'Classes 9-10',
            description: 'Intensive board exam preparation with focus on conceptual clarity, problem-solving skills, and time management for achieving excellence in board examinations.',
            image: "https://images.unsplash.com/photo-1625111381887-458fce74a923",
            alt: 'High school students in formal attire studying together with textbooks and laptops in well-lit study room',
            ageGroup: '14-15 years',
            batchSize: '12-15 students',
            duration: '12 months',
            successRate: '97%',
            gradient: 'from-orange-600/80 to-red-600/80',
            features: [
                { icon: 'TrophyIcon', text: 'Board exam focused curriculum' },
                { icon: 'ClockIcon', text: 'Time management and exam strategies' },
                { icon: 'LightBulbIcon', text: 'Concept clarity with doubt sessions' },
                { icon: 'DocumentChartBarIcon', text: 'Mock tests and sample papers' },
                { icon: 'UserCircleIcon', text: 'One-on-one mentoring sessions' }],

            curriculum: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Social Science', 'English Literature']
        },
        {
            id: 'competitive-exam-prep',
            title: 'Competitive Exam Prep',
            subtitle: 'NTSE, Olympiads & More',
            description: 'Specialized training for competitive examinations including NTSE, Science Olympiad, Math Olympiad with advanced problem-solving and analytical thinking.',
            image: "https://images.unsplash.com/photo-1612356573916-0c4273ef84f4",
            alt: 'Focused teenage student writing competitive exam with concentration in examination hall with other students',
            ageGroup: '12-15 years',
            batchSize: '8-10 students',
            duration: '6-12 months',
            successRate: '92%',
            gradient: 'from-purple-600/80 to-pink-600/80',
            features: [
                { icon: 'FireIcon', text: 'Advanced level problem solving' },
                { icon: 'CpuChipIcon', text: 'Logical reasoning and aptitude' },
                { icon: 'RocketLaunchIcon', text: 'Fast-track learning techniques' },
                { icon: 'PresentationChartLineIcon', text: 'Previous year papers practice' },
                { icon: 'StarIcon', text: 'Scholarship guidance and support' }],

            curriculum: ['Advanced Math', 'Science Reasoning', 'Mental Ability', 'Logical Thinking', 'General Knowledge']
        },
        {
            id: 'language-mastery',
            title: 'Language Mastery',
            subtitle: 'English & Communication',
            description: 'Comprehensive English language program focusing on grammar, vocabulary, reading comprehension, creative writing, and effective communication skills.',
            image: "https://images.unsplash.com/photo-1641556287041-dd16396a2a33",
            alt: 'Young students reading colorful English storybooks together in cozy library corner with bookshelves',
            ageGroup: '8-15 years',
            batchSize: '10-12 students',
            duration: '12 months',
            successRate: '94%',
            gradient: 'from-indigo-600/80 to-blue-600/80',
            features: [
                { icon: 'ChatBubbleBottomCenterTextIcon', text: 'Speaking and presentation skills' },
                { icon: 'PencilSquareIcon', text: 'Creative writing workshops' },
                { icon: 'BookmarkIcon', text: 'Reading comprehension techniques' },
                { icon: 'LanguageIcon', text: 'Grammar and vocabulary building' },
                { icon: 'MicrophoneIcon', text: 'Public speaking practice sessions' }],

            curriculum: ['Grammar', 'Vocabulary', 'Reading', 'Writing', 'Speaking', 'Literature']
        },
        {
            id: 'vedic-mathematics',
            title: 'Vedic Mathematics',
            subtitle: 'Speed Math Techniques',
            description: 'Ancient Indian mathematical techniques for fast calculations, mental math, and problem-solving with fun and engaging learning methods.',
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_13a782a4d-1764286088998.png",
            alt: 'Children practicing mental math calculations on whiteboard with colorful numbers and mathematical symbols',
            ageGroup: '8-14 years',
            batchSize: '8-10 students',
            duration: '6 months',
            successRate: '98%',
            gradient: 'from-amber-600/80 to-orange-600/80',
            features: [
                { icon: 'BoltIcon', text: 'Lightning-fast calculation methods' },
                { icon: 'CubeIcon', text: 'Pattern recognition techniques' },
                { icon: 'SparklesIcon', text: 'Mental math mastery' },
                { icon: 'PuzzlePieceIcon', text: 'Fun mathematical tricks' },
                { icon: 'TrophyIcon', text: 'Competition preparation' }],

            curriculum: ['Speed Multiplication', 'Division Shortcuts', 'Square Roots', 'Algebra Tricks', 'Mental Calculations']
        }];


    const features = [
        {
            icon: 'UserGroupIcon',
            title: 'Small Batch Sizes',
            description: 'Maximum 8-15 students per batch ensuring personalized attention and customized learning pace for every student.',
            color: 'from-blue-600 to-blue-700'
        },
        {
            icon: 'AcademicCapIcon',
            title: 'Expert Faculty',
            description: 'Highly qualified teachers with 10+ years of experience and proven track record in academic excellence.',
            color: 'from-green-600 to-green-700'
        },
        {
            icon: 'ClipboardDocumentCheckIcon',
            title: 'Regular Assessments',
            description: 'Weekly tests, monthly evaluations, and detailed progress reports to track student performance effectively.',
            color: 'from-purple-600 to-purple-700'
        },
        {
            icon: 'BookOpenIcon',
            title: 'Comprehensive Materials',
            description: 'Well-researched study materials, practice worksheets, and reference books included in the program fee.',
            color: 'from-orange-600 to-orange-700'
        },
        {
            icon: 'ChatBubbleLeftRightIcon',
            title: 'Doubt Clearing Sessions',
            description: 'Dedicated doubt clearing sessions after every class and one-on-one mentoring for challenging topics.',
            color: 'from-red-600 to-red-700'
        },
        {
            icon: 'DevicePhoneMobileIcon',
            title: 'Parent Communication',
            description: 'Regular updates via WhatsApp, monthly parent-teacher meetings, and transparent progress tracking system.',
            color: 'from-indigo-600 to-indigo-700'
        },
        {
            icon: 'TrophyIcon',
            title: '95% Success Rate',
            description: 'Proven track record with 95% students achieving distinction and excellence in their examinations.',
            color: 'from-amber-600 to-amber-700'
        },
        {
            icon: 'BuildingLibraryIcon',
            title: 'Modern Infrastructure',
            description: 'Air-conditioned classrooms, digital learning tools, and well-equipped library for enhanced learning experience.',
            color: 'from-teal-600 to-teal-700'
        }];

    const batches = [
        {
            id: 'batch-1',
            program: 'Primary Foundation',
            day: 'Monday',
            time: '4:00 PM - 5:30 PM',
            availableSeats: 3,
            totalSeats: 10,
            instructor: 'Mrs. Priya Sharma',
            status: 'filling-fast' as const
        },
        {
            id: 'batch-2',
            program: 'Primary Foundation',
            day: 'Wednesday',
            time: '5:30 PM - 7:00 PM',
            availableSeats: 6,
            totalSeats: 10,
            instructor: 'Mr. Rajesh Kumar',
            status: 'available' as const
        },
        {
            id: 'batch-3',
            program: 'Middle School Excellence',
            day: 'Tuesday',
            time: '4:00 PM - 6:00 PM',
            availableSeats: 0,
            totalSeats: 12,
            instructor: 'Dr. Anita Desai',
            status: 'full' as const
        },
        {
            id: 'batch-4',
            program: 'Middle School Excellence',
            day: 'Thursday',
            time: '5:00 PM - 7:00 PM',
            availableSeats: 8,
            totalSeats: 12,
            instructor: 'Mr. Suresh Menon',
            status: 'available' as const
        },
        {
            id: 'batch-5',
            program: 'High School Mastery',
            day: 'Monday',
            time: '6:00 PM - 8:00 PM',
            availableSeats: 2,
            totalSeats: 15,
            instructor: 'Prof. Lakshmi Iyer',
            status: 'filling-fast' as const
        },
        {
            id: 'batch-6',
            program: 'High School Mastery',
            day: 'Saturday',
            time: '9:00 AM - 11:00 AM',
            availableSeats: 10,
            totalSeats: 15,
            instructor: 'Dr. Venkat Raman',
            status: 'available' as const
        },
        {
            id: 'batch-7',
            program: 'Competitive Exam Prep',
            day: 'Sunday',
            time: '10:00 AM - 12:00 PM',
            availableSeats: 4,
            totalSeats: 10,
            instructor: 'Mr. Arun Krishnan',
            status: 'available' as const
        },
        {
            id: 'batch-8',
            program: 'Language Mastery',
            day: 'Friday',
            time: '4:30 PM - 6:00 PM',
            availableSeats: 7,
            totalSeats: 12,
            instructor: 'Ms. Sarah Thomas',
            status: 'available' as const
        },
        {
            id: 'batch-9',
            program: 'Vedic Mathematics',
            day: 'Saturday',
            time: '2:00 PM - 3:30 PM',
            availableSeats: 1,
            totalSeats: 10,
            instructor: 'Mr. Ganesh Pillai',
            status: 'filling-fast' as const
        }];

    return (
        <main className="min-h-screen bg-background">
            <Header />
            <div className="pt-20">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-background">
                    {/* faint warm grid texture */}
                    <div
                        className="absolute inset-0 opacity-[0.04] pointer-events-none"
                        style={{
                            backgroundImage:
                                'linear-gradient(to right, #17302c 1px, transparent 1px), linear-gradient(to bottom, #17302c 1px, transparent 1px)',
                            backgroundSize: '72px 72px',
                            maskImage: 'radial-gradient(ellipse 80% 70% at 50% 10%, black, transparent)',
                            WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 10%, black, transparent)',
                        }}
                    />
                    <div className="container mx-auto px-4 sm:px-6 relative z-10">
                        <div className="max-w-3xl mx-auto text-center pt-16 pb-12 sm:pt-24 sm:pb-16">
                            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-surface-2 border border-border rounded-full mb-6 shadow-sm">
                                <span className="relative flex w-2 h-2">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60 animate-ping" />
                                    <span className="relative inline-flex rounded-full w-2 h-2 bg-success" />
                                </span>
                                <span className="text-xs font-semibold tracking-[0.12em] uppercase text-text-secondary">
                                    Excellence Since 2016
                                </span>
                            </span>
                            <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.04] tracking-[-0.02em] text-navy mb-6">
                                Academic programs for{' '}
                                <span className="text-primary mark-gold">every student</span>
                            </h1>
                            <p className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
                                Comprehensive learning solutions with personalized attention, expert faculty,
                                and proven success rates. Join 500+ students who have achieved academic
                                excellence with Vertex Academy.
                            </p>
                        </div>
                    </div>
                </section>

                <ProgramsInteractive
                    programs={programs}
                    features={features}
                    batches={batches} />
            </div>
        </main>);

}