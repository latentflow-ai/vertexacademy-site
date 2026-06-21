import CTABand from '@/components/common/CTABand';

const CTASection = () => {
  return (
    <CTABand
      eyebrow="Join Our Community"
      title="Ready to join our community?"
      highlight="community?"
      text="Experience the Vertex Academy difference. Enroll today and give your child the gift of excellence in education."
      primary={{ label: 'Enroll Now', href: '/contact', icon: 'ArrowRightIcon' }}
      secondary={{ label: 'View Programs', href: '/programs', icon: 'AcademicCapIcon' }}
    />
  );
};

export default CTASection;
