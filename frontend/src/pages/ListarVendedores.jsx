import { useState, useEffect } from "react"

function ListarVendedores({navegarPara}) {
    const [vendedores, setVendedores] = useState([])

    useEffect(() => {
        fetch('http://127.0.0.1:8000/vendedores/')
        .then((resposta) => resposta.json())
        .then((dados) => setVendedores(dados))
    }, [])

    return (
        <div>
            <h1>Lista de Vendedores</h1>
            <ul>
                {vendedores.map((vendedor) => (
                    <li key={vendedor.id}>
                        ID {vendedor.id} : {vendedor.nome} - Loja: {vendedor.loja}
                        <button onClick={() => navegarPara('cadastrarVendedor', vendedor)} style={{marginLeft: '10px', color: 'blue'}}>
                            Editar
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ListarVendedores
