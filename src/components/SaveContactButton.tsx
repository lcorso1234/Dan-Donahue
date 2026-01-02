'use client';

import React, { useState } from 'react';
import ConfirmSendModal from './ConfirmSendModal';

type SaveContactButtonProps = {
  className?: string;
};

const CONTACT_NOTE = 'When electricity comes through, get out of the way.';
const DONAHUE_PHONE = '3129537098';
const INTRO_TEXT =
  "Hi Mr. Donahue, I just saved your contact info from your site and I'm looking forward to connecting soon.";

const buildSmsLink = () => {
  if (typeof navigator === 'undefined') {
    return null;
  }

  const encodedMessage = encodeURIComponent(INTRO_TEXT);
  const smsScheme = `sms:${DONAHUE_PHONE}`;
  const userAgent = navigator.userAgent || '';

  if (/iPad|iPhone|iPod/i.test(userAgent)) {
    return `${smsScheme}&body=${encodedMessage}`;
  }

  if (/Android/i.test(userAgent)) {
    return `${smsScheme}?body=${encodedMessage}`;
  }

  return `${smsScheme}?body=${encodedMessage}`;
};

const triggerSms = () => {
  const smsLink = buildSmsLink();
  if (!smsLink) {
    return;
  }

  const link = document.createElement('a');
  link.href = smsLink;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export function SaveContactButton({ className = '' }: SaveContactButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSave = () => {
    setIsSaving(true);

    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:Dan Donahue',
      'N:Donahue;Dan;;;',
      'TITLE:Baker, Electrician, Manager',
      'TEL;TYPE=CELL:312.953.7098',
      'EMAIL:macdonahue@mac.com',
      `NOTE:${CONTACT_NOTE}`,
      'END:VCARD',
    ].join('\n');

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dan-donahue.vcf';
    document.body.appendChild(link);
    link.click();
    link.remove();

    // Give the browser time to initiate the download before revoking the URL.
    setTimeout(() => URL.revokeObjectURL(url), 1500);

    // Open our custom confirmation modal after the save starts.
    setModalOpen(true);
    setIsSaving(false);
  };

  const handleConfirmSend = () => {
    setModalOpen(false);
    triggerSms();
  };

  const handleCancelSend = () => {
    setModalOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={`save-button ${className}`}
        onClick={handleSave}
        disabled={isSaving}
        aria-label="Save Dan Donahue's contact info"
        aria-busy={isSaving}
      >
        <span className="text-base tracking-[0.55em] text-neon">{isSaving ? 'Saving...' : 'Save Contact'}</span>
      </button>

      {/* Modal to confirm sending the automated SMS */}
      <ConfirmSendModal
        open={modalOpen}
        title="Send automated message"
        message={
          "Contact saved to your device. Would you like to open Messages to send an automated intro to Dan Donahue?"
        }
        onConfirm={handleConfirmSend}
        onCancel={handleCancelSend}
      />
    </>
  );
}
