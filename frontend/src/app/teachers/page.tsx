import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import TeachersInteractive from './components/TeachersInteractive';

export const metadata: Metadata = {
    title: 'Expert Teachers - Vertex Academy',
    description: 'Meet our distinguished faculty of 25+ expert teachers with 15+ years average experience, 100% qualified educators, and proven 95% student success rate. Learn from Chennai\'s finest educators dedicated to academic excellence.',
};

export default function TeachersPage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />
            <div className="pt-20">
                <TeachersInteractive />
            </div>
            <Footer />
        </main>
    );
}