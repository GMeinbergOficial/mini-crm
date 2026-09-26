// Formulário de Contato — CRM 2

import { useState, useEffect } from 'react'
import type { Contato } from '../types'
import { gerarId, salvarContato, buscarContato } from '../storage'

interface Props {
  contatoId?: string
  onSalvar: () => void
  onCancelar: () => void
}

export default function ContatoForm({ contatoId, onSalvar, onCancelar }: Props) {
  const [nome, setNome] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (contatoId) {
      const contato = buscarContato(contatoId)
      if (contato) {
        setNome(contato.nome)
        setEmpresa(contato.empresa)
        setEmail(contato.email)
        setTelefone(contato.telefone)
      }
    }
  }, [contatoId])

  function validar(): boolean {
    if (!nome.trim()) {
      setErro('Nome é obrigatório.')
      return false
    }
    if (!email.trim() && !telefone.trim()) {
      setErro('Informe e-mail ou telefone.')
      return false
    }
    setErro('')
    return true
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validar()) return

    const contato: Contato = {
      id: contatoId || gerarId(),
      nome: nome.trim(),
      empresa: empresa.trim(),
      email: email.trim(),
      telefone: telefone.trim(),
    }
    salvarContato(contato)
    onSalvar()
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{contatoId ? 'Editar Contato' : 'Novo Contato'}</h2>

      {erro && <div className="erro">{erro}</div>}

      <label>
        Nome *
        <input
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          autoFocus
        />
      </label>

      <label>
        Empresa
        <input
          type="text"
          value={empresa}
          onChange={e => setEmpresa(e.target.value)}
        />
      </label>

      <label>
        E-mail
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>

      <label>
        Telefone
        <input
          type="tel"
          value={telefone}
          onChange={e => setTelefone(e.target.value)}
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
