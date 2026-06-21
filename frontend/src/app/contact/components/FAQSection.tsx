'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FAQ {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    isDark: boolean;
}

const FAQSection = ({ isDark }: FAQSectionProps) => {
    const [isHydrated, setIsHydrated] = useState(false);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const faqs: FAQ[] = [
        {
            question: 'What are the admission requirements?',
            answer: 'We accept students from Classes 6-12. Admission is based on a brief assessment to understand the student\'s current academic level and learning needs. No entrance exam is required. We focus on creating personalized learning paths for each student.'
        },
        {
            question: 'What is your batch size and student-teacher ratio?',
            answer: 'We maintain small batch sizes of maximum 15 students per class to ensure personalized attention. Our student-teacher ratio of 15:1 allows our faculty to focus on individual learning needs and provide customized support.'
        },
        {
            question: 'Do you offer trial classes?',
            answer: 'Yes, we offer a complimentary trial class for new students. This allows students to experience our teaching methodology and interact with our faculty before enrollment. Parents can also observe the class to understand our approach.'
        },
        {
            question: 'What is the fee structure and payment schedule?',
            answer: 'Our fee structure varies by program and grade level. We offer flexible payment options including monthly, quarterly, and annual plans. Detailed fee information will be provided during the consultation. We also offer sibling discounts and early bird offers.'
        },
        {
            question: 'Are there any additional charges apart from tuition fees?',
            answer: 'The tuition fee covers all regular classes, study materials, and assessments. Additional charges may apply for special workshops, competitive exam preparation materials, and optional enrichment programs. All charges are communicated transparently upfront.'
        },
        {
            question: 'What safety measures do you have in place?',
            answer: 'Student safety is our top priority. We have CCTV surveillance, secure entry/exit protocols, and trained staff. Parents receive regular updates about their child\'s attendance and progress. We also maintain comprehensive insurance coverage for all students.'
        }
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    if (!isHydrated) {
        return (
            <div className={`p-8 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                }`}>
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-slate-300 rounded w-1/2"></div>
                    <div className="h-4 bg-slate-300 rounded w-full"></div>
                    <div className="h-4 bg-slate-300 rounded w-full"></div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`p-8 rounded-xl border transition-all duration-smooth ${isDark
                    ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                }`}
        >
            <div className="mb-6">
                <h2
                    className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-text-primary'
                        }`}
                >
                    Frequently Asked Questions
                </h2>
                <p
                    className={`text-sm ${isDark ? 'text-slate-300' : 'text-text-secondary'
                        }`}
                >
                    Find answers to common questions about enrollment, programs, and policies
                </p>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className={`border rounded-lg overflow-hidden transition-all duration-smooth ${isDark ? 'border-slate-700' : 'border-slate-200'
                            }`}
                    >
                        <button
                            onClick={() => toggleFAQ(index)}
                            className={`w-full px-6 py-4 flex items-center justify-between text-left transition-colors duration-quick ${isDark
                                    ? 'hover:bg-slate-700' : 'hover:bg-slate-50'
                                }`}
                        >
                            <span
                                className={`font-semibold ${isDark ? 'text-white' : 'text-text-primary'
                                    }`}
                            >
                                {faq.question}
                            </span>
                            <Icon
                                name="ChevronDownIcon"
                                size={20}
                                className={`flex-shrink-0 ml-4 transition-transform duration-smooth ${openIndex === index ? 'rotate-180' : ''
                                    } ${isDark ? 'text-slate-400' : 'text-text-secondary'}`}
                            />
                        </button>
                        {openIndex === index && (
                            <div
                                className={`px-6 py-4 border-t ${isDark
                                        ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-slate-50'
                                    }`}
                            >
                                <p
                                    className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-text-secondary'
                                        }`}
                                >
                                    {faq.answer}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div
                className={`mt-6 p-4 rounded-lg border ${isDark
                        ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
            >
                <p
                    className={`text-sm ${isDark ? 'text-slate-300' : 'text-text-secondary'
                        }`}
                >
                    Can't find what you're looking for?{' '}
                    <a
                        href="mailto:info@vertexacademy.edu.in"
                        className="font-medium text-brand-primary hover:text-brand-secondary transition-colors duration-quick"
                    >
                        Contact our support team
                    </a>{' '}
                    or chat with us for instant assistance.
                </p>
            </div>
        </div>
    );
};

export default FAQSection;