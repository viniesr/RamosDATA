import { useState, useEffect } from 'react'

function ListarFuncionarios({ navegarPara }) {
  const [funcionarios, setFuncionarios] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/funcionarios/')
      .then((resposta) => resposta.json())
      .then((dados) => setFuncionarios(dados))
  }, [])

  return (
    <div>
      <h1>Lista de Funcionários</h1>
      <ul>
        {funcionarios.map((funcionario) => (
          <li key={funcionario.id}>
            ID {funcionario.id}: {funcionario.nome} - CPF: {funcionario.cpf}
            
            {/* Passamos o funcionário inteiro para a ponte no App.jsx */}
            <button onClick={() => navegarPara('cadastrarFuncionario', funcionario)} style={{ marginLeft: '10px', color: 'blue' }}>
              Editar
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ListarFuncionarios