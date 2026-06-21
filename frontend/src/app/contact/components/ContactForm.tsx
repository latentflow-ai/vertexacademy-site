'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  studentName: string;
  grade: string;
  program: string;
  preferredDate: string;
  message: string;
}
interface FormErrors {
  [key: string]: string;
}
interface ContactFormProps {
  isDark?: boolean;
}

const programs = [
  'Foundation Course (Classes 6-8)',
  'Advanced Course (Classes 9-10)',
  'Board Preparation (Classes 11-12)',
  'Competitive Exam Preparation',
  'Subject-Specific Tutoring',
  'Crash Course Programs',
];
const grades = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

const fieldBase =
  'w-full h-12 px-4 rounded-lg border bg-surface text-navy placeholder:text-text-faint transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary';

const ContactForm = (_: ContactFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '', email: '', phone: '', studentName: '', grade: '', program: '', preferredDate: '', message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = (): boolean => {
    const e: FormErrors = {};
    if (!formData.fullName.trim()) e.fullName = 'Parent/Guardian name is required';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Please enter a valid email address';
    if (!formData.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, ''))) e.phone = 'Please enter a valid 10-digit Indian mobile number';
    if (!formData.studentName.trim()) e.studentName = 'Student name is required';
    if (!formData.grade) e.grade = 'Please select a grade';
    if (!formData.program) e.program = 'Please select a program';
    if (!formData.message.trim()) e.message = 'Please provide additional information';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
        ? `${process.env.NEXT_PUBLIC_API_URL}/enrollment`
        : 'http://localhost:5000/api/enrollment';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to submit inquiry');
      }
      setSubmitStatus('success');
      setFormData({ fullName: '', email: '', phone: '', studentName: '', grade: '', program: '', preferredDate: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const errCls = (k: string) => (errors[k] ? 'border-error focus:ring-error' : 'border-border');
  const Label = ({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium mb-2 text-navy">
      {children} {required && <span className="text-error">*</span>}
    </label>
  );

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-border bg-surface-2 shadow-subtle">
      <div className="mb-6">
        <h2 className="font-display text-2xl text-navy mb-2">Enrollment Inquiry Form</h2>
        <p className="text-sm text-text-secondary">Fill out the form and our admissions team will contact you within 24 hours.</p>
      </div>

      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-tint border border-green/30 rounded-lg flex items-start gap-3" role="alert">
          <Icon name="CheckCircleIcon" size={20} className="text-green flex-shrink-0 mt-0.5" variant="solid" />
          <div>
            <p className="text-sm font-semibold text-green">Thank you for your inquiry!</p>
            <p className="text-xs text-text-secondary mt-1">Our admissions team will contact you shortly.</p>
          </div>
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-lg flex items-start gap-3" role="alert">
          <Icon name="ExclamationTriangleIcon" size={20} className="text-error flex-shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-error">Something went wrong. Please try again or call us directly.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="fullName" required>Parent/Guardian Name</Label>
            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className={`${fieldBase} ${errCls('fullName')}`} placeholder="Enter your full name" />
            {errors.fullName && <p className="mt-1 text-xs text-error">{errors.fullName}</p>}
          </div>
          <div>
            <Label htmlFor="email" required>Email Address</Label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`${fieldBase} ${errCls('email')}`} placeholder="your.email@example.com" autoComplete="email" />
            {errors.email && <p className="mt-1 text-xs text-error">{errors.email}</p>}
          </div>
          <div>
            <Label htmlFor="phone" required>Phone Number</Label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={`${fieldBase} ${errCls('phone')}`} placeholder="+91 98765 43210" autoComplete="tel" />
            {errors.phone && <p className="mt-1 text-xs text-error">{errors.phone}</p>}
          </div>
          <div>
            <Label htmlFor="studentName" required>Student Name</Label>
            <input type="text" id="studentName" name="studentName" value={formData.studentName} onChange={handleChange} className={`${fieldBase} ${errCls('studentName')}`} placeholder="Enter student's full name" />
            {errors.studentName && <p className="mt-1 text-xs text-error">{errors.studentName}</p>}
          </div>
          <div>
            <Label htmlFor="grade" required>Current Grade</Label>
            <select id="grade" name="grade" value={formData.grade} onChange={handleChange} className={`${fieldBase} ${errCls('grade')}`}>
              <option value="">Select grade</option>
              {grades.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            {errors.grade && <p className="mt-1 text-xs text-error">{errors.grade}</p>}
          </div>
          <div>
            <Label htmlFor="program" required>Program of Interest</Label>
            <select id="program" name="program" value={formData.program} onChange={handleChange} className={`${fieldBase} ${errCls('program')}`}>
              <option value="">Select program</option>
              {programs.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            {errors.program && <p className="mt-1 text-xs text-error">{errors.program}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="preferredDate">Preferred Consultation Date (Optional)</Label>
          <input type="date" id="preferredDate" name="preferredDate" value={formData.preferredDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} className={`${fieldBase} border-border`} />
        </div>

        <div>
          <Label htmlFor="message" required>Additional Information</Label>
          <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={4} className={`w-full px-4 py-3 rounded-lg border bg-surface text-navy placeholder:text-text-faint resize-none transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${errCls('message')}`} placeholder="Tell us about your child's academic goals, subjects of interest, or any questions..." />
          {errors.message && <p className="mt-1 text-xs text-error">{errors.message}</p>}
        </div>

        <div className="flex items-start gap-3">
          <Icon name="InformationCircleIcon" size={18} className="text-text-faint flex-shrink-0 mt-0.5" />
          <p className="text-xs text-text-secondary">By submitting this form, you agree to our privacy policy and consent to be contacted by Vertex Academy. Your information stays confidential.</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-13 min-h-[52px] rounded-full bg-primary text-primary-foreground font-semibold transition-smooth hover:bg-primary-strong hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2 shadow-blue"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span>Submit Inquiry</span>
              <Icon name="PaperAirplaneIcon" size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
