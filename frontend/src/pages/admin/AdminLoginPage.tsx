import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { apiUrl } from '../../lib/api';
import { HOSPITAL } from '../../config/hospital';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(
    searchParams.get('expired') ? 'You were signed out. Please sign in again.' : '',
  );
  const [loading, setLoading] = useState(false);

  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(apiUrl('/auth/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.data?.token) {
        login(data.data.token, data.data.admin);
        navigate('/admin');
        return;
      }

      setError('That email and password don’t match our records.');
    } catch {
      setError('We couldn’t reach the server. Check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 bg-white border border-[#D8D3C8] rounded-md text-[15px] focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 focus:outline-none';

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col justify-center py-12 px-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <img src={HOSPITAL.logo} alt="" className="w-11 h-11 object-contain" />
          <div className="leading-tight">
            <p className="font-heading text-lg text-[#1C2321]">{HOSPITAL.shortName}</p>
            <p className="text-xs text-stone-500">Staff login</p>
          </div>
        </div>

        <div className="bg-white border border-[#E7E3DA] rounded-lg p-6 sm:p-8">
          <h1 className="text-2xl">Sign in</h1>
          <p className="mt-1 text-sm text-stone-500">For hospital staff only.</p>

          {error && (
            <div role="alert" className="mt-5 p-3 bg-red-50 border border-red-200 rounded-md flex gap-2 text-sm text-red-800">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-stone-700 mb-1.5">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-stone-700 mb-1.5">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-sm text-center">
          <Link to="/" className="text-stone-600 hover:text-[#0F766E]">
            ← Back to the hospital website
          </Link>
        </p>
      </div>
    </div>
  );
};
