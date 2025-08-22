// src/utils/br.ts
export const onlyDigits = (s: string) => (s || "").replace(/\D+/g, "");

export const isValidPhoneBR = (raw: string) => {
  const d = onlyDigits(raw);
  // 10 = fixo (DDD+8) | 11 = celular (DDD+9+8)
  return d.length === 10 || d.length === 11;
};

export const isValidCEP = (raw: string) => onlyDigits(raw).length === 8;

export function isValidCPF(raw: string) {
  const cpf = onlyDigits(raw);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let d1 = 11 - (sum % 11);
  if (d1 >= 10) d1 = 0;
  if (d1 !== parseInt(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  let d2 = 11 - (sum % 11);
  if (d2 >= 10) d2 = 0;
  return d2 === parseInt(cpf[10]);
}

export function isValidCNPJ(raw: string) {
  const cnpj = onlyDigits(raw);
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;
  const calc = (base: number) => {
    let sum = 0, pos = base - 7;
    for (let i = 0; i < base; i++) {
      sum += +cnpj[i] * pos--;
      if (pos < 2) pos = 9;
    }
    const r = sum % 11;
    return r < 2 ? 0 : 11 - r;
  };
  const d1 = calc(12);
  const d2 = calc(13);
  return d1 === +cnpj[12] && d2 === +cnpj[13];
}
