'use client';

import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { usePersonalLocale } from '@/components/PersonalShellLayout';
import { getTranslation } from '@/i18n';
import { SettingsMenu, SettingsSection } from './SettingsMenu';
import { VehiclesSection } from './VehiclesSection';
import { DevicesSection } from './DevicesSection';
import { NotificationsSection } from './NotificationsSection';
import { GeofenceSection } from './GeofenceSection';
import { AccountSection } from './AccountSection';
import { HelpSection } from './HelpSection';
import { AboutSection } from './AboutSection';

export function SettingsPage() {
  const locale = usePersonalLocale();
  const t = getTranslation(locale);
  const [activeSection, setActiveSection] = useState<SettingsSection>('overview');

  const renderSection = () => {
    switch (activeSection) {
      case 'vehicles': return <VehiclesSection />;
      case 'devices': return <DevicesSection />;
      case 'notifications': return <NotificationsSection />;
      case 'geofences': return <GeofenceSection />;
      case 'account': return <AccountSection />;
      case 'help': return <HelpSection />;
      case 'about': return <AboutSection />;
      default: return <SettingsMenu onSelect={setActiveSection} />;
    }
  };

  const getSectionTitle = () => {
    if (activeSection === 'overview') return t.settings.pageTitle;
    return t.settings.menus[activeSection]?.title || t.settings.pageTitle;
  };

  const getSectionSubtitle = () => {
    if (activeSection === 'overview') return t.settings.pageSubtitle;
    return null;
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 md:py-8 flex flex-col pb-24">
      {/* Header */}
      <div className="flex items-center mb-6">
        {activeSection !== 'overview' && (
          <button 
            onClick={() => setActiveSection('overview')}
            className="mr-3 p-2 -ml-2 rounded-full hover:bg-surface-elevated transition-colors"
            aria-label={t.settings.back}
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {getSectionTitle()}
          </h1>
          {getSectionSubtitle() && (
            <p className="text-sm text-foreground-muted mt-1">
              {getSectionSubtitle()}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {renderSection()}
      </div>
    </div>
  );
}
