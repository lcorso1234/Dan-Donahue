'use client';

type SaveContactButtonProps = {
  className?: string;
};

const CONTACT_NOTE = 'When electricity comes through, get out of the way.';

export function SaveContactButton({ className = '' }: SaveContactButtonProps) {
  const handleSave = () => {
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
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      className={`save-button ${className}`}
      onClick={handleSave}
      aria-label="Save Dan Donahue's contact info"
    >
      <span className="text-base tracking-[0.55em] text-neon">Save Contact</span>
    </button>
  );
}
