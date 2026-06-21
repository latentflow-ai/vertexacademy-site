import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import CampusVisitForm from './components/CampusVisitForm';

export const metadata: Metadata = {
    title: 'Schedule Campus Visit - Vertex Academy',
    description: 'Schedule a personalized campus tour at Vertex Academy. Visit our state-of-the-art facilities, meet our expert faculty, and experience excellence in education firsthand.',
};

export default function CampusVisitPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-background pt-20">
                <CampusVisitForm />
            </main>
            <Footer />
        </>
    );
}
