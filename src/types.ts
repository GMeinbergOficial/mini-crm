// Modelo mínimo — CRM 1

export type Etapa =
  | 'prospeccao'
  | 'qualificacao'
  | 'proposta'
  | 'negociacao'
  | 'fechado_ganho'
  | 'fechado_perdido'

export type Prioridade = 'baixa' | 'media' | 'alta'

export interface Contato {
  id: string
  nome: string
  empresa: string
  email: string
  telefone: string
}

export interface Oportunidade {
  id: string
  titulo: string
  contatoId: string
  etapa: Etapa
  prioridade: Prioridade
  followUp: string
  proximaAcao: string
}
