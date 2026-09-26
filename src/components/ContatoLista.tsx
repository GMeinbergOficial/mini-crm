// Lista de Contatos — CRM 2

import type { Contato } from '../types'

interface Props {
  contatos: Contato[]
  onEditar: (id: string) => void
}

export default function ContatoLista({ contatos, onEditar }: Props) {
  if (contatos.length === 0) {
    return <p className="vazio">Nenhum contato cadastrado.</p>
  }

  return (
    <ul className="lista">
      {contatos.map(contato => (
        <li key={contato.id} className="lista-item">
          <div className="lista-info">
            <strong>{contato.nome}</strong>
            {contato.empresa && <span className="empresa">{contato.empresa}</span>}
            <span className="detalhes">
              {contato.email && <span>{contato.email}</span>}
              {contato.email && contato.telefone && <span> | </span>}
              {contato.telefone && <span>{contato.telefone}</span>}
            </span>
          </div>
          <button
            type="button"
            className="btn-secundario"
            onClick={() => onEditar(contato.id)}
          >
            Editar
          </button>
        </li>
      ))}
    </ul>
  )
}
