'use client';

import LoginForm from '@/components/portal/LoginForm';

export default function StudentLoginPage() {
  return (
    <LoginForm
      title="Student Login"
      subtitle="Vertex Academy Student Portal"
      icon="UserGroupIcon"
      accent="primary"
      usernameLabel="Email or Student ID"
      usernamePlaceholder="you@vertex or VA-25-0001"
    />
  );
}
