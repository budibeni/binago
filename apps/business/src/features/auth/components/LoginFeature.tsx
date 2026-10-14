'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Globe, Radio, ShieldCheck, BarChart3, Briefcase } from 'lucide-react';
import { AdatrackLogo } from '@adatrack/ui';
import { LoginForm } from './LoginForm';


/* ── Main LoginFeature ───────────────────────────────────────────────────────── */
export function LoginFeature() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [locale, setLocale] = useState<'id' | 'en'>('id');

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('adatrack.theme') as 'light' | 'dark';
      if (savedTheme) {
        setTheme(savedTheme);
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      const savedLocale = localStorage.getItem('adatrack.locale') as 'id' | 'en';
      if (savedLocale === 'id' || savedLocale === 'en') setLocale(savedLocale);
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    try {
      localStorage.setItem('adatrack.theme', next);
      if (next === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } catch (e) {
      console.warn(e);
    }
  };

  const toggleLocale = () => {
    const next = locale === 'id' ? 'en' : 'id';
    setLocale(next);
    try { localStorage.setItem('adatrack.locale', next); } catch (e) { console.warn(e); }
  };

  const isEn = locale === 'en';

  return (
    <div className="min-h-screen w-full bg-[#f4f5f7] dark:bg-zinc-950 flex font-sans select-none overflow-hidden">

      {/* ══════════════════════════════════════════════════════════
          LEFT PANEL — Hero Showcase (Clean, Balanced & High-Tech)
          ══════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex flex-1 relative flex-col justify-between p-8 xl:p-12 overflow-hidden bg-[#f4f5f7] dark:bg-zinc-950">

        {/* Background Fleet Showcase — Grounded and seamlessly blended into the background */}
        <div className="absolute right-0 bottom-0 w-[78%] xl:w-[84%] 2xl:w-[88%] h-[56vh] lg:h-[60vh] xl:h-[66vh] 2xl:h-[70vh] pointer-events-none flex items-end justify-end overflow-hidden">
          <div className="relative h-full max-w-full aspect-[16/9]">
            {/* Light Mode Fleet Image (Clean Studio Background) */}
            <img
              src="/images/login-hero2.jpg"
              alt="ADATRACK Fleet Telematics"
              className="w-full h-full object-contain object-right-bottom block dark:hidden"
              draggable={false}
            />
            {/* Dark Mode Fleet Image (High-Tech Dark Studio Background) */}
            <img
              src="/images/login-hero2-dark.jpg"
              alt="ADATRACK Fleet Telematics"
              className="w-full h-full object-contain object-right-bottom hidden dark:block"
              draggable={false}
            />
            {/* Seamless Left Edge Feather Fade matching subtle grey page in light and zinc-950 in dark */}
            <div className="absolute left-0 inset-y-0 w-32 xl:w-44 bg-gradient-to-r from-[#f4f5f7] via-[#f4f5f7]/80 to-transparent dark:from-zinc-950 dark:via-zinc-950/80 pointer-events-none z-10" />
            {/* Seamless Top Edge Feather Fade matching subtle grey page in light and zinc-950 in dark */}
            <div className="absolute inset-x-0 top-0 h-24 xl:h-32 bg-gradient-to-b from-[#f4f5f7] via-[#f4f5f7]/80 to-transparent dark:from-zinc-950 dark:via-zinc-950/80 pointer-events-none z-10" />

            {/* GPS Signal Emission Indicator radiating from the lead truck roof */}
            <div className="absolute top-[12%] left-[69%] -translate-x-1/2 flex flex-col items-center z-20">
              {/* Animated Radio / Telematics Signal Waves */}
              <div className="relative flex items-center justify-center">
                {/* Outer wave ring */}
                <span className="absolute w-28 h-28 rounded-full border border-red-500/20 animate-pulse duration-1000" />
                {/* Mid wave ring */}
                <span className="absolute w-20 h-20 rounded-full border-2 border-red-500/35 animate-ping duration-1000" />
                {/* Inner wave ring */}
                <span className="absolute w-10 h-10 rounded-full border-2 border-red-500/50 animate-pulse duration-700" />
                {/* Central Glowing Red GPS Beacon */}
                <span className="relative w-3.5 h-3.5 rounded-full bg-[#D72B2B] shadow-lg shadow-red-500/60 ring-4 ring-white dark:ring-zinc-900 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
              </div>

              {/* Micro pill badge: Sinyal GPS Aktif */}
              <div className="mt-2.5 px-2.5 py-0.5 rounded-full bg-white/95 dark:bg-zinc-900/95 border border-red-500/30 shadow-md backdrop-blur-md flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-[#D72B2B] animate-pulse" />
                <span className="text-[10.5px] font-bold text-slate-800 dark:text-zinc-100 font-sans tracking-tight">
                  {isEn ? 'GPS Signal: Active' : 'Sinyal GPS: Aktif'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating micro glassmorphism live indicator on top-right */}
        <div className="absolute top-8 right-8 z-20 pointer-events-none">
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/80 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D72B2B] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D72B2B]" />
            </span>
            <span className="text-[11.5px] font-semibold text-slate-800 dark:text-zinc-100 font-sans tracking-tight">
              {isEn ? 'Live GPS Tracking' : 'Live GPS Tracking'}
            </span>
          </div>
        </div>

        {/* Top-Left Content: Value Proposition & Capabilities (positioned cleanly above fleet) */}
        <div className="relative z-20 max-w-lg pt-2 xl:pt-4">
          {/* Red accent bar + Tagline */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-1 bg-[#D72B2B] rounded-full" />
            <span className="font-display text-xs xl:text-sm font-bold text-[#D72B2B] tracking-wider uppercase">
              {isEn ? 'Modern Telematics Platform' : 'Platform Tracking Modern'}
            </span>
          </div>

          <h1 className="font-display text-[#0F172A] dark:text-white text-3xl xl:text-4xl font-extrabold leading-[1.18] tracking-tight">
            {isEn ? (
              <>Track Your Assets,<br />Anywhere</>
            ) : (
              <>Pantau Aset Anda,<br />di Mana Saja</>
            )}
          </h1>

          <p className="text-slate-600 dark:text-zinc-400 text-sm xl:text-base leading-relaxed mt-3 font-sans max-w-md">
            {isEn
              ? 'Smart telematics and real-time GPS tracking to elevate your fleet’s operational efficiency and asset security.'
              : 'Sistem telematika cerdas dan pelacakan GPS real-time untuk efisiensi operasional dan keamanan armada bisnis Anda.'}
          </p>

          {/* 4 Vertical Capability & Business Solution Pillars */}
          <div className="mt-6 pt-5 border-t border-slate-200/70 dark:border-zinc-800/80 space-y-3.5 max-w-md">
            {/* 1. Keamanan & Proteksi Aset */}
            <div className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800 shadow-2xs flex items-center justify-center shrink-0 group-hover:border-teal-400 dark:group-hover:border-teal-600 transition-colors">
                <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </div>
              <span className="text-xs xl:text-sm font-bold text-slate-800 dark:text-zinc-100 font-sans tracking-tight">
                {isEn ? 'Asset Security & Protection' : 'Keamanan & Proteksi Aset'}
              </span>
            </div>

            {/* 2. Efisiensi & Kontrol Operasional */}
            <div className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800 shadow-2xs flex items-center justify-center shrink-0 group-hover:border-red-400 dark:group-hover:border-red-600 transition-colors">
                <BarChart3 className="w-4 h-4 text-[#D72B2B]" />
              </div>
              <span className="text-xs xl:text-sm font-bold text-slate-800 dark:text-zinc-100 font-sans tracking-tight">
                {isEn ? 'Operational Efficiency & Control' : 'Efisiensi & Kontrol Operasional'}
              </span>
            </div>

            {/* 3. Pelacakan GPS Real-Time */}
            <div className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800 shadow-2xs flex items-center justify-center shrink-0 group-hover:border-blue-400 dark:group-hover:border-blue-600 transition-colors">
                <Radio className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs xl:text-sm font-bold text-slate-800 dark:text-zinc-100 font-sans tracking-tight">
                {isEn ? 'Real-Time GPS Telematics' : 'Pelacakan GPS Real-Time'}
              </span>
            </div>

            {/* 4. Modul Bisnis Terintegrasi */}
            <div className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800 shadow-2xs flex items-center justify-center shrink-0 group-hover:border-violet-400 dark:group-hover:border-violet-600 transition-colors">
                <Briefcase className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <span className="text-xs xl:text-sm font-bold text-slate-800 dark:text-zinc-100 font-sans tracking-tight">
                {isEn ? 'Integrated Business Modules' : 'Modul Bisnis Terintegrasi'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Left: GPS Hardware Showcase + Website URL */}
        <div className="relative z-20 flex flex-col items-start gap-3">
          {/* Light Mode GPS Device */}
          <img
            src="/images/gps-device.png"
            alt="ADATRACK GPS Telematics Device"
            className="w-44 xl:w-52 h-auto object-contain select-none pointer-events-none drop-shadow-sm block dark:hidden"
            draggable={false}
          />
          {/* Dark Mode GPS Device (Clean Transparent PNG, zero background box) */}
          <img
            src="/images/gps-device-dark.png"
            alt="ADATRACK GPS Telematics Device"
            className="w-44 xl:w-52 h-auto object-contain select-none pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] hidden dark:block"
            draggable={false}
          />
          <span className="text-xs text-slate-400 dark:text-zinc-500 font-sans font-medium tracking-wide">
            www.adatrack.id
          </span>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════
          RIGHT PANEL — Login Card (Clean White, crisp contrast)
          ══════════════════════════════════════════════════════════ */}
      <div className="w-full lg:w-[350px] xl:w-[380px] shrink-0 flex flex-col bg-white dark:bg-zinc-900 relative overflow-hidden border-l border-slate-200/70 dark:border-zinc-800">

        {/* Lang / Theme Controls — top right */}
        <div className="absolute top-4 right-5 z-30 flex items-center gap-1 bg-white/80 dark:bg-zinc-800/90 backdrop-blur-sm px-1.5 py-1 rounded-full border border-slate-200/80 dark:border-zinc-700/80 shadow-sm">
          <button
            type="button"
            onClick={toggleLocale}
            title="Switch Language"
            className="flex items-center gap-1 px-2 py-1 rounded-full text-[11px] text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors uppercase font-sans font-semibold"
          >
            <Globe className="w-3 h-3" />
            <span>{locale}</span>
          </button>
          <div className="w-[1px] h-3.5 bg-slate-200 dark:bg-zinc-700" />
          <button
            type="button"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            className="p-1.5 rounded-full text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {theme === 'dark'
              ? <Sun className="w-3.5 h-3.5 text-amber-400" />
              : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Form Area — centered vertically */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 py-10 relative z-10">
          <div className="w-full max-w-[310px] mx-auto">

            {/* ADATRACK Logo at Top Center (like McEasy) */}
            <div className="mb-8 text-center flex flex-col items-center">
              <AdatrackLogo iconClassName="h-9 sm:h-10" />
            </div>

            {/* Login Form */}
            <LoginForm currentLocale={locale} hideHeaderLogo hideFooter />

          </div>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 px-6 sm:px-8 pb-6 text-center">
          <p className="text-[11.5px] text-slate-400 dark:text-zinc-500 font-sans font-medium tracking-wide">
            PT Adaptif Jaya Binary
          </p>
        </div>
      </div>

    </div>
  );
}
