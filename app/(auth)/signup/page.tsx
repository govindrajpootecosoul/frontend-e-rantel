'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import AuthFormShell from '@/components/auth/AuthFormShell';
import { api } from '@/lib/api';
import { setAuth } from '@/lib/auth';
import { getDefaultRoute } from '@/lib/permissions';
import type { AuthUser } from '@/lib/types';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = new FormData(e.currentTarget);
    try {
      const res = await api.signup({
        fullname: String(form.get('fullname')),
        email: String(form.get('email')),
        mobile: String(form.get('mobile') || ''),
        password: String(form.get('password')),
      });
      const user = res.data.user as AuthUser;
      setAuth(res.data.token, user);
      router.push(getDefaultRoute(user));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormShell title="Create account" subtitle="Register for executive access">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            {error}
          </p>
        )}
        <input
          name="fullname"
          required
          placeholder="Full name"
          className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm outline-none focus:border-cyan-500/50"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Email address"
          className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm outline-none focus:border-cyan-500/50"
        />
        <input
          name="mobile"
          placeholder="Mobile (optional)"
          className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm outline-none focus:border-cyan-500/50"
        />
        <input
          name="password"
          type="password"
          required
          minLength={6}
          placeholder="Password"
          className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm outline-none focus:border-cyan-500/50"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-cyan-500 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
        >
          {loading ? 'Creating…' : 'Sign up'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link href="/signin" className="text-cyan-400 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthFormShell>
  );
}
