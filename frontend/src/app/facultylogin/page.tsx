'use client';

import LoginForm from '@/components/portal/LoginForm';

export default function FacultyLoginPage() {
  return (
    <LoginForm
      title="Faculty Login"
      subtitle="Vertex Academy Faculty Portal"
      icon="AcademicCapIcon"
      accent="gold"
      usernameLabel="Email or Faculty ID"
      usernamePlaceholder="you@vertex or VA-FAC-0001"
    />
  );
}
