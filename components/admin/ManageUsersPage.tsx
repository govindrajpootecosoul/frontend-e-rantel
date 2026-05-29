'use client';

import { FormEvent, useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Users, X } from 'lucide-react';
import ScreenAccessPicker from '@/components/admin/ScreenAccessPicker';
import { api } from '@/lib/api';
import {
  getScreenLabel,
  isSuperAdmin,
  isSuperAdminRole,
  SCREEN_GROUPS,
} from '@/lib/permissions';
import { useAuth } from '@/providers/AuthProvider';
import type { ManagedUser, ScreenGroupOption, ScreenId, UserRole } from '@/lib/types';

interface UserFormState {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  status: 'active' | 'inactive';
  screenAccess: ScreenId[];
}

const emptyForm = (): UserFormState => ({
  name: '',
  email: '',
  phone: '',
  password: '',
  role: 'user',
  status: 'active',
  screenAccess: [],
});

export default function ManageUsersPage() {
  const queryClient = useQueryClient();
  const { canManageUsers, loading: authLoading } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ManagedUser | null>(null);
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [formError, setFormError] = useState('');

  const usersQuery = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => (await api.listUsers()).data,
    enabled: canManageUsers && !authLoading,
  });

  const screenGroups = (
    usersQuery.data?.screenGroups?.length
      ? usersQuery.data.screenGroups
      : SCREEN_GROUPS
  ) as ScreenGroupOption[];

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editing) {
        const body: Parameters<typeof api.updateUser>[1] = {
          name: form.name,
          phone: form.phone,
          role: form.role,
          status: form.status,
          screenAccess: isSuperAdminRole(form.role) ? [] : form.screenAccess,
        };
        if (form.password.trim()) body.password = form.password;
        return api.updateUser(editing.id, body);
      }
      return api.createUser({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
        status: form.status,
        screenAccess: isSuperAdminRole(form.role) ? [] : form.screenAccess,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      closeModal();
      if (!isSuperAdminRole(form.role)) {
        window.alert(
          'User saved. They must sign out and sign in again to see updated screens in the sidebar.'
        );
      }
    },
    onError: (err: Error) => setFormError(err.message),
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (user: ManagedUser) => {
    setEditing(user);
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      password: '',
      role: user.role,
      status: user.status === 'inactive' ? 'inactive' : 'active',
      screenAccess: [...(user.screenAccess || [])],
    });
    setFormError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setForm(emptyForm());
    setFormError('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.name.trim()) {
      setFormError('Name is required');
      return;
    }
    if (!editing && !form.email.trim()) {
      setFormError('Email is required');
      return;
    }
    if (!editing && !form.password.trim()) {
      setFormError('Password is required for new users');
      return;
    }
    if (form.role === 'user' && form.screenAccess.length === 0) {
      setFormError('Select at least one screen for regular users');
      return;
    }
    saveMutation.mutate();
  };

  const roleBadge = useCallback((role: UserRole) => {
    if (isSuperAdminRole(role)) {
      return (
        <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-300 ring-1 ring-violet-500/30">
          Super Admin
        </span>
      );
    }
    return (
      <span className="rounded-full bg-slate-700/50 px-2 py-0.5 text-[10px] font-medium text-slate-300">
        User
      </span>
    );
  }, []);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
            <Users size={26} className="text-cyan-400" />
            Manage Users
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create users with role <strong className="text-slate-400">User</strong>, then tick which
            screens they can open (Executive, PO &amp; SO, PO Trackers).
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
        >
          <Plus size={16} />
          Create user
        </button>
      </div>

      {usersQuery.error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {(usersQuery.error as Error).message}
        </div>
      )}

      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-sm text-slate-400">
        <p className="font-medium text-cyan-300">How to assign screen access</p>
        <ol className="mt-2 list-inside list-decimal space-y-1 text-xs">
          <li>Click <span className="text-slate-300">Create user</span> or{' '}
            <span className="text-slate-300">Edit</span> on an existing user.</li>
          <li>Set <span className="text-slate-300">Role</span> to <span className="text-slate-300">User</span>{' '}
            (Super Admin always has every screen).</li>
          <li>
            Use <span className="text-slate-300">Select all screens</span> for live + coming soon (Stores,
            Demand Planner). Super Admin gets all by default.
          </li>
          <li>After save, that user must <span className="text-slate-300">sign out and sign in</span> again.</li>
        </ol>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Screen access</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersQuery.isLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-800/60">
                    <td colSpan={6} className="px-4 py-4">
                      <div className="h-4 animate-pulse rounded bg-slate-800" />
                    </td>
                  </tr>
                ))}
              {!usersQuery.isLoading &&
                usersQuery.data?.users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-800/60 hover:bg-slate-900/40"
                  >
                    <td className="px-4 py-3 font-medium text-white">{user.name}</td>
                    <td className="px-4 py-3 text-slate-400">{user.email}</td>
                    <td className="px-4 py-3">{roleBadge(user.role)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          user.status === 'active'
                            ? 'text-emerald-400'
                            : 'text-slate-500'
                        }
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isSuperAdmin(user) ? (
                        <span className="text-xs text-violet-300">All screens (default)</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {(user.screenAccess || []).map((id) => (
                            <span
                              key={id}
                              className="rounded-md bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300"
                            >
                              {getScreenLabel(id)}
                            </span>
                          ))}
                          {!user.screenAccess?.length && (
                            <span className="text-xs text-amber-400">None</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openEdit(user)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:border-cyan-500/30 hover:text-cyan-300"
                      >
                        <Pencil size={12} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="glass-panel max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                {editing ? 'Edit user' : 'Create user'}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                  {formError}
                </p>
              )}

              <div>
                <label className="mb-1 block text-xs text-slate-500">Full name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-500/50"
                  required
                />
              </div>

              {!editing && (
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-500/50"
                    required
                  />
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs text-slate-500">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-500">
                  Password {editing && '(leave blank to keep)'}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-500/50"
                  required={!editing}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Role</label>
                  <select
                    value={form.role}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        role: e.target.value as UserRole,
                        screenAccess: isSuperAdminRole(e.target.value) ? [] : f.screenAccess,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-500/50"
                  >
                    <option value="user">User</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        status: e.target.value as 'active' | 'inactive',
                      }))
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-500/50"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
                <label className="mb-1 block text-sm font-semibold text-white">
                  Screen access
                </label>
                {isSuperAdminRole(form.role) ? (
                  <p className="text-sm text-violet-300">
                    Super Admin has access to Executive, PO &amp; SO, and PO Trackers. To limit
                    access, set Role to <span className="text-slate-300">User</span> and choose
                    screens below.
                  </p>
                ) : (
                  <>
                    <p className="mb-3 text-xs text-slate-500">
                      Select at least one screen. User will only see those items in the sidebar.
                    </p>
                    <ScreenAccessPicker
                      value={form.screenAccess}
                      onChange={(screenAccess) => setForm((f) => ({ ...f, screenAccess }))}
                      groups={screenGroups}
                    />
                  </>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
                >
                  {saveMutation.isPending ? 'Saving…' : editing ? 'Save changes' : 'Create user'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
