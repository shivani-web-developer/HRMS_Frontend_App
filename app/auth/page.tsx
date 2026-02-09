'use client';

import { useState } from 'react';
import AuthLayout from '../component/auth/AuthLayout';
import LoginForm from '../component/auth/LoginFor';
import SignupForm from '../component/auth/LoginFor';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <AuthLayout mode={mode} setMode={setMode}>
      {mode === 'login' ? <LoginForm /> : <SignupForm />}
    </AuthLayout>
  );
}
