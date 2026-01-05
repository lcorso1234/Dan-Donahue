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

const buildSmsLink = (message = INTRO_TEXT) => {
  if (typeof navigator === 'undefined') {
    return null;
  }

  const encodedMessage = encodeURIComponent(message);
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

const triggerSms = (message?: string) => {
  const smsLink = buildSmsLink(message);
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
  const [savePromptOpen, setSavePromptOpen] = useState(false);
  const [installPromptOpen, setInstallPromptOpen] = useState(false);
  const [downloadedVcardUrl, setDownloadedVcardUrl] = useState<string | null>(null);
  const [downloadedVcardBlob, setDownloadedVcardBlob] = useState<Blob | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');

  const performSave = () => {
    // Close the save prompt immediately to avoid modal overlap
    setSavePromptOpen(false);
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

    // Prefer opening Android's Add Contact intent so it opens directly in the Contacts app.
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
    const isAndroid = /Android/i.test(userAgent);

    if (isAndroid) {
      // Create the vCard blob and trigger a download so the user has the file locally.
      const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'dan-donahue.vcf';
      document.body.appendChild(link);
      setTimeout(() => {
        link.click();
        link.remove();
      }, 100);

      // Keep the blob and blob URL available so we can try the Web Share API (preferred) or open the file.
      setDownloadedVcardBlob(blob);
      setDownloadedVcardUrl(url);

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
    const finalMessage = `${INTRO_TEXT} My name is ${senderName || '[your name]'} and my email is ${senderEmail || '[your email]'}.`;
    setModalOpen(false);
    triggerSms(finalMessage);

    // Clear inputs after sending
    setSenderName('');
    setSenderEmail('');
  };

  const handleCancelSend = () => {
    setModalOpen(false);
  };

  const handleInstallContact = async () => {
    // If there's nothing to open/share, proceed to the send modal
    if (!downloadedVcardUrl && !downloadedVcardBlob) {
      setInstallPromptOpen(false);
      setModalOpen(true);
      return;
    }

    // Preferred: use the Web Share API with files when available (Android Chrome supports sharing files)
    const canUseWebShareFiles =
      typeof navigator !== 'undefined' &&
      'canShare' in navigator &&
      'share' in navigator &&
      downloadedVcardBlob;

    if (canUseWebShareFiles) {
      const file = new File([downloadedVcardBlob as Blob], 'dan-donahue.vcf', {
        type: 'text/vcard',
      });

      try {
        // Ensure the browser actually supports sharing files
        if ((navigator as any).canShare && (navigator as any).canShare({ files: [file] })) {
          await (navigator as any).share({
            files: [file],
            title: 'Add Dan Donahue',
            text: 'Install contact',
          });
        } else {
          throw new Error('Web Share with files not supported');
        }
      } catch (e) {
        // Fall back to opening the blob URL below
        try {
          if (downloadedVcardUrl) window.open(downloadedVcardUrl, '_blank');
        } catch (err) {
          // ignore
        }
      }
    } else if (downloadedVcardUrl) {
      // Secondary fallback: open the blob URL in a new tab which may hand the file to Downloads/Contacts
      try {
        window.open(downloadedVcardUrl, '_blank');
      } catch (e) {
        // ignore
      }

      // Tertiary fallback: try an Android intent URL to nudge Chrome to hand off to the system
      try {
        const intentUrl = `intent:${downloadedVcardUrl}#Intent;action=android.intent.action.VIEW;end`;
        window.location.href = intentUrl;
      } catch (e) {
        // ignore
      }
    }

    // Close the install prompt and open the send modal so they can add name/email
    setInstallPromptOpen(false);
    setModalOpen(true);

    // Revoke the blob URL after a short delay and clear state
    setTimeout(() => {
      try {
        if (downloadedVcardUrl) URL.revokeObjectURL(downloadedVcardUrl);
      } catch (e) {
        // ignore
      }
      setDownloadedVcardUrl(null);
      setDownloadedVcardBlob(null);
    }, 5000);
  };

  return (
    <>
      <button
        type="button"
        className={`save-button ${className}`}
        onClick={() => setSavePromptOpen(true)}
        disabled={isSaving}
        aria-label="Save Dan Donahue's contact info"
        aria-busy={isSaving}
      >
        <span className="text-base tracking-[0.55em] text-neon">{isSaving ? 'Saving...' : 'Save Contact'}</span>
      </button>

      {/* Modal to confirm saving the contact first */}
      <ConfirmSendModal
        open={savePromptOpen}
        title="Save contact"
        message={
          "Would you like to save Dan Donahue's contact to your device? This will download a vCard you can import to your Contacts app."
        }
        onConfirm={() => performSave()}
        onCancel={() => setSavePromptOpen(false)}
        confirmLabel="Save"
      />

      {/* Modal shown after download on Android to prompt the user to tap and install the contact */}
      <ConfirmSendModal
        open={installPromptOpen}
        title="Contact downloaded"
        message={
          "The contact has been downloaded. Tap Install Contact to open it in your Contacts app and add the contact, or open your Downloads app and tap the vCard file."
        }
        onConfirm={handleInstallContact}
        onCancel={() => setInstallPromptOpen(false)}
        confirmLabel="Install Contact"
      />

      {/* Modal to confirm sending the automated SMS */}
      <ConfirmSendModal
        open={modalOpen}
        title="Send automated message"
        message={
          "Contact saved to your device. Please add your name and email below so they can be included in the message to Dan Donahue."
        }
        onConfirm={handleConfirmSend}
        onCancel={handleCancelSend}
        confirmLabel="Send Message"
      >
        <div className="space-y-3">
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Your full name"
            className="w-full rounded-md px-2 py-1 text-black"
            aria-label="Your name"
          />
          <input
            type="email"
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
            placeholder="your@example.com"
            className="w-full rounded-md px-2 py-1 text-black"
            aria-label="Your email"
          />
        </div>
      </ConfirmSendModal>
    </>
  );
}
