// App principal — CRM 5

import { useState, useEffect } from 'react'
import { listarContatos, listarOportunidades, buscarOportunidade, salvarOportunidade } from './storage'
import type { Contato, Oportunidade, Etapa, Prioridade } from './types'
import ContatoForm from './components/ContatoForm'
import ContatoLista from './components/ContatoLista'
import OportunidadeForm from './components/OportunidadeForm'
import OportunidadeLista from './components/OportunidadeLista'

type Secao = 'contatos' | 'oportunidades'
type Tela = 'lista' | 'form'

export default function App() {
  const [secao, setSecao] = useState<Secao>('contatos')
  const [tela, setTela] = useState<Tela>('lista')
  const [contatos, setContatos] = useState<Contato[]>([])
  const [oportunidades, setOportunidades] = useState<Oportunidade[]>([])
  const [contatoEditando, setContatoEditando] = useState<string | undefined>()
  const [oportunidadeEditando, setOportunidadeEditando] = useState<string | undefined>()
  const [filtroEtapa, setFiltroEtapa] = useState('')
  const [filtroPrioridade, setFiltroPrioridade] = useState('')

  function atualizarDados() {
    setContatos(listarContatos())
    setOportunidades(listarOportunidades())
  }

  useEffect(() => {
    atualizarDados()
  }, [])

  function mudarSecao(nova: Secao) {
    setSecao(nova)
    setTela('lista')
    setContatoEditando(undefined)
    setOportunidadeEditando(undefined)
    atualizarDados()
  }

  function abrirNovoContato() {
    setContatoEditando(undefined)
    setTela('form')
  }

  function abrirEdicaoContato(id: string) {
    setContatoEditando(id)
    setTela('form')
  }

  function abrirNovaOportunidade() {
    setOportunidadeEditando(undefined)
    setTela('form')
  }

  function abrirEdicaoOportunidade(id: string) {
    setOportunidadeEditando(id)
    setTela('form')
  }

  function voltarParaLista() {
    setContatoEditando(undefined)
    setOportunidadeEditando(undefined)
    setTela('lista')
    atualizarDados()
  }

  function alterarEtapa(id: string, etapa: Etapa) {
    const op = buscarOportunidade(id)
    if (op) {
      salvarOportunidade({ ...op, etapa })
      atualizarDados()
    }
  }

  function alterarPrioridade(id: string, prioridade: Prioridade) {
    const op = buscarOportunidade(id)
    if (op) {
      salvarOportunidade({ ...op, prioridade })
      atualizarDados()
    }
  }

  return (
    <main className="shell">
      <div className="eyebrow">Mini CRM</div>

      <nav className="nav">
        <button
          type="button"
          className={secao === 'contatos' ? 'nav-ativo' : ''}
          onClick={() => mudarSecao('contatos')}
        >
          Contatos
        </button>
        <button
          type="button"
          className={secao === 'oportunidades' ? 'nav-ativo' : ''}
          onClick={() => mudarSecao('oportunidades')}
        >
          Oportunidades
        </button>
      </nav>

      {secao === 'contatos' && (
        <>
          <h1>Contatos</h1>
          {tela === 'lista' && (
            <>
              <button type="button" className="btn-primario" onClick={abrirNovoContato}>
                Novo Contato
              </button>
              <ContatoLista contatos={contatos} onEditar={abrirEdicaoContato} />
            </>
          )}
          {tela === 'form' && (
            <ContatoForm
              contatoId={contatoEditando}
              onSalvar={voltarParaLista}
              onCancelar={voltarParaLista}
            />
          )}
        </>
      )}

      {secao === 'oportunidades' && (
        <>
          <h1>Oportunidades</h1>
          {tela === 'lista' && (
            <>
              <button type="button" className="btn-primario" onClick={abrirNovaOportunidade}>
                Nova Oportunidade
              </button>
              <OportunidadeLista
                oportunidades={oportunidades}
                contatos={contatos}
                filtroEtapa={filtroEtapa}
                filtroPrioridade={filtroPrioridade}
                onFiltroEtapaChange={setFiltroEtapa}
                onFiltroPrioridadeChange={setFiltroPrioridade}
                onEditar={abrirEdicaoOportunidade}
                onAlterarEtapa={alterarEtapa}
                onAlterarPrioridade={alterarPrioridade}
              />
            </>
          )}
          {tela === 'form' && (
            <OportunidadeForm
              oportunidadeId={oportunidadeEditando}
              onSalvar={voltarParaLista}
              onCancelar={voltarParaLista}
            />
          )}
        </>
      )}
    </main>
  )
}
