import { useState, useEffect } from 'react'

function App() {
  const [motoristas, setMotoristas] = useState([])

  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')

  const [idEditando, setIdEditando] = useState(null)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/motoristas/')
      .then((resposta) => resposta.json())
      .then((dados) => setMotoristas(dados))
  }, [])

function salvarMotorista(evento) {
    evento.preventDefault()

    const pacote = {
      nome: nome,
      cpf: cpf
    }

    // SE a gaveta idEditando tiver um número, nós vamos ATUALIZAR (PUT)
    if (idEditando !== null) {
      fetch('http://127.0.0.1:8000/motoristas/' + idEditando, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pacote)
      })
        .then((resposta) => resposta.json())
        .then((motoristaAtualizado) => {
          // Substitui o motorista antigo na lista pelo atualizado
          const listaAtualizada = motoristas.map((m) => 
            m.id === idEditando ? motoristaAtualizado : m
          )
          setMotoristas(listaAtualizada)
          setNome('')
          setCpf('')
          setIdEditando(null) // Limpa a gaveta de edição para voltar ao modo normal
        })
    } 
    // SENÃO (se a gaveta estiver vazia), criamos um novo (POST, como já fazíamos)
    else {
      fetch('http://127.0.0.1:8000/motoristas/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pacote)
      })
        .then((resposta) => resposta.json())
        .then((motoristaSalvo) => {
          setMotoristas([...motoristas, motoristaSalvo])
          setNome('')
          setCpf('')
        })
    }
  }

function deletarMotorista(idDelete){

fetch('http://127.0.0.1:8000/motoristas/' + idDelete, {
  method:'DELETE'
})
.then(() => {
  const listaAtualizada = motoristas.filter((motorista) => motorista.id !== idDelete)

  setMotoristas(listaAtualizada)
})

}

function prepararEdicao(motorista) {
    setIdEditando(motorista.id)
    setNome(motorista.nome)
    setCpf(motorista.cpf)
  }

return (
    <div>
      {/* O título muda dependendo se a gaveta idEditando tem algo ou não */}
      <h1>
        {idEditando ? 'Editando Motorista...' : 'RamosDATA - Motoristas'}
      </h1>

      <form onSubmit={salvarMotorista}>
        <input 
          type="text" 
          placeholder="Nome do motorista" 
          value={nome} 
          onChange={(evento) => setNome(evento.target.value)} 
        />

        <input 
          type="text" 
          placeholder="CPF" 
          value={cpf} 
          onChange={(evento) => setCpf(evento.target.value)} 
        />

        <button type="submit">
          {idEditando ? 'Salvar Alterações' : 'Cadastrar Novo'}
        </button>
      </form>

      <hr />

      <ul>
        {motoristas.map((motorista) => (
          <li key={motorista.id}>
            ID {motorista.id}: {motorista.nome} - CPF: {motorista.cpf}
            
            {/* O botão de Editar chama a nossa função nova */}
            <button onClick={() => prepararEdicao(motorista)} style={{ marginLeft: '10px', color: 'blue' }}>
              Editar
            </button>

            <button onClick={() => deletarMotorista(motorista.id)} style={{ marginLeft: '10px', color: 'red' }}>
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App