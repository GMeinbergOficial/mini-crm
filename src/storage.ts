// Persistência em localStorage — CRM 2

import type { Contato, Oportunidade } from './types'

const STORAGE_KEY = 'minicrm:v1'

interface Dados {
  contatos: Contato[]
  oportunidades: Oportunidade[]
}

function carregarDados(): Dados {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { contatos: [], oportunidades: [] }
    return JSON.parse(raw)
  } catch {
    return { contatos: [], oportunidades: [] }
  }
}

function salvarDados(dados: Dados): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dados))
}

export function gerarId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

// Contatos

export function listarContatos(): Contato[] {
  return carregarDados().contatos
}

export function buscarContato(id: string): Contato | undefined {
  return carregarDados().contatos.find(c => c.id === id)
}

export function salvarContato(contato: Contato): void {
  const dados = carregarDados()
  const idx = dados.contatos.findIndex(c => c.id === contato.id)
  if (idx >= 0) {
    dados.contatos[idx] = contato
  } else {
    dados.contatos.push(contato)
  }
  salvarDados(dados)
}

export function removerContato(id: string): void {
  const dados = carregarDados()
  dados.contatos = dados.contatos.filter(c => c.id !== id)
  salvarDados(dados)
}

// Oportunidades (preparado para CRM 3)

export function listarOportunidades(): Oportunidade[] {
  return carregarDados().oportunidades
}

export function buscarOportunidade(id: string): Oportunidade | undefined {
  return carregarDados().oportunidades.find(o => o.id === id)
}

export function salvarOportunidade(oportunidade: Oportunidade): void {
  const dados = carregarDados()
  const idx = dados.oportunidades.findIndex(o => o.id === oportunidade.id)
  if (idx >= 0) {
    dados.oportunidades[idx] = oportunidade
  } else {
    dados.oportunidades.push(oportunidade)
  }
  salvarDados(dados)
}

export function removerOportunidade(id: string): void {
  const dados = carregarDados()
  dados.oportunidades = dados.oportunidades.filter(o => o.id !== id)
  salvarDados(dados)
}
