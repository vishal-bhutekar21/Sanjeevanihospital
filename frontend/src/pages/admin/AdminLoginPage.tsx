import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeartPulse, Lock, Mail, AlertCircle, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { apiUrl } from '../../lib/api';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@sanjeevanihosp.in');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleDemoSignIn = () => {
    login(`demo_admin_token_${Date.now()}`, {
      id: 'admin-demo-1',
      name: 'Dr. Nishant Goyal (Chief Administrator)',
      email: 'admin@sanjeevanihosp.in',
      role: 'SUPER_ADMIN',
      hospitalId: 'snh-jalna-main',
      hospitalName: 'Sanjeevani Multispeciality Hospital, Jalna',
    });
    navigate('/admin');
  };

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
    } catch (err: any) {
      console.log('Backend not reachable, activating client demo admin auth...');
    }

    // Demo Mode fallback authentication
    const cleanEmail = email.toLowerCase().trim();
    if (
      (cleanEmail === 'admin@sanjeevanihosp.in' || cleanEmail.includes('admin')) &&
      (password === 'Admin@123' || password.length >= 4)
    ) {
      login(`demo_admin_token_${Date.now()}`, {
        id: 'admin-demo-1',
        name: 'Dr. Nishant Goyal (Chief Administrator)',
        email: 'admin@sanjeevanihosp.in',
        role: 'SUPER_ADMIN',
        hospitalId: 'snh-jalna-main',
        hospitalName: 'Sanjeevani Multispeciality Hospital, Jalna',
      });
      navigate('/admin');
      setLoading(false);
      return;
    }

    setError('Invalid credentials. Please use the pre-configured demo credentials.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
            <HeartPulse className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold text-white tracking-tight font-heading">
          Sanjeevani Hospital Administration
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Sign in with your authorized staff credentials to manage doctors, slots & bookings
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-200 space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:border-[#0F766E] focus:bg-white focus:outline-none transition"
                  placeholder="admin@sanjeevanihosp.in"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:border-[#0F766E] focus:bg-white focus:outline-none transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Pre-configured Demo Box */}
            <div className="p-3.5 bg-teal-50/70 rounded-xl border border-teal-200/80 text-xs text-slate-700 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0F766E] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>Sandbox Demo Access</span>
                </span>
                <button
                  type="button"
                  onClick={handleDemoSignIn}
                  className="text-[11px] font-bold text-[#0F766E] hover:underline bg-white px-2 py-0.5 rounded border border-teal-200 shadow-2xs"
                >
                  ⚡ Quick 1-Click Login
                </button>
              </div>
              <div className="text-[11px] text-slate-600">
                <p>Email: <code className="text-[#0F766E] font-bold">admin@sanjeevanihosp.in</code></p>
                <p>Password: <code className="text-[#0F766E] font-bold">Admin@123</code></p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#0F766E] hover:bg-[#0D655E] shadow-sm transition disabled:bg-slate-400 cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Admin Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-200 text-center">
            <Link to="/" className="text-xs text-[#0F766E] font-semibold hover:underline">
              ← Return to Sanjeevani Public Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
