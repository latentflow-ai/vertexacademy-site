'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const timeSlots = [
  '9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM',
  '2:00 PM - 3:00 PM', '3:00 PM - 4:00 PM', '4:00 PM - 5:00 PM', '5:00 PM - 6:00 PM',
];
const programs = [
  'Primary Foundation (Classes 1-5)', 'Middle School Excellence (Classes 6-8)',
  'High School Mastery (Classes 9-10)', 'Competitive Exam Prep', 'Language Mastery',
  'Vedic Mathematics', 'Not Sure Yet',
];

const field =
  'w-full h-12 px-4 bg-surface border border-border rounded-lg text-navy placeholder:text-text-faint transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary';

const CampusVisitForm = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', studentName: '', studentAge: '',
    interestedProgram: '', preferredDate: '', preferredTime: '', additionalNotes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
        ? `${process.env.NEXT_PUBLIC_API_URL}/campus-visit`
        : 'http://localhost:5000/api/campus-visit';
      const submitData = {
        name: formData.name, email: formData.email, phone: formData.phone,
        preferredDate: formData.preferredDate, numberOfStudents: formData.studentName ? '1' : '0',
        message: formData.additionalNotes,
      };
      const response = await fetch(apiUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(submitData),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to submit campus visit request');
      }
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', studentName: '', studentAge: '', interestedProgram: '', preferredDate: '', preferredTime: '', additionalNotes: '' });
      setTimeout(() => setIsSubmitted(false), 4000);
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to submit your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]; };
  const getMaxDate = () => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split('T')[0]; };

  const Label = ({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) => (
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-navy mb-2">
      {children} {required && <span className="text-error">*</span>}
    </label>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Hero */}
      <div className="max-w-3xl mb-14">
        <p className="eyebrow mb-4">Campus Visit</p>
        <h1 className="font-display font-semibold text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.0] text-navy">
          Schedule your <span className="text-primary mark-gold">campus visit</span>
        </h1>
        <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mt-6 leading-relaxed">
          Experience our world-class facilities, meet our expert faculty, and discover why Vertex
          Academy is Chennai&apos;s leading premium learning destination.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-surface-2 rounded-2xl p-6 sm:p-10 shadow-soft border border-border">
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-elevation">
                  <Icon name="CheckBadgeIcon" size={40} className="text-white" variant="solid" />
                </div>
                <h2 className="font-display text-3xl text-navy mb-3">Visit scheduled successfully!</h2>
                <p className="text-text-secondary">We&apos;ve received your request. Our team will contact you shortly to confirm.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gold flex items-center justify-center">
                    <Icon name="CalendarDaysIcon" size={24} className="text-navy" variant="solid" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl text-navy">Book your visit</h2>
                    <p className="text-text-secondary text-sm">Fill in the details below</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="name" required>Parent/Guardian Name</Label>
                    <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className={field} placeholder="Enter your full name" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="email" required>Email Address</Label>
                      <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className={field} placeholder="your.email@example.com" autoComplete="email" />
                    </div>
                    <div>
                      <Label htmlFor="phone" required>Phone Number</Label>
                      <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange} className={field} placeholder="+91 98765 43210" autoComplete="tel" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="studentName" required>Student Name</Label>
                      <input type="text" id="studentName" name="studentName" required value={formData.studentName} onChange={handleChange} className={field} placeholder="Student's full name" />
                    </div>
                    <div>
                      <Label htmlFor="studentAge" required>Student Age</Label>
                      <input type="number" id="studentAge" name="studentAge" required min="6" max="18" value={formData.studentAge} onChange={handleChange} className={field} placeholder="Age" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="interestedProgram">Interested Program</Label>
                    <select id="interestedProgram" name="interestedProgram" value={formData.interestedProgram} onChange={handleChange} className={field}>
                      <option value="">Select a program</option>
                      {programs.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="preferredDate" required>Preferred Date</Label>
                      <input type="date" id="preferredDate" name="preferredDate" required min={getMinDate()} max={getMaxDate()} value={formData.preferredDate} onChange={handleChange} className={field} />
                    </div>
                    <div>
                      <Label htmlFor="preferredTime" required>Preferred Time</Label>
                      <select id="preferredTime" name="preferredTime" required value={formData.preferredTime} onChange={handleChange} className={field}>
                        <option value="">Select time slot</option>
                        {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="additionalNotes">Additional Notes</Label>
                    <textarea id="additionalNotes" name="additionalNotes" rows={4} value={formData.additionalNotes} onChange={handleChange} className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-navy placeholder:text-text-faint resize-none transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Any specific questions or requirements..." />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full min-h-[52px] rounded-full bg-primary text-primary-foreground font-semibold transition-smooth hover:bg-primary-strong hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2 shadow-blue">
                    {isSubmitting ? (
                      <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Scheduling...</span></>
                    ) : (
                      <><Icon name="CalendarDaysIcon" size={20} variant="solid" /><span>Schedule Visit</span></>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-navy rounded-2xl p-8 text-navy-foreground shadow-soft relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-primary/25 blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-6 relative">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Icon name="ClockIcon" size={24} className="text-gold" variant="solid" />
              </div>
              <h3 className="font-display text-xl">Visit Timings</h3>
            </div>
            <div className="space-y-4 relative">
              <div><p className="text-gold font-semibold mb-1">Monday – Friday</p><p className="text-navy-foreground/80">9:00 AM – 6:00 PM</p></div>
              <div><p className="text-gold font-semibold mb-1">Saturday</p><p className="text-navy-foreground/80">9:00 AM – 2:00 PM</p></div>
              <div><p className="text-gold font-semibold mb-1">Sunday</p><p className="text-navy-foreground/80">Closed</p></div>
            </div>
          </div>

          <div className="bg-surface-2 rounded-2xl p-8 border border-border shadow-subtle">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-green-tint flex items-center justify-center">
                <Icon name="SparklesIcon" size={24} className="text-green" variant="solid" />
              </div>
              <h3 className="font-display text-xl text-navy">What to Expect</h3>
            </div>
            <ul className="space-y-3 text-text-secondary">
              {['Campus tour of facilities', 'Meet with expert faculty', 'Program consultation', 'Admission guidance'].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <Icon name="CheckBadgeIcon" size={20} className="text-green flex-shrink-0 mt-0.5" variant="solid" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gold-tint rounded-2xl p-8 border border-gold/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gold flex items-center justify-center">
                <Icon name="PhoneIcon" size={24} className="text-navy" variant="solid" />
              </div>
              <h3 className="font-display text-xl text-navy">Need Help?</h3>
            </div>
            <div className="space-y-3 text-text-secondary">
              <p className="flex items-center gap-2">
                <Icon name="PhoneIcon" size={18} className="text-gold-strong" variant="solid" />
                <a href="tel:+919876543210" className="hover:text-navy transition-colors">+91 98765 43210</a>
              </p>
              <p className="flex items-center gap-2">
                <Icon name="EnvelopeIcon" size={18} className="text-gold-strong" variant="solid" />
                <a href="mailto:info@vertexacademy.com" className="hover:text-navy transition-colors break-all">info@vertexacademy.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusVisitForm;
