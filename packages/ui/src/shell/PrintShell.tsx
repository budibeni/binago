'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export type PaperSize = 'A4' | 'LETTER' | 'LEGAL' | 'auto' | string;

export interface PrintShellProps {
  /** Indicates whether the print process should start */
  open: boolean;
  /** Callback fired after the print dialog closes */
  onClose: () => void;
  /** Title shown in the print dialog (used for default PDF filename) */
  title?: string;
  /** The content to be printed */
  children: React.ReactNode;
  /** Paper size for the CSS @page rule. Example: 'A4', 'LEGAL' */
  paperSize?: PaperSize;
  /** Orientation for the CSS @page rule */
  orientation?: 'portrait' | 'landscape';
  /** Margin for the CSS @page rule */
  margin?: string;
}

export function PrintShell({
  open,
  onClose,
  title,
  children,
  paperSize = 'auto',
  orientation = 'portrait',
  margin = '15mm',
}: PrintShellProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open && mounted) {
      // Temporarily change document title so the print dialog uses it as filename
      const originalTitle = document.title;
      if (title) document.title = title;

      // Small delay to ensure the DOM has rendered the portal contents
      const timer = setTimeout(() => {
        window.print();
        
        // Restore title and close after print dialog is dismissed
        if (title) document.title = originalTitle;
        onClose();
      }, 150);

      return () => {
        clearTimeout(timer);
        if (title) document.title = originalTitle;
      };
    }
  }, [open, mounted, onClose, title]);

  if (!open || !mounted) return null;

  // Render a portal directly to document.body to ensure it's at the root level.
  // This allows us to hide EVERYTHING else in the body easily during @media print.
  return createPortal(
    <div className="print-shell-wrapper">
      <style>{`
        /* Hide this wrapper on the normal screen */
        @media screen {
          .print-shell-wrapper {
            display: none !important;
          }
        }
        
        /* Show ONLY this wrapper when printing */
        @media print {
          /* Hide all other elements in the body */
          body > *:not(.print-shell-wrapper) {
            display: none !important;
          }
          
          .print-shell-wrapper {
            display: block !important;
            background-color: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }

          /* Dynamically set paper size and orientation for the browser print dialog */
          @page {
            ${paperSize !== 'auto' ? `size: ${paperSize} ${orientation};` : ''}
            margin: ${margin};
          }

          /* Ensure html/body don't have scrolling or backgrounds that mess up printing */
          html, body {
            height: auto !important;
            background-color: white !important;
            overflow: visible !important;
          }

          /* Helper class to prevent page breaks inside specific elements */
          .print-break-inside-avoid {
            break-inside: avoid;
          }
        }
      `}</style>
      
      {children}
    </div>,
    document.body
  );
}
