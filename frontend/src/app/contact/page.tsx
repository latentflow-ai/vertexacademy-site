import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import dynamic from 'next/dynamic';

const ContactInteractive = dynamic(() => import('./components/ContactInteractive'), { ssr: false });

export const metadata: Metadata = {
    title: 'Contact Us - Vertex Academy',
    description: 'Get in touch with Vertex Academy for enrollment inquiries, campus visits, and admissions information. Located in Sholinganallur, Chennai. Contact us at +91 98765 43210 or admissions@vertexacademy.edu.in for personalized guidance.',
};

export default function ContactPage() {
    return (
        <>
            <Header />
            <ContactInteractive />
        </>
    );
}