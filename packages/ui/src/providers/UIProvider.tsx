'use client';
import React, { createContext, useContext } from 'react';
import { Toaster } from 'sonner';

export interface UIConfig {
  cancelText?: string;
  saveText?: string;
  detailTitle?: string;
  editText?: string;
  deleteText?: string;
}

const UIConfigContext = createContext<UIConfig>({
  cancelText: 'Batal',
  saveText: 'Simpan',
  detailTitle: 'Detail',
  editText: 'Edit',
  deleteText: 'Hapus',
});

export const useUIConfig = () => useContext(UIConfigContext);

export interface UIProviderProps {
  config: UIConfig;
  children: React.ReactNode;
}

export const UIProvider = ({ config, children }: UIProviderProps) => {
  return (
    <UIConfigContext.Provider value={config}>
      {children}
      <Toaster position="top-right" richColors closeButton />
    </UIConfigContext.Provider>
  );
};
