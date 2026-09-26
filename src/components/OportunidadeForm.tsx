// Formulário de Oportunidade — CRM 5

import { useState, useEffect } from 'react'
import type { Oportunidade, Contato, Etapa, Prioridade } from '../types'
import { gerarId, salvarOportunidade, buscarOportunidade, listarContatos } from '../storage'

interface Props {
  oportunidadeId?: string
  onSalvar: () => void
  onCancelar: () => void
}

const ETAPAS: { valor: Etapa; rotulo: string }[] = [
  { valor: 'prospeccao', rotulo: 'Prospecção' },
  { valor: 'qualificacao', rotulo: 'Qualificação' },
  { valor: 'proposta', rotulo: 'Proposta' },
  { valor: 'negociacao', rotulo: 'Negociação' },
  { valor: 'fechado_ganho', rotulo: 'Fechado (Ganho)' },
  { valor: 'fechado_perdido', rotulo: 'Fechado (Perdido)' },
]

const PRIORIDADES: { valor: Prioridade; rotulo: string }[] = [
  { valor: 'baixa', rotulo: 'Baixa' },
  { valor: 'media', rotulo: 'Média' },
  { valor: 'alta', rotulo: 'Alta' },
]

export default function OportunidadeForm({ oportunidadeId, onSalvar, onCancelar }: Props) {
  const [titulo, setTitulo] = useState('')
  const [contatoId, setContatoId] = useState('')
  const [etapa, setEtapa] = useState<Etapa>('prospeccao')
  const [prioridade, setPrioridade] = useState<Prioridade>('media')
  const [followUp, setFollowUp] = useState('')
  const [proximaAcao, setProximaAcao] = useState('')
  const [contatos, setContatos] = useState<Contato[]>([])
  const [erro, setErro] = useState('')

  useEffect(() => {
    setContatos(listarContatos())

    if (oportunidadeId) {
      const oportunidade = buscarOportunidade(oportunidadeId)
      if (oportunidade) {
        setTitulo(oportunidade.titulo)
        setContatoId(oportunidade.contatoId)
        setEtapa(oportunidade.etapa)
        setPrioridade(oportunidade.prioridade)
        setFollowUp(oportunidade.followUp)
        setProximaAcao(oportunidade.proximaAcao)
      }
    }
  }, [oportunidadeId])

  function validar(): boolean {
    if (!titulo.trim()) {
      setErro('Título é obrigatório.')
      return false
    }
    if (!contatoId) {
      setErro('Selecione um contato.')
      return false
    }
    setErro('')
    return true
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validar()) return

    const oportunidade: Oportunidade = {
      id: oportunidadeId || gerarId(),
      titulo: titulo.trim(),
      contatoId,
      etapa,
      prioridade,
      followUp: followUp.trim(),
      proximaAcao: proximaAcao.trim(),
    }
    salvarOportunidade(oportunidade)
    onSalvar()
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{oportunidadeId ? 'Editar Oportunidade' : 'Nova Oportunidade'}</h2>

      {erro && <div className="erro">{erro}</div>}

      <label>
        Título *
        <input
          type="text"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          autoFocus
        />
      </label>

      <label>
        Contato *
        <select value={contatoId} onChange={e => setContatoId(e.target.value)}>
          <option value="">Selecione...</option>
          {contatos.map(c => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
      </label>

      <label>
        Etapa
        <select value={etapa} onChange={e => setEtapa(e.target.value as Etapa)}>
          {ETAPAS.map(e => (
            <option key={e.valor} value={e.valor}>{e.rotulo}</option>
          ))}
        </select>
      </label>

      <label>
        Prioridade
        <select value={prioridade} onChange={e => setPrioridade(e.target.value as Prioridade)}>
          {PRIORIDADES.map(p => (
            <option key={p.valor} value={p.valor}>{p.rotulo}</option>
          ))}
        </select>
      </label>

      <label>
        Follow-up
        <input
          type="date"
          value={followUp}
          onChange={e => setFollowUp(e.target.value)}
        />
      </label>

      <label>
        Próxima ação
        <input
          type="text"
          value={proximaAcao}
          onChange={e => setProximaAcao(e.target.value)}
          placeholder="Ex: Enviar proposta, Ligar para confirmar..."
        />
      </label>

      <div className="acoes">
        <button type="submit" className="btn-primario">
          Salvar
        </button>
        <button type="button" className="btn-secundario" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
