import React from 'react';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { cn } from '@adatrack/utils';

export function formatPhoneNumberStr(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/.{1,4}/g);
  return match ? match.join('-') : phone;
}

export function PhoneLink({ phone, className }: { phone?: string | null, className?: string }) {
  if (!phone) return <span className="text-foreground-muted/50">-</span>;
  
  const formatted = formatPhoneNumberStr(phone);
  const waLink = `https://wa.me/${phone.replace(/[^0-9]/g, '')}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex items-center gap-1.5 transition-colors text-inherit hover:text-green-600 dark:hover:text-green-400",
        className
      )}
      title="Chat WhatsApp"
    >
      <span className="truncate">{formatted}</span>
      <MessageCircle className="w-3 h-3 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </a>
  );
}

export function EmailLink({ email, className }: { email?: string | null, className?: string }) {
  if (!email) return <span className="text-foreground-muted/50">-</span>;

  return (
    <a
      href={`mailto:${email}`}
      className={cn(
        "group inline-flex items-center gap-1.5 transition-colors text-inherit hover:text-blue-600 dark:hover:text-blue-400",
        className
      )}
      title="Kirim Email"
    >
      <span>{email}</span>
      <Mail className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
    </a>
  );
}
