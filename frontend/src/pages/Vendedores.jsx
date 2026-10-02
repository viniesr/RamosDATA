import { useState,useEffect, use } from "react"

function Vendedores(){

    const [telaInterna, setTelaInterna] = useState('lista')

    const [vendedores, setVendedores] = useState([])
    const [nome, setNome] = useState('')
    const [loja, setLoja] = useState('')
    const [status, setStatus] = useState("Ativo")
    const [idEditando,setIdEditando] = useState(null)

    useEffect(() => {
        if (telaInterna === 'lista') {
            fetch('http://127.0.0.1:8000/vendedores/')
            .then((resposta) => resposta.json())
            .then((dados) => setVendedores(dados))
        }
    },[telaInterna])

    function FormularioNovoVendedor(){
        setNome('')
        setLoja('')
        setStatus('Ativo')
        setIdEditando(null)
        setTelaInterna('formulario')
    }

    function FormularioEditarVendedor(vendedor){
        setNome(vendedor.nome)
        setLoja(vendedor.loja)
        setStatus(vendedor.status || 'Ativo')
        setIdEditando(vendedor.id)
        setTelaInterna('formulario')
    }

    function salvarVendedor(evento) {
        evento.preventDefault()

        const pacote = {nome, loja, status}

        if (idEditando !== null){
            fetch('http://127.0.0.1:8000/vendedores/' + idEditando, {
                method: 'PUT',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(pacote)
            }) .then (() => setTelaInterna('lista'))
        } else {
           fetch('http://127.0.0.1:8000/vendedores/', {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(pacote)
            }) .then (() => setTelaInterna('lista')) 
        }
    }

    function deletarVendedor(){
        const confirmou = window.confirm(`Tem certeza que deseja apagar permanentemente o funcionário ${nome}? Essa ação não poderá ser desfeita.`)

    if (confirmou) {
        fetch('http://127.0.0.1:8000/vendedores/' + idEditando, {
            method:'DELETE'
            }).then(() => setTelaInterna('lista'))
        }
    }

    return (
        <div>
            {telaInterna === 'lista' ? (
                <div>
                    <div>
                        <h2>Lista de Vendedores</h2>
                        <button onClick={FormularioNovoVendedor}>+ Cadastrar Vendedor</button>
                    </div>

                    <ul>
                        {vendedores.map((vendedor) => (
                            <li key={vendedor.id}>
                                <strong>Nome: {vendedor.nome}</strong> - Loja: {vendedor.loja}
                                <span> [{vendedor.status || 'Ativo'}] </span>

                                <button onClick={() => FormularioEditarVendedor(vendedor)}>
                                    Editar
                                </button>

                            </li>
                        ))}
                    </ul>
        </div>
            ) : (
                <div>
                    <h2>{idEditando ? 'Editando Vendedor' : 'Cadastrar novo Vendedor'}</h2>
    
        <form onSubmit={salvarVendedor}>
            <div>
            <input
                type="text"
                placeholder="Nome do vendedor"
                value={nome}
                onChange={(evento) => setNome(evento.target.value)}
                required
            />
            </div>

            <div>
            <input
                type="text"
                placeholder="Loja"
                value={loja}
                onChange={(evento) => setLoja(evento.target.value)}
                required
            />
            </div>
            
            {idEditando !== null && (
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
                
                {idEditando !== null &&(
                    <button type='button' onClick={deletarVendedor}>Excluir Registro Permanentemente</button>
                )}

                <button type="button" onClick={() => setTelaInterna('lista')}>Cancelar</button>
                </div>  
        </form>
    </div>
    )}
    </div>
    )          
}

export default Vendedores