/** Build a WhatsApp click-to-chat share URL (no API key needed). */
export function waShareUrl(text: string, phone?: string): string {
  const base = phone ? `https://wa.me/${phone.replace(/[^0-9]/g, '')}` : 'https://wa.me/';
  return `${base}?text=${encodeURIComponent(text)}`;
}
