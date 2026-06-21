import Icon from '@/components/ui/AppIcon';

interface ContactInfoItem {
    icon: string;
    title: string;
    details: string[];
    action?: {
        label: string;
        href: string;
    };
}

interface ContactInfoProps {
    isDark: boolean;
}

const ContactInfo = ({ isDark }: ContactInfoProps) => {
    const contactItems: ContactInfoItem[] = [
        {
            icon: 'MapPinIcon',
            title: 'Visit Us',
            details: [
                'Vertex Academy',
                'New No.22, Old No.66, Anna Street',
                'Thiruvanmiyur, Chennai - 600041',
                'Tamil Nadu, India'
            ],
            action: {
                label: 'Get Directions',
                href: 'https://www.google.com/maps?q=12.9866858,80.2626738'
            }
        },
        {
            icon: 'PhoneIcon',
            title: 'Call Us',
            details: [
                '+91 98765 43210',
                '+91 98765 43211',
                'Mon - Sat: 9:00 AM - 7:00 PM',
                'Sunday: Closed'
            ],
            action: {
                label: 'Call Now',
                href: 'tel:+919876543210'
            }
        },
        {
            icon: 'EnvelopeIcon',
            title: 'Email Us',
            details: [
                'admissions@vertexacademy.edu.in',
                'info@vertexacademy.edu.in',
                'Response within 24 hours',
                'Available 24/7'
            ],
            action: {
                label: 'Send Email',
                href: 'mailto:admissions@vertexacademy.edu.in'
            }
        },
        {
            icon: 'ClockIcon',
            title: 'Operating Hours',
            details: [
                'Monday - Friday: 9:00 AM - 7:00 PM',
                'Saturday: 9:00 AM - 5:00 PM',
                'Sunday: Closed',
                'Holidays: As per schedule'
            ]
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactItems.map((item, index) => (
                <div
                    key={index}
                    className={`p-6 rounded-xl border transition-all duration-smooth hover-lift ${isDark
                            ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                        }`}
                >
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-xl bg-primary-tint flex items-center justify-center">
                                <Icon name={item.icon} size={24} className="text-primary" variant="solid" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3
                                className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-text-primary'
                                    }`}
                            >
                                {item.title}
                            </h3>
                            <div className="space-y-2">
                                {item.details.map((detail, idx) => (
                                    <p
                                        key={idx}
                                        className={`text-sm ${isDark ? 'text-slate-300' : 'text-text-secondary'
                                            }`}
                                    >
                                        {detail}
                                    </p>
                                ))}
                            </div>
                            {item.action && (
                                <a
                                    href={item.action.href}
                                    target={item.action.href.startsWith('http') ? '_blank' : undefined}
                                    rel={item.action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    className="inline-flex items-center mt-4 text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors duration-quick"
                                >
                                    {item.action.label}
                                    <Icon name="ArrowRightIcon" size={16} className="ml-1" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ContactInfo;