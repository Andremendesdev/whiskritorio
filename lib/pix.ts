export const PIX_PAYMENT_TTL_SECONDS = 15 * 60;

export const PIX_KEY = process.env.NEXT_PUBLIC_PIX_KEY ?? "";
export const PIX_MERCHANT_NAME =
  process.env.NEXT_PUBLIC_PIX_MERCHANT_NAME ?? "Whiskritório";
export const PIX_MERCHANT_CITY =
  process.env.NEXT_PUBLIC_PIX_MERCHANT_CITY ?? "Brasil";

function emvField(id: string, value: string): string {
  const size = value.length.toString().padStart(2, "0");
  return `${id}${size}${value}`;
}

function crc16ccitt(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function sanitizePixText(value: string, maxLength: number): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim()
    .slice(0, maxLength);
}

export function generatePixTxId(): string {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SB${Date.now().toString(36).toUpperCase()}${random}`.slice(0, 25);
}

export function formatPixAmount(amount: number): string {
  return amount.toFixed(2);
}

export function buildPixCopyPasteCode(input: {
  key: string;
  merchantName: string;
  merchantCity: string;
  amount: number;
  txid: string;
}): string {
  const merchantAccount =
    emvField("00", "br.gov.bcb.pix") + emvField("01", input.key.trim());

  const additionalData = emvField("05", input.txid.slice(0, 25));

  const payload =
    emvField("00", "01") +
    emvField("26", merchantAccount) +
    emvField("52", "0000") +
    emvField("53", "986") +
    emvField("54", formatPixAmount(input.amount)) +
    emvField("58", "BR") +
    emvField("59", sanitizePixText(input.merchantName, 25)) +
    emvField("60", sanitizePixText(input.merchantCity, 15)) +
    emvField("62", additionalData) +
    "6304";

  return payload + crc16ccitt(payload);
}

export function createPixPaymentSession(amount: number): {
  code: string;
  txid: string;
  expiresAt: number;
} {
  const txid = generatePixTxId();
  const code = buildPixCopyPasteCode({
    key: PIX_KEY,
    merchantName: PIX_MERCHANT_NAME,
    merchantCity: PIX_MERCHANT_CITY,
    amount,
    txid,
  });

  return {
    code,
    txid,
    expiresAt: Date.now() + PIX_PAYMENT_TTL_SECONDS * 1000,
  };
}

export function formatCountdown(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
