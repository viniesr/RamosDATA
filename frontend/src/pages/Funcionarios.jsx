import { useState,useEffect, use } from "react"

function Funcionarios(){

    const [telaInterna, setTelaInterna] = useState('lista')

    const [funcionarios, setFuncionarios] = useState([])
    const [nome, setNome] = useState('')
    const [cpf, setCpf] = useState('')
    const [status, setStatus] = useState('Ativo')
    const [idEditando, setIdEditando] = useState(null)

    useEffect(() => {
        if (telaInterna === 'lista') {
            fetch('http://127.0.0.1:8000/funcionarios/')
            .then((resposta) => resposta.json())
            .then((dados) => setFuncionarios(dados))
        }
    },[telaInterna])

    function FormularioNovoFuncionario(){
        setNome('')
        setCpf('')
        setStatus('Ativo')
        setIdEditando(null)
        setTelaInterna('formulario')
    }

    function FormularioEditarFuncionario(funcionario){
        setNome(funcionario.nome)
        setCpf(funcionario.cpf)
        setStatus(funcionario.status || 'Ativo')
        setIdEditando(funcionario.id)
        setTelaInterna('formulario')
    }

    function salvarFuncionario(evento) {
        evento.preventDefault()

        const pacote = { nome, cpf, status }

        if (idEditando !== null) {
            fetch('http://127.0.0.1:8000/funcionarios/' + idEditando, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pacote)
            }).then(() => setTelaInterna('lista'))
        } else {
           fetch('http://127.0.0.1:8000/funcionarios/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pacote)
            }).then(() => setTelaInterna('lista')) 
        }
    }

    function deletarFuncionario() {
        const confirmou = window.confirm(`Tem certeza que deseja apagar permanentemente o funcionário ${nome}? Essa ação não poderá ser desfeita.`)

        if (confirmou) {
            fetch('http://127.0.0.1:8000/funcionarios/' + idEditando, {
                method: 'DELETE'
            }).then(() => setTelaInterna('lista'))
        }
    }

    return(
        <div>
            {telaInterna === 'lista' ? (
                <div>
                    <div>
                        <h2>Lista de Funcionários</h2>
                        <button onClick={FormularioNovoFuncionario}>+ Cadastrar Funcionário</button>
                        </div>

                        <ul>
                            {funcionarios.map((funcionario) => (
                                <li key={funcionario.id}>
                                    <strong>Nome: {funcionario.nome}</strong> - CPF: {funcionario.cpf}
                                    <span> [{funcionario.status || 'Ativo'}] </span>

                                    <button onClick={() => FormularioEditarFuncionario(funcionario)}>
                                        Editar
                                    </button>
                                </li>
                            ))}
                            </ul>
                            </div>
                            
                        ) : (
                            <div>
                                <h2>{idEditando ? 'Editando Funcionário' : 'Cadastrar novo Funcionário'}</h2>

                        <form onSubmit={salvarFuncionario}>
                            <div>
        <input 
          type="text" 
          placeholder="Nome do funcionário" 
          value={nome} 
          onChange={(evento) => setNome(evento.target.value)}
          required
        />
        </div>
        
        <div>
        <input 
          type="text" 
          placeholder="CPF" 
          value={cpf} 
          onChange={(evento) => setCpf(evento.target.value)} 
          required
        />
        </div>

        {idEditando !==null && (
        <div>
        <label>Status:</label>
        <select value={status} onChange={(evento) => setStatus(evento.target.value)}>
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>
        </div>
        )}

        <div><button type="submit">
          {idEditando ? 'Salvar Alterações' : 'Cadastrar'}
        </button>

        {idEditando !==null &&(
        <button type='button' onClick={deletarFuncionario}>Excluir Registro Permanentemente</button>
        )}

        <button type="button" onClick={() => setTelaInterna('lista')}>Cancelar</button>
        </div>

      </form>
    </div>
            )}
        </div>
    )

}

export default Funcionarios