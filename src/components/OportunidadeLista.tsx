// Lista de Oportunidades — CRM 5

import type { Oportunidade, Contato, Etapa, Prioridade } from '../types'

interface Props {
  oportunidades: Oportunidade[]
  contatos: Contato[]
  filtroEtapa: string
  filtroPrioridade: string
  onFiltroEtapaChange: (valor: string) => void
  onFiltroPrioridadeChange: (valor: string) => void
  onEditar: (id: string) => void
  onAlterarEtapa: (id: string, etapa: Etapa) => void
  onAlterarPrioridade: (id: string, prioridade: Prioridade) => void
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

function formatarData(dataIso: string): string {
  if (!dataIso) return ''
  const [ano, mes, dia] = dataIso.split('-')
  return `${dia}/${mes}/${ano}`
}

export default function OportunidadeLista({
  oportunidades,
  contatos,
  filtroEtapa,
  filtroPrioridade,
  onFiltroEtapaChange,
  onFiltroPrioridadeChange,
  onEditar,
  onAlterarEtapa,
  onAlterarPrioridade,
}: Props) {
  function nomeContato(contatoId: string): string {
    const contato = contatos.find(c => c.id === contatoId)
    return contato ? contato.nome : '(contato removido)'
  }

  const oportunidadesFiltradas = oportunidades.filter(op => {
    if (filtroEtapa && op.etapa !== filtroEtapa) return false
    if (filtroPrioridade && op.prioridade !== filtroPrioridade) return false
    return true
  })

  return (
    <>
      <div className="filtros">
        <label>
          Etapa:
          <select value={filtroEtapa} onChange={e => onFiltroEtapaChange(e.target.value)}>
            <option value="">Todas</option>
            {ETAPAS.map(et => (
              <option key={et.valor} value={et.valor}>{et.rotulo}</option>
            ))}
          </select>
        </label>
        <label>
          Prioridade:
          <select value={filtroPrioridade} onChange={e => onFiltroPrioridadeChange(e.target.value)}>
            <option value="">Todas</option>
            {PRIORIDADES.map(p => (
              <option key={p.valor} value={p.valor}>{p.rotulo}</option>
            ))}
          </select>
        </label>
      </div>

      {oportunidadesFiltradas.length === 0 ? (
        <p className="vazio">
          {oportunidades.length === 0
            ? 'Nenhuma oportunidade cadastrada.'
            : 'Nenhuma oportunidade encontrada com os filtros selecionados.'}
        </p>
      ) : (
        <ul className="lista">
          {oportunidadesFiltradas.map(op => (
            <li key={op.id} className="lista-item lista-item-op">
              <div className="lista-info">
                <strong>{op.titulo}</strong>
                <span className="empresa">{nomeContato(op.contatoId)}</span>
                {(op.followUp || op.proximaAcao) && (
                  <span className="detalhes-extra">
                    {op.followUp && <span>Follow-up: {formatarData(op.followUp)}</span>}
                    {op.followUp && op.proximaAcao && <span> | </span>}
                    {op.proximaAcao && <span>Ação: {op.proximaAcao}</span>}
                  </span>
                )}
              </div>
              <div className="lista-controles">
                <select
                  className="select-inline"
                  value={op.etapa}
                  onChange={e => onAlterarEtapa(op.id, e.target.value as Etapa)}
                >
                  {ETAPAS.map(et => (
                    <option key={et.valor} value={et.valor}>{et.rotulo}</option>
                  ))}
                </select>
                <select
                  className={`select-inline prioridade-${op.prioridade}`}
                  value={op.prioridade}
                  onChange={e => onAlterarPrioridade(op.id, e.target.value as Prioridade)}
                >
                  {PRIORIDADES.map(p => (
                    <option key={p.valor} value={p.valor}>{p.rotulo}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn-secundario"
                  onClick={() => onEditar(op.id)}
                >
                  Editar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
