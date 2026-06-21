import type { Metadata, Viewport } from 'next';
import Header from '@/components/common/Header';
import dynamic from 'next/dynamic';

const HomepageInteractive = dynamic(() => import('./components/HomepageInteractive'), { ssr: false });

export const metadata: Metadata = {
    title: 'Homepage - Vertex Academy',
    description: 'Chennai\'s leading premium learning destination offering excellence in education since 2016. Join 2,000+ students with 95% success rate and personalized attention.',
};

export const viewport: Viewport = {
    themeColor: '#0f172a',
};

export default function Homepage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />
            <div className="pt-20">
                <HomepageInteractive />
            </div>
        </main>
    );
}