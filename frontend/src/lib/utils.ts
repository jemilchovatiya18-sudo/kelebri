// WhatsApp utility
export const getWhatsAppUrl = (
  phone: string,
  productName: string,
  sku: string,
  productLink: string
): string => {
  const message = `Hello Kelebri! 💎\n\nI'm interested in this product:\n\n*${productName}*\nSKU: ${sku}\nLink: ${productLink}\n\nPlease share more details.`;
  return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
};

// General WhatsApp contact
export const getWhatsAppContactUrl = (phone: string, message?: string): string => {
  const text = message || 'Hello Kelebri! 💎 I\'d like to know more about your jewelry collection.';
  return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
};

// Format price
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

// Get primary image
export const getPrimaryImage = (images: { url: string; isPrimary: boolean }[]): string => {
  if (!images || images.length === 0) return '/placeholder-jewelry.jpg';
  const primary = images.find((img) => img.isPrimary);
  return primary ? primary.url : images[0].url;
};

// Label maps
export const DIAMOND_TYPE_LABELS: Record<string, string> = {
  LAB_GROWN: 'Lab Grown Diamond',
  NATURAL: 'Natural Diamond',
  MOISSANITE: 'Moissanite',
  NONE: '—',
};

export const METAL_TYPE_LABELS: Record<string, string> = {
  GOLD: 'Gold',
  WHITE_GOLD: 'White Gold',
  ROSE_GOLD: 'Rose Gold',
  SILVER: 'Silver',
  PLATINUM: 'Platinum',
};

export const GOLD_PURITY_LABELS: Record<string, string> = {
  K14: '14K',
  K18: '18K',
  K22: '22K',
  K24: '24K',
  NONE: '—',
};

export const CERTIFICATE_LABELS: Record<string, string> = {
  GIA: 'GIA',
  IGI: 'IGI',
  SGL: 'SGL',
  HRD: 'HRD',
  NONE: 'None',
};

// Truncate text
export const truncate = (text: string, length: number): string =>
  text.length > length ? text.slice(0, length) + '…' : text;
