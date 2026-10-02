import {useState, useEffect} from 'react'

function CadastrarVendedor({navegarPara, vendedorEditando}) {
    const [nome, setNome] = useState('')
    const [loja, setLoja] = useState('')
    const [status, setStatus] = useState('Ativo')
    const [idEditando, setIdEditando] = useState(null)

useEffect(() => {
    if(vendedorEditando) {
        setNome(vendedorEditando.nome)
        setLoja(vendedorEditando.loja)
        setStatus(vendedorEditando.status || 'Ativo')
        setIdEditando(vendedorEditando.id)
    }
}, [vendedorEditando])

function salvarVendedor(evento){
    evento.preventDefault()

    const pacote = {nome: nome, loja: loja, status: status}

    if (idEditando !== null){
        fetch('http://127.0.0.1:8000/vendedores/' + idEditando, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(pacote)
        }).then(() => {
            navegarPara('listarVendedor')
        })
    } else {
        fetch('http://127.0.0.1:8000/vendedores/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(pacote)
        }).then(() => {
            navegarPara('listarVendedor')
        })
    }
}

function deletarRegistroDefinitivo() {

    const confirmou = window.confirm(`Tem certeza que deseja apagar permanentemente o funcionário ${nome}? Essa ação não poderá ser desfeita.`)

    if (confirmou) {
        fetch('http://127.0.0.1:8000/vendedores/' + idEditando, {
            method:'DELETE'
        }).then(() => {
            navegarPara('listarVendedor')
        })
    }
}

return (
    <div>
        <h1>{idEditando ? 'Editando Vendedor' : 'Cadastrar novo Vendedor'}</h1>
    
        <form onSubmit={salvarVendedor}>
            <input
                type="text"
                placeholder="Nome do vendedor"
                value={nome}
                onChange={(evento) => setNome(evento.target.value)}
            />

            <input
                type="text"
                placeholder="Loja"
                value={loja}
                onChange={(evento) => setLoja(evento.target.value)}
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

export default CadastrarVendedor
