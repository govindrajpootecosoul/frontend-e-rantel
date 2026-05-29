'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import AuthFormShell from '@/components/auth/AuthFormShell';
import { api } from '@/lib/api';
import { setAuth } from '@/lib/auth';
import type { AuthUser } from '@/lib/types';

export default function SigninPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = new FormData(e.currentTarget);
    try {
      const res = await api.signin({
        email: String(form.get('email')),
        password: String(form.get('password')),
      });
      setAuth(res.data.token, res.data.user as AuthUser);
      router.push('/executive');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormShell title="Sign in" subtitle="Access your executive dashboard">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            {error}
          </p>
        )}
        <input
          name="email"
          type="email"
          required
          placeholder="Email address"
          className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm outline-none focus:border-cyan-500/50"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm outline-none focus:border-cyan-500/50"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-cyan-500 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        New user?{' '}
        <Link href="/signup" className="text-cyan-400 hover:underline">
          Create account
        </Link>
      </p>
    </AuthFormShell>
  );
}
