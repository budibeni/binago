'use client';
import React, { createContext, useContext } from 'react';

export interface UIConfig {
  cancelText?: string;
  saveText?: string;
}

const UIConfigContext = createContext<UIConfig>({
  cancelText: 'Batal',
  saveText: 'Simpan'
});

export const useUIConfig = () => useContext(UIConfigContext);

export interface UIProviderProps {
  config: UIConfig;
  children: React.ReactNode;
}

export const UIProvider = ({ config, children }: UIProviderProps) => (
  <UIConfigContext.Provider value={config}>
    {children}
  </UIConfigContext.Provider>
);
