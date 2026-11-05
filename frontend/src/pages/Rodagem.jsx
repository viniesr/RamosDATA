import { useState, useEffect } from "react"

function Rodagem(){

    const [telaInterna, setTelaInterna] = useState('lista')

    const [rodagens, setRodagens] = useState([])
    const [veiculos, setVeiculos] = useState([])

    const [veiculoId, setVeiculoId] = useState('')
    const [semana, setSemana] = useState('')
    const [dataInicio, setDataInicio] = useState('')
    const [dataFim, setDataFim] = useState('')
    const [kmRodado, setKmRodado] = useState('')
    const [observacao, setObservacao] = useState('')
    const [idEditando, setIdEditando] = useState(null)

    useEffect(() => {
        fetch('http://127.0.0.1:8000/veiculos/')
        .then(resposta => resposta.json())
        .then(dados => setVeiculos(dados))

        if (telaInterna === 'lista') {
            fetch('http://127.0.0.1:8000/rodagens/')
            .then(resposta => resposta.json())
            .then(dados => setRodagens(dados))
        }
    }, [telaInterna])

    function FormularioNovaRodagem() {
        setVeiculoId('')
        setSemana('')
        setDataInicio('')
        setDataFim('')
        setKmRodado('')
        setObservacao('')
        setIdEditando(null)
        setTelaInterna('formulario')
    }

    function FormularioEditarRodagem(item) {
        setVeiculoId(item.veiculo_id)
        setSemana(item.semana || '')
        setDataInicio(item.data_inicio || '')
        setDataFim(item.data_fim || '')
        setKmRodado(item.km_rodado ?? '')
        setObservacao(item.observacao || '')
        setIdEditando(item.id)
        setTelaInterna('formulario')
    }

    function salvarRodagem(evento) {
        evento.preventDefault()

        const pacote = {
            veiculo_id: Number(veiculoId),
            semana: semana !== '' ? semana : null,
            data_inicio: dataInicio !== '' ? dataInicio : null,
            data_fim: dataFim !== '' ? dataFim : null,
            km_rodado: parseFloat(kmRodado),
            observacao: observacao !== '' ? observacao : null
        }

        const url = idEditando !== null 
            ? `http://127.0.0.1:8000/rodagens/${idEditando}`
            : 'http://127.0.0.1:8000/rodagens/'

        const metodo = idEditando !== null ? 'PUT' : 'POST'

        fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pacote)
        }).then(resposta => {
            if (resposta.ok) {
                setTelaInterna('lista')
            } else {
                alert("Erro ao salvar registro de rodagem.")
            }
        })
    }

    function deletarRodagem() {
        if (window.confirm("Deseja apagar este registro de rodagem?")) {
            fetch(`http://127.0.0.1:8000/rodagens/${idEditando}`, {
                method: 'DELETE'
            }).then(resposta => {
                if (resposta.ok) {
                    setTelaInterna('lista')
                } else {
                    alert("Erro ao excluir registro.")
                }
            })
        }
    }

    function obterVeiculo(id) {
        return veiculos.find(v => v.id === id)
    }

    return (
        <div>
            {telaInterna === 'lista' ? (
                <div>
                    <h2>Registro de Rodagem e Consumo (Frota)</h2>
                    <button onClick={FormularioNovaRodagem}>+ Registrar Rodagem</button>

                    <table>
                        <thead>
                            <tr>
                                <th>Veículo</th>
                                <th>Período / Semana</th>
                                <th>Datas</th>
                                <th>KM Rodado</th>
                                <th>Média (KM/L)</th>
                                <th>Litros Consumidos</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rodagens.map((item) => {
                                const veiculo = obterVeiculo(item.veiculo_id)
                                const media = veiculo?.km_por_litro
                                const litrosConsumidos = (media && media > 0) 
                                    ? (item.km_rodado / media).toFixed(2) 
                                    : '---'

                                return (
                                    <tr key={item.id}>
                                        <td>{veiculo ? `${veiculo.marca} ${veiculo.modelo}` : `Veículo #${item.veiculo_id}`}</td>
                                        <td>{item.semana || '---'}</td>
                                        <td>
                                            {item.data_inicio && item.data_fim 
                                                ? `${item.data_inicio.split('-').reverse().join('/')} a ${item.data_fim.split('-').reverse().join('/')}`
                                                : '---'}
                                        </td>
                                        <td>{item.km_rodado ? `${item.km_rodado} km` : '0 km'}</td>
                                        <td>{media ? `${media} km/l` : '---'}</td>
                                        <td>{litrosConsumidos !== '---' ? `${litrosConsumidos} L` : '---'}</td>
                                        <td>
                                            <button onClick={() => FormularioEditarRodagem(item)}>Editar</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>
                    <h2>{idEditando ? 'Editando Rodagem' : 'Nova Rodagem'}</h2>

                    <form onSubmit={salvarRodagem}>
                        <div>
                            <label>Veículo: </label>
                            <select value={veiculoId} onChange={(e) => setVeiculoId(e.target.value)} required>
                                <option value="">-- Selecione o Veículo --</option>
                                {veiculos.map(v => (
                                    <option key={v.id} value={v.id}>
                                        {v.marca} {v.modelo} ({v.placa || 'Sem Placa'})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Semana / Período: </label>
                            <input 
                                type="text" 
                                placeholder="Ex: Semana 1 (Outubro)" 
                                value={semana} 
                                onChange={(e) => setSemana(e.target.value)} 
                            />
                        </div>

                        <div>
                            <label>Data Início: </label>
                            <input 
                                type="date" 
                                value={dataInicio} 
                                onChange={(e) => setDataInicio(e.target.value)} 
                            />
                        </div>

                        <div>
                            <label>Data Fim: </label>
                            <input 
                                type="date" 
                                value={dataFim} 
                                onChange={(e) => setDataFim(e.target.value)} 
                            />
                        </div>

                        <div>
                            <label>KM Rodado (Rastreador): </label>
                            <input 
                                type="number" 
                                step="0.1" 
                                placeholder="Ex: 266.4" 
                                value={kmRodado} 
                                onChange={(e) => setKmRodado(e.target.value)} 
                                required 
                            />
                        </div>

                        <div>
                            <label>Observação: </label>
                            <input 
                                type="text" 
                                value={observacao} 
                                onChange={(e) => setObservacao(e.target.value)} 
                            />
                        </div>

                        <br />
                        <button type="submit">{idEditando ? 'Salvar Alterações' : 'Cadastrar'}</button>
                        {idEditando !== null && (
                            <button type="button" onClick={deletarRodagem}>Excluir Registro</button>
                        )}
                        <button type="button" onClick={() => setTelaInterna('lista')}>Cancelar</button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default Rodagem