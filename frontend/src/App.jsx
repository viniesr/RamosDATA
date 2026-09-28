import { useState, useEffect } from 'react'

function App() {
  const [motoristas, setMotoristas] = useState([])

  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')

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

  console.log("O Pacote está pronto para envio:", pacote)

  fetch('http://127.0.0.1:8000/motoristas/', {
    method:'POST',
    headers: { 'Content-Type' :  'application/json'},
    body: JSON.stringify(pacote)
  })

  .then((resposta) => resposta.json())
  .then((motoristaSalvo) => {
    setMotoristas([...motoristas, motoristaSalvo])
    setNome('')
    setCpf('')
  })
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

return (
    <div>
      <h1>RamosDATA - Motoristas</h1>

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

        <button type="submit">Cadastrar</button>

      </form>

      <hr />

      <ul>
        {motoristas.map((motorista) => (
          <li key={motorista.id}>
            ID {motorista.id}: {motorista.nome} - CPF: {motorista.cpf}

            <button onClick={() => deletarMotorista(motorista.id)}>Excluir</button>

          </li>
        ))}
      </ul>
    </div>
  )
}

export default App