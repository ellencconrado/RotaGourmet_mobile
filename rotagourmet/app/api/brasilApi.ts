export async function getEstados() {
  const res = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
  if (!res.ok) throw new Error("Erro ao buscar estados");
  const data = await res.json();
  return data.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
}

export async function getMunicipios(siglaUF: string) {
  const res = await fetch(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${siglaUF}/municipios`
  );
  if (!res.ok) throw new Error("Erro ao buscar municípios");
  const data = await res.json();
  return data.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
}

export async function getEnderecoByCep(cep: string) {
  const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  if (!res.ok) throw new Error("Erro ao buscar CEP");
  const data = await res.json();
  if (data.erro) throw new Error("CEP não encontrado");
  return data;
}

export async function getEmpresaByCnpj(cnpj: string) {
  const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
  if (!res.ok) throw new Error("Erro ao buscar CNPJ");
  return await res.json();
}