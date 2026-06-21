'use client';

import Icon from '@/components/ui/AppIcon';
import { useChat } from '@/context/ChatContext';

interface QuickLink {
    icon: string;
    title: string;
    description: string;
    action: string;
    href?: string;
    onClick?: () => void;
}

interface QuickLinksProps {
    isDark: boolean;
}

const QuickLinks = ({ isDark }: QuickLinksProps) => {
    const { openChat } = useChat();

    const quickLinks: QuickLink[] = [
        {
            icon: 'CalendarIcon',
            title: 'Schedule a Campus Visit',
            description: 'Book a personalized tour of our facilities and meet our faculty',
            action: 'Book Tour',
            href: '/campus-visit'
        },
        {
            icon: 'ChatBubbleLeftRightIcon',
            title: 'Chat with us',
            description: 'Get instant answers to your questions from our AI assistant',
            action: 'Start Chat',
            onClick: () => openChat()
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {quickLinks.map((link, index) => (
                <div
                    key={index}
                    className={`p-6 rounded-xl border transition-all duration-smooth hover-lift ${isDark
                            ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                        }`}
                >
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-xl bg-green-tint flex items-center justify-center">
                                <Icon name={link.icon} size={24} className="text-green" variant="solid" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3
                                className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-text-primary'
                                    }`}
                            >
                                {link.title}
                            </h3>
                            <p
                                className={`text-sm mb-4 ${isDark ? 'text-slate-300' : 'text-text-secondary'
                                    }`}
                            >
                                {link.description}
                            </p>
                            {link.href ? (
                                <a
                                    href={link.href}
                                    className="inline-flex items-center text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors duration-quick"
                                >
                                    {link.action}
                                    <Icon name="ArrowRightIcon" size={16} className="ml-1" />
                                </a>
                            ) : (
                                <button
                                    onClick={link.onClick}
                                    className="inline-flex items-center text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors duration-quick cursor-pointer"
                                >
                                    {link.action}
                                    <Icon name="ArrowRightIcon" size={16} className="ml-1" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default QuickLinks;