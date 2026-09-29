import { useState, useEffect } from 'react'

function CadastrarFuncionario({ navegarPara, funcionarioEditando }) {
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [status, setStatus] = useState('Ativo')
  const [idEditando, setIdEditando] = useState(null)

  // Esse hook roda toda vez que a página abre. 
  // Ele preenche o formulário se vier dados de edição do App.jsx
  useEffect(() => {
    if (funcionarioEditando) {
      setNome(funcionarioEditando.nome)
      setCpf(funcionarioEditando.cpf)
      setStatus (funcionarioEditando.status || 'Ativo')
      setIdEditando(funcionarioEditando.id)
    }
  }, [funcionarioEditando])

  function salvarFuncionario(evento) {
    evento.preventDefault()

    const pacote = { nome: nome, cpf: cpf, status:status }

    if (idEditando !== null) {
      fetch('http://127.0.0.1:8000/funcionarios/' + idEditando, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pacote)
      }).then(() => {
        navegarPara('listarFuncionario') // Salva e volta pra lista
      })
    } else {
      fetch('http://127.0.0.1:8000/funcionarios/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pacote)
      }).then(() => {
        navegarPara('listarFuncionario') // Salva e volta pra lista
      })
    }
  }

function deletarRegistroDefinitivo(){
  const confirmou = window.confirm(`Tem certeza que deseja apagar permanentemente o funcionário ${nome}? Essa ação não poderá ser desfeita.`)

  if (confirmou) {
      fetch('http://127.0.0.1:8000/funcionarios/' + idEditando, {
        method: 'DELETE'
      }).then(() => {
        navegarPara('listarFuncionario')
      })
    }
  }

  return (
    <div>
      <h1>{idEditando ? 'Editando Funcionário' : 'Cadastrar Novo Funcionário'}</h1>

      <form onSubmit={salvarFuncionario}>
        <input 
          type="text" 
          placeholder="Nome do funcionário" 
          value={nome} 
          onChange={(evento) => setNome(evento.target.value)} 
        />

        <input 
          type="text" 
          placeholder="CPF" 
          value={cpf} 
          onChange={(evento) => setCpf(evento.target.value)} 
        />
        {idEditando && (
        <>
        <label>Status:</label>
        <select value={status} onChange={(evento) => setStatus(evento.target.value)}>
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>
        </>
        )}

        <div><button type="submit">
          {idEditando ? 'Salvar Alterações' : 'Cadastrar'}
        </button>

        {idEditando &&(
        <button type='button' onClick={deletarRegistroDefinitivo}>Excluir Registro Permanentemente</button>
        )}
        </div>

      </form>
    </div>

        
  )
}

export default CadastrarFuncionario