import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import CTABand from '@/components/common/CTABand';
import dynamic from 'next/dynamic';

const GalleryInteractive = dynamic(() => import('./components/GalleryInteractive'), { ssr: false });

export const metadata: Metadata = {
    title: 'Gallery - Vertex Academy',
    description: 'Explore our vibrant learning environment through photos of student achievements, classroom moments, state-of-the-art facilities, and memorable events at Vertex Academy.'
};

interface GalleryImage {
    id: number;
    src: string;
    alt: string;
    category: string;
    title: string;
}

interface StatItem {
    icon: string;
    value: string;
    label: string;
}

export default function GalleryPage() {
    const categories: string[] = [
        'All',
        'Classrooms',
        'Achievements',
        'Facilities',
        'Events'];


    const stats: StatItem[] = [
        {
            icon: 'PhotoIcon',
            value: '500+',
            label: 'Gallery Images'
        },
        {
            icon: 'TrophyIcon',
            value: '150+',
            label: 'Achievements'
        },
        {
            icon: 'BuildingOfficeIcon',
            value: '12',
            label: 'Modern Facilities'
        },
        {
            icon: 'CalendarIcon',
            value: '50+',
            label: 'Annual Events'
        }];


    const galleryImages: GalleryImage[] = [
        // Classrooms
        {
            id: 1,
            src: "https://images.unsplash.com/photo-1720207757970-98d762112295",
            alt: 'Modern classroom with wooden desks, ergonomic chairs, and large windows providing natural lighting',
            category: 'Classrooms',
            title: 'Interactive Learning Space'
        },
        {
            id: 2,
            src: "https://images.unsplash.com/photo-1626541905824-17773cda09d3",
            alt: 'Students sitting at desks with laptops and notebooks during an engaging classroom session',
            category: 'Classrooms',
            title: 'Digital Learning Environment'
        },
        {
            id: 3,
            src: "https://images.unsplash.com/photo-1581726707445-75cbe4efc586",
            alt: 'Teacher standing at whiteboard explaining concepts to attentive students in bright classroom',
            category: 'Classrooms',
            title: 'Expert-Led Sessions'
        },
        {
            id: 4,
            src: "https://images.unsplash.com/photo-1565350831386-8c52421af9fa",
            alt: 'Small group of students collaborating around table with books and study materials',
            category: 'Classrooms',
            title: 'Small Batch Learning'
        },
        {
            id: 5,
            src: "https://images.unsplash.com/photo-1653566031587-114b636e182b",
            alt: 'Students working together on laptops in modern collaborative workspace with natural light',
            category: 'Classrooms',
            title: 'Collaborative Study Area'
        },

        // Achievements
        {
            id: 6,
            src: "https://images.unsplash.com/photo-1612993802433-c33c01d75bcd",
            alt: 'Graduate student in black cap and gown holding diploma with proud smile outdoors',
            category: 'Achievements',
            title: 'Academic Excellence'
        },
        {
            id: 7,
            src: "https://images.unsplash.com/photo-1720299580598-b379d782e785",
            alt: 'Young student holding golden trophy with excited expression and raised arms celebrating victory',
            category: 'Achievements',
            title: 'Competition Winner'
        },
        {
            id: 8,
            src: "https://images.unsplash.com/photo-1709569740962-5ce13f19b840",
            alt: 'Group of students in formal attire celebrating with certificates and medals at award ceremony',
            category: 'Achievements',
            title: 'Award Ceremony'
        },
        {
            id: 9,
            src: "https://images.unsplash.com/photo-1648046757585-e26cba9219e6",
            alt: 'Student presenting project on large screen to audience in modern auditorium setting',
            category: 'Achievements',
            title: 'Project Presentation'
        },
        {
            id: 10,
            src: "https://img.rocket.new/generatedImages/rocket_gen_img_1ce13c9d6-1764286086551.png",
            alt: 'Student writing on notebook with excellent grade marked in red showing academic success',
            category: 'Achievements',
            title: 'Top Scorer Recognition'
        },

        // Facilities
        {
            id: 11,
            src: "https://images.unsplash.com/photo-1593101456645-1b5e06f86993",
            alt: 'Modern library interior with tall bookshelves, reading tables, and comfortable seating areas',
            category: 'Facilities',
            title: 'Resource Library'
        },
        {
            id: 12,
            src: "https://images.unsplash.com/photo-1484503493006-e3872470f74a",
            alt: 'Science laboratory with microscopes, test tubes, and modern equipment on clean white counters',
            category: 'Facilities',
            title: 'Science Laboratory'
        },
        {
            id: 13,
            src: "https://images.unsplash.com/photo-1459231681433-c225cb3595ee",
            alt: 'Computer lab with rows of modern desktop computers and ergonomic chairs in air-conditioned room',
            category: 'Facilities',
            title: 'Computer Lab'
        },
        {
            id: 14,
            src: "https://images.unsplash.com/photo-1733397315165-dca1ba4927ae",
            alt: 'Spacious conference room with large table, comfortable chairs, and presentation screen',
            category: 'Facilities',
            title: 'Conference Hall'
        },
        {
            id: 15,
            src: "https://images.unsplash.com/photo-1672985021463-10dff20cae39",
            alt: 'Modern office reception area with comfortable seating, plants, and welcoming atmosphere',
            category: 'Facilities',
            title: 'Reception Area'
        },
        {
            id: 16,
            src: "https://images.unsplash.com/photo-1671622229879-74befdbe2705",
            alt: 'Bright cafeteria with modern furniture, large windows, and clean dining space',
            category: 'Facilities',
            title: 'Student Cafeteria'
        },

        // Events
        {
            id: 17,
            src: "https://images.unsplash.com/photo-1730134322176-862f1cf9bc9f",
            alt: 'Large audience seated in auditorium watching presentation on stage during annual day celebration',
            category: 'Events',
            title: 'Annual Day Celebration'
        },
        {
            id: 18,
            src: "https://images.unsplash.com/photo-1731067356461-9eb417cce8dd",
            alt: 'Students participating in science fair with colorful project displays and interactive demonstrations',
            category: 'Events',
            title: 'Science Fair'
        },
        {
            id: 19,
            src: "https://images.unsplash.com/photo-1713367875982-8346ab7db99a",
            alt: 'Students engaged in outdoor sports day activities with colorful banners and enthusiastic participation',
            category: 'Events',
            title: 'Sports Day'
        },
        {
            id: 20,
            src: "https://images.unsplash.com/photo-1571641337065-fabb8c3afbc1",
            alt: 'Cultural program with students performing traditional dance on decorated stage with lighting',
            category: 'Events',
            title: 'Cultural Program'
        },
        {
            id: 21,
            src: "https://img.rocket.new/generatedImages/rocket_gen_img_10e761f7d-1764286086887.png",
            alt: 'Parent-teacher meeting in progress with adults discussing student progress around conference table',
            category: 'Events',
            title: 'Parent-Teacher Meet'
        },
        {
            id: 22,
            src: "https://images.unsplash.com/photo-1704455312325-c0c5fdddc609",
            alt: 'Workshop session with expert speaker presenting to engaged audience in modern seminar hall',
            category: 'Events',
            title: 'Educational Workshop'
        },
        {
            id: 23,
            src: "https://images.unsplash.com/photo-1733835085968-d586d44a31da",
            alt: 'Graduation ceremony with students in caps and gowns celebrating their academic achievements',
            category: 'Events',
            title: 'Graduation Ceremony'
        },
        {
            id: 24,
            src: "https://img.rocket.new/generatedImages/rocket_gen_img_12336fcf0-1764286086887.png",
            alt: 'Field trip with students exploring outdoor educational site with teacher guidance',
            category: 'Events',
            title: 'Educational Field Trip'
        }];


    return (
        <main className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-navy text-navy-foreground pt-20">
                <div className="absolute -top-20 right-10 w-72 h-72 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full bg-green/20 blur-3xl pointer-events-none" />
                <div
                    className="absolute inset-0 opacity-[0.06] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '34px 34px' }}
                />
                <div className="container mx-auto px-4 sm:px-6 relative z-10">
                    <div className="max-w-3xl py-20 sm:py-28">
                        <p className="eyebrow !text-gold mb-4">Visual Journey</p>
                        <h1 className="font-display font-semibold text-[clamp(2.75rem,6.5vw,5rem)] leading-[1.0]">
                            Our <span className="text-gold">gallery</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-navy-foreground/75 max-w-2xl mt-6 leading-relaxed">
                            Witness the vibrant learning environment at Vertex Academy — memorable moments,
                            student achievements, and state-of-the-art facilities.
                        </p>
                    </div>
                </div>
            </section>

            {/* Gallery Content */}
            <GalleryInteractive images={galleryImages} categories={categories} stats={stats} />

            {/* CTA */}
            <CTABand
                eyebrow="See It For Yourself"
                title="Experience excellence firsthand"
                highlight="firsthand"
                text="Visit our campus to see our world-class facilities and meet our expert faculty. Schedule a tour today."
                primary={{ label: 'Schedule Campus Visit', href: '/campus-visit', icon: 'ArrowRightIcon' }}
                secondary={{ label: 'Contact Us', href: '/contact', icon: 'EnvelopeIcon' }}
            />

            <Footer />
        </main>);

}