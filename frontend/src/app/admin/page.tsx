'use client';

import LoginForm from '@/components/portal/LoginForm';

export default function AdminLoginPage() {
  return (
    <LoginForm
      title="Admin Panel"
      subtitle="Vertex Academy Management"
      icon="ShieldCheckIcon"
      accent="primary"
      usernameLabel="Email"
      usernamePlaceholder="admin@vertex"
    />
  );
}
