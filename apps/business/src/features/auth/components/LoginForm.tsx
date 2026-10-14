'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  AlertCircle,
  User,
  Lock,
  X,
  Building2,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { AdatrackLogo, Spinner, toast } from '@adatrack/ui';
import { resolveUserTenants } from '../mock/authData';
import type { Tenant } from '../types';

interface LoginFormProps {
  currentLocale?: 'id' | 'en';
  hideHeaderLogo?: boolean;
  hideFooter?: boolean;
}

export function LoginForm({
  currentLocale = 'id',
  hideHeaderLogo = false,
  hideFooter = false,
}: LoginFormProps) {
  const router = useRouter();
  const isEn = currentLocale === 'en';

  // Step state: 'credentials' | 'select-tenant'
  const [step, setStep] = useState<'credentials' | 'select-tenant'>('credentials');
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);

  // Form input state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Step 1: Submit Credentials
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError(
        isEn
          ? 'Email or username is required'
          : 'Email atau username wajib diisi'
      );
      return;
    }

    if (!password.trim()) {
      setError(isEn ? 'Password is required' : 'Password wajib diisi');
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Resolve tenants based on user credentials
      const tenants = resolveUserTenants(identifier);

      if (tenants.length === 1) {
        // Single Tenant -> directly set active tenant and redirect to Home
        const activeTenant = tenants[0];
        try {
          localStorage.setItem('adatrack.activeTenant', JSON.stringify(activeTenant));
        } catch (e) {
          console.warn(e);
        }

        toast.success(
          isEn ? 'Login successful!' : 'Login berhasil!',
          {
            description: isEn
              ? `Entering ${activeTenant.name}`
              : `Masuk ke ${activeTenant.name}`,
          }
        );

        router.push('/');
      } else {
        // Multi-Tenant -> transition to Step 2 (Select Tenant)
        setAvailableTenants(tenants);
        setStep('select-tenant');
        setLoading(false);
      }
    } catch {
      setError(
        isEn
          ? 'Authentication failed. Please check your credentials.'
          : 'Autentikasi gagal. Periksa kembali kredensial Anda.'
      );
      setLoading(false);
    }
  };

  // Step 2: Select Tenant
  const handleSelectTenant = async (tenant: Tenant) => {
    setSelectedTenantId(tenant.id);

    try {
      localStorage.setItem('adatrack.activeTenant', JSON.stringify(tenant));
    } catch (e) {
      console.warn(e);
    }

    await new Promise((resolve) => setTimeout(resolve, 400));

    toast.success(
      isEn ? 'Login successful!' : 'Login berhasil!',
      {
        description: isEn
          ? `Entering ${tenant.name}`
          : `Masuk ke ${tenant.name}`,
      }
    );

    router.push('/');
  };

  // Return to credentials step
  const handleBackToCredentials = () => {
    setStep('credentials');
    setSelectedTenantId(null);
    setError(null);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSent(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSent(false);
      setForgotEmail('');
      toast.success(
        isEn
          ? 'Reset link sent to your email'
          : 'Tautan reset dikirim ke email Anda'
      );
    }, 1200);
  };

  return (
    <div className="w-full">
      {/* Logo & Tagline Header */}
      {!hideHeaderLogo && (
        <div className="mb-8">
          <AdatrackLogo iconClassName="h-9" />
          <p className="text-sm text-slate-500 mt-1.5 font-sans">
            Platform Tracking Modern
          </p>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          STEP 1: CREDENTIALS FORM
          ══════════════════════════════════════════════════════════ */}
      {step === 'credentials' && (
        <div className="animate-in fade-in duration-200">
          {/* Greeting */}
          <div className="mb-5 text-center">
            <h2 className="font-display text-sm sm:text-base text-slate-800 dark:text-zinc-100 tracking-tight font-bold">
              {isEn ? 'Sign in to Account' : 'Masuk ke Akun'}
            </h2>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Identifier Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
              </div>
              <input
                id="login-identifier"
                type="text"
                aria-label={isEn ? 'Email or Phone' : 'Email or Phone'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={isEn ? 'Email or Phone' : 'Email or Phone'}
                disabled={loading}
                className="w-full h-11 pl-10 pr-4 bg-white dark:bg-zinc-950/70 border border-slate-200 dark:border-zinc-700/80 rounded-xl text-sm text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#D72B2B] focus:ring-2 focus:ring-[#D72B2B]/15 dark:focus:border-[#D72B2B] dark:focus:ring-[#D72B2B]/20 transition-all font-sans"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
              </div>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                aria-label={isEn ? 'Password' : 'Kata Sandi'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isEn ? 'Password' : 'Kata Sandi'}
                disabled={loading}
                className="w-full h-11 pl-10 pr-11 bg-white dark:bg-zinc-950/70 border border-slate-200 dark:border-zinc-700/80 rounded-xl text-sm text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#D72B2B] focus:ring-2 focus:ring-[#D72B2B]/15 dark:focus:border-[#D72B2B] dark:focus:ring-[#D72B2B]/20 transition-all font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-zinc-700 cursor-pointer accent-[#D72B2B]"
                />
                <span className="text-xs text-slate-600 dark:text-zinc-400 font-sans">
                  {isEn ? 'Remember me' : 'Ingat saya'}
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className="w-full h-12 mt-2.5 bg-[#D72B2B] hover:bg-[#B91C1C] active:bg-[#991B1B] text-white font-sans rounded-xl transition-colors flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer font-semibold text-[15px] shadow-sm shadow-red-500/15"
            >
              {loading ? (
                <>
                  <Spinner className="w-4.5 h-4.5 text-white" />
                  <span>{isEn ? 'Signing In...' : 'Memproses...'}</span>
                </>
              ) : (
                <span>{isEn ? 'Sign In' : 'Masuk'}</span>
              )}
            </button>

            {/* Forgot Password Link */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs font-medium text-slate-500 hover:text-[#D72B2B] dark:text-zinc-400 dark:hover:text-[#D72B2B] transition-colors font-sans"
              >
                {isEn ? 'Forgot Password?' : 'Lupa Kata Sandi'}
              </button>
            </div>

            {/* Demo Testing Quick Fill Chips */}
            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-zinc-800/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-sans">
                  {isEn ? 'Demo Simulation' : 'Simulasi Multi-Tenant'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIdentifier('user@adatrack.id');
                    setPassword('password123');
                    setError(null);
                  }}
                  className="px-2 py-1.5 rounded-lg border border-slate-200/90 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-800/50 hover:border-slate-300 dark:hover:border-zinc-700 text-left transition-colors cursor-pointer group"
                >
                  <span className="block text-[10.5px] font-semibold text-slate-700 dark:text-zinc-200 group-hover:text-[#D72B2B] transition-colors">
                    1 Tenant
                  </span>
                  <span className="block text-[9px] text-slate-400 dark:text-zinc-500 font-mono truncate">
                    Langsung Home
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIdentifier('multi@adatrack.id');
                    setPassword('password123');
                    setError(null);
                  }}
                  className="px-2 py-1.5 rounded-lg border border-slate-200/90 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-800/50 hover:border-slate-300 dark:hover:border-zinc-700 text-left transition-colors cursor-pointer group"
                >
                  <span className="block text-[10.5px] font-semibold text-slate-700 dark:text-zinc-200 group-hover:text-[#D72B2B] transition-colors">
                    &gt; 1 Tenant
                  </span>
                  <span className="block text-[9px] text-slate-400 dark:text-zinc-500 font-mono truncate">
                    Pilih Perusahaan
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          STEP 2: SELECT TENANT (IN-PLACE TRANSITION)
          ══════════════════════════════════════════════════════════ */}
      {step === 'select-tenant' && (
        <div className="animate-in fade-in duration-200 space-y-4">
          {/* Header */}
          <div className="text-center">
            <h2 className="font-display text-sm sm:text-base text-slate-800 dark:text-zinc-100 tracking-tight font-bold">
              {isEn ? 'Select Organization' : 'Pilih Perusahaan'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 font-sans">
              {isEn
                ? 'Choose an organization to continue'
                : 'Pilih salah satu perusahaan untuk melanjutkan'}
            </p>
          </div>

          {/* Account Indicator Badge */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-zinc-800/80 border border-slate-200/60 dark:border-zinc-700/60 flex items-center justify-between text-xs font-sans">
            <div className="flex items-center gap-1.5 min-w-0 pr-2 text-slate-700 dark:text-zinc-200">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate font-medium">{identifier}</span>
            </div>
            <button
              type="button"
              onClick={handleBackToCredentials}
              className="text-[11px] font-semibold text-[#D72B2B] hover:underline cursor-pointer shrink-0"
            >
              {isEn ? 'Change' : 'Ganti'}
            </button>
          </div>

          {/* Company List (Hanya Nama Perusahaan) */}
          <div className="space-y-2 max-h-[290px] overflow-y-auto pr-0.5">
            {availableTenants.map((tenant) => {
              const isSelected = selectedTenantId === tenant.id;
              return (
                <button
                  key={tenant.id}
                  type="button"
                  disabled={selectedTenantId !== null}
                  onClick={() => handleSelectTenant(tenant)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all group cursor-pointer ${
                    isSelected
                      ? 'border-[#D72B2B] bg-red-50/60 dark:bg-red-950/40 ring-1 ring-[#D72B2B]'
                      : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 hover:border-[#D72B2B] hover:bg-red-50/20 dark:hover:bg-zinc-800/60 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#D72B2B] text-white'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 group-hover:text-[#D72B2B] group-hover:bg-red-100/50 dark:group-hover:bg-zinc-700'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-zinc-100 truncate group-hover:text-[#D72B2B] dark:group-hover:text-white transition-colors">
                      {tenant.name}
                    </span>
                  </div>

                  {isSelected ? (
                    <Spinner className="w-4 h-4 text-[#D72B2B] shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#D72B2B] group-hover:translate-x-0.5 transition-all shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Back to Credentials Link */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleBackToCredentials}
              disabled={selectedTenantId !== null}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors font-sans inline-flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isEn ? 'Back to Sign In' : 'Kembali ke Form Masuk'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Branding */}
      {!hideFooter && (
        <p className="text-center text-xs text-slate-400 dark:text-zinc-500 mt-8 font-sans">
          © {new Date().getFullYear()} PT. Adaptif Jaya Binary &nbsp;|&nbsp; Adatrack
        </p>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base text-slate-900 dark:text-white" style={{ fontWeight: 700 }}>
                {isEn ? 'Reset Password' : 'Reset Password'}
              </h3>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed font-sans">
              {isEn
                ? 'Enter your registered email to receive a reset link.'
                : 'Masukkan email terdaftar untuk menerima tautan reset password.'}
            </p>

            <form onSubmit={handleForgotSubmit} className="space-y-4 pt-1">
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="email@perusahaan.com"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:border-slate-400 transition-colors font-sans"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2.5 text-sm text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors font-sans"
                >
                  {isEn ? 'Cancel' : 'Batal'}
                </button>
                <button
                  type="submit"
                  disabled={forgotSent}
                  className="px-5 py-2.5 text-sm bg-[#D72B2B] hover:bg-[#B91C1C] text-white rounded-xl transition-colors disabled:opacity-50 font-sans"
                  style={{ fontWeight: 600 }}
                >
                  {forgotSent
                    ? isEn ? 'Sending...' : 'Mengirim...'
                    : isEn ? 'Send Link' : 'Kirim Tautan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
