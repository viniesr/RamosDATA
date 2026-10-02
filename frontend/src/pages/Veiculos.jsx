import { useState,useEffect } from "react"

function Veiculos(){

    const [telaInterna, setTelaInterna] = useState('lista')

    const [veiculos, setVeiculos] = useState([])
    const [placa, setPlaca] = useState('')
    const [marca, setMarca] = useState('')
    const [modelo, setModelo] = useState('')
    const [status, setStatus] = useState('Ativo')
    const [idEditando, setIdEditando] = useState(null)

    useEffect(() => {
        if (telaInterna === 'lista') {
            fetch('http://127.0.0.1:8000/veiculos/')
            .then((resposta) => resposta.json())
            .then((dados) => setVeiculos(dados))
        }
    },[telaInterna])

    function FormularioNovoVeiculo(){
        setPlaca('')
        setMarca('')
        setModelo('')
        setStatus('Ativo')
        setIdEditando(null)
        setTelaInterna('formulario')
    }

    function FormularioEditarVeiculo(veiculo) {
        setPlaca(veiculo.placa)
        setMarca(veiculo.marca)
        setModelo(veiculo.modelo)
        setStatus(veiculo.status)
        setIdEditando(veiculo.id)
        setTelaInterna('formulario')
    }

    function salvarVeiculo(evento) {
        evento.preventDefault()

        const pacote = {placa, marca, modelo, status}

        if (idEditando !== null){
            fetch('http://127.0.0.1:8000/veiculos/' + idEditando, {
                method: 'PUT',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(pacote)
            }) .then(() => setTelaInterna('lista'))
        } else {
            fetch('http://127.0.0.1:8000/veiculos/', {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(pacote)
            }) .then(() => setTelaInterna('lista'))
        }
    }

    function deletarVeiculo() {
        const confirmou = window.confirm(`Deseja apagar permanentemente o veículo de placa ${placa}?`)
        if (confirmou) {
            fetch('http://127.0.0.1:8000/veiculos/' + idEditando, {
                method: 'DELETE'
            }).then(() => setTelaInterna('lista'))
        }
    }

    return (
        <div>
            {telaInterna === 'lista' ? (
                <div>
                    <div>
                        <h2>Lista de veículos</h2>
                        <button onClick={FormularioNovoVeiculo}>+ Cadastrar Veículo</button>
                    </div>
                    
                    <ul>
                        {veiculos.map((veiculo) => (
                            <li key={veiculo.id}>
                                <strong>Placa: {veiculo.placa}</strong>
                                - {veiculo.marca} {veiculo.modelo}

                                <span>
                                    [{veiculo.status}]
                                </span>

                                <button onClick={() => FormularioEditarVeiculo(veiculo)}>
                                    Editar
                                </button>

                            </li>
                        ))}
                    </ul>
        </div>

                    ) : (

        <div>
            <h2>{idEditando ? 'Editando Veículo' : 'Novo Veículo'}</h2>

            <form onSubmit={salvarVeiculo}>
                <div>
                    <input
                        type="text"
                        placeholder="Placa (Ex: ABC-1234)"
                        value={placa}
                        onChange={(evento) => setPlaca(evento.target.value)}
                        required
                    />
                </div>

                <div>
                    <input
                        type="text"
                        placeholder="Marca (Ex: Ford, Fiat)"
                        value={marca}
                        onChange={(evento) => setMarca(evento.target.value)}
                        required
                    />
                </div>

                <div>
                    <input
                        type="text"
                        placeholder="Modelo (Ex: F-4000, Strada)"
                        value={modelo}
                        onChange={(evento) => setModelo(evento.target.value)}
                        required
                    />
                </div>

                {idEditando !== null && (
                    <div>
                        <label>Status:</label>
                        <select value={status} onChange={(evento) => setStatus(evento.target.value)}>
                            <option value="Ativo">Ativo</option>
                            <option value="Inativo">Inativo</option>
                            <option value="Manutenção">Em manutenção</option>
                        </select>
                    </div>
                )}

                <div>
                    <button type="submit">
                        {idEditando ? 'Salvar Alterações' : 'Cadastrar'}
                    </button>

                    {idEditando !== null && (
                        <button type="button" onClick={deletarVeiculo}>Excluir Veículo</button>
                    )}

                    <button type="button" onClick={() => setTelaInterna('lista')}>Cancelar</button>
                </div>
            </form>
        </div>
    )}
</div>
    )
}


export default Veiculos
