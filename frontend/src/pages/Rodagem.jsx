import { useState, useEffect } from "react"

function Rodagem(){

    const [telaInterna, setTelaInterna] = useState('lista')

    const [rodagens, setRodagens] = useState([])
    const [veiculos, setVeiculos] = useState([])
    const [abastecimentos, setAbastecimentos] = useState([])

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

        fetch('http://127.0.0.1:8000/abastecimentos/')
            .then(resposta => resposta.json())
            .then(dados => setAbastecimentos(dados))

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

    return (
        <div>
            {telaInterna === 'lista' ? (
                <div>
                    <h2>Registro de Rodagem e Consumo (Frota)</h2>
                    <button onClick={FormularioNovaRodagem}>+ Registrar Rodagem</button>
                    <br /><br />

                    {/* AGRUPAMENTO NATIVO POR VEÍCULO */}
                    {veiculos.map(veiculo => {
                        const rodagensDoVeiculo = rodagens.filter(r => r.veiculo_id === veiculo.id)
                        const media = veiculo.km_por_litro || 0

                        const abastVeiculo = abastecimentos.filter(a => a.veiculo_id === veiculo.id && a.valor && a.litros)
                        const totalValorAbast = abastVeiculo.reduce((soma, a) => soma + Number(a.valor), 0)
                        const totalLitrosAbast = abastVeiculo.reduce((soma, a) => soma + Number(a.litros), 0)
                        const pmComb = totalLitrosAbast > 0 ? (totalValorAbast / totalLitrosAbast) : 0

                        let totalKm = 0
                        let totalLitros = 0
                        let totalCusto = 0

                        return (
                            <div key={veiculo.id}>
                                <h3>
                                    {veiculo.marca} {veiculo.modelo} 
                                    | Autonomia: {media > 0 ? `${media} km/l` : '---'} 
                                    | PMC: {pmComb > 0 ? `R$ ${pmComb.toFixed(2).replace('.', ',')}` : '---'}
                                </h3>

                                {rodagensDoVeiculo.length === 0 ? (
                                    <p><em>Nenhuma rodagem registrada para este veículo.</em></p>
                                ) : (
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Período / Semana</th>
                                                <th>Datas</th>
                                                <th>KM Rodado</th>
                                                <th>Litros Consumidos</th>
                                                <th>Custo Semanal (R$)</th>
                                                <th>Custo / KM</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rodagensDoVeiculo.map(item => {
                                                const km = item.km_rodado || 0
                                                const litros = media > 0 ? (km / media) : 0
                                                const custo = (litros > 0 && pmComb > 0) ? (litros * pmComb) : 0
                                                const custoKm = km > 0 && custo > 0 ? (custo / km) : 0

                                                totalKm += km
                                                totalLitros += litros
                                                totalCusto += custo

                                                return (
                                                    <tr key={item.id}>
                                                        <td>{item.semana || '---'}</td>
                                                        <td>
                                                            {item.data_inicio && item.data_fim 
                                                                ? `${item.data_inicio.split('-').reverse().join('/')} a ${item.data_fim.split('-').reverse().join('/')}`
                                                                : '---'}
                                                        </td>
                                                        <td>{km ? `${km} km` : '0 km'}</td>
                                                        <td>{litros > 0 ? `${litros.toFixed(2)} L` : '---'}</td>
                                                        <td>{custo > 0 ? `R$ ${custo.toFixed(2).replace('.', ',')}` : '---'}</td>
                                                        <td>{custoKm > 0 ? `R$ ${custoKm.toFixed(2).replace('.', ',')}` : '---'}</td>
                                                        <td>
                                                            <button onClick={() => FormularioEditarRodagem(item)}>Editar</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td><strong>TOTAL / MÉDIA DO VEÍCULO</strong></td>
                                                <td>---</td>
                                                <td><strong>{totalKm.toFixed(1)} km</strong></td>
                                                <td><strong>{totalLitros.toFixed(2)} L</strong></td>
                                                <td><strong>R$ {totalCusto.toFixed(2).replace('.', ',')}</strong></td>
                                                <td><strong>R$ {totalKm > 0 ? (totalCusto / totalKm).toFixed(2).replace('.', ',') : '0,00'} / km</strong></td>
                                                <td>---</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                )}
                                <hr />
                            </div>
                        )
                    })}
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