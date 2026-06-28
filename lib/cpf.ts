const CPF_LENGTH = 11;

/** CPFs com todos os dígitos iguais são inválidos pela Receita Federal. */
const INVALID_CPFS = new Set(
  Array.from({ length: 10 }, (_, d) => String(d).repeat(CPF_LENGTH))
);

export function stripCpf(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

/** Máscara XXX.XXX.XXX-XX enquanto o usuário digita. */
export function formatCpf(value: string): string {
  const digits = stripCpf(value).slice(0, CPF_LENGTH);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function calcCheckDigit(base: string, factor: number): number {
  let sum = 0;
  for (let i = 0; i < base.length; i++) {
    sum += parseInt(base[i], 10) * (factor - i);
  }
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

/** Valida formato e dígitos verificadores (módulo 11). */
export function isValidCpf(cpf: string): boolean {
  const digits = stripCpf(cpf);
  if (digits.length !== CPF_LENGTH) return false;
  if (INVALID_CPFS.has(digits)) return false;

  const base = digits.slice(0, 9);
  const d1 = calcCheckDigit(base, 10);
  const d2 = calcCheckDigit(base + String(d1), 11);
  return digits[9] === String(d1) && digits[10] === String(d2);
}
