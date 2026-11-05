import { useState, useEffect } from "react"

function Abastecimentos() {
    const [telaInterna, setTelaInterna] = useState('lista')

    const [abastecimentos, setAbastecimentos] = useState([])
    const [veiculos, setVeiculos] = useState([])

    const [veiculoId, setVeiculoId] = useState('')
    const [data, setData] = useState(new Date().toISOString().split('T')[0])
    const [km, setKm] = useState('')
    const [tipoCombustivel, setTipoCombustivel] = useState('Diesel')
    const [valor, setValor] = useState('')
    const [litros, setLitros] = useState('')
    const [idEditando, setIdEditando] = useState(null)

    useEffect(() => {
        fetch('http://127.0.0.1:8000/veiculos/')
            .then((resposta) => resposta.json())
            .then((dados) => setVeiculos(dados))

        fetch('http://127.0.0.1:8000/abastecimentos/')
            .then((resposta) => resposta.json())
            .then((dados) => setAbastecimentos(dados))
    }, [telaInterna])

    function FormularioNovoAbastecimento(){
        setVeiculoId('')
        setData(new Date().toISOString().split('T')[0])
        setKm('')
        setTipoCombustivel('Diesel')
        setValor('')
        setLitros('')
        setIdEditando(null)
        setTelaInterna('formulario')
    }

    function FormularioEditarAbastecimento(abastecimento) {
        setVeiculoId(abastecimento.veiculo_id)
        setData(abastecimento.data || '')
        setKm(abastecimento.km ?? '')
        setTipoCombustivel(abastecimento.tipo_combustivel || 'Diesel')
        setValor(abastecimento.valor ?? '')
        setLitros(abastecimento.litros ?? '')
        setIdEditando(abastecimento.id)
        setTelaInterna('formulario')
    }

    function salvarAbastecimento(evento){
        evento.preventDefault()

        const pacote = {
            veiculo_id: Number(veiculoId),
            data: data,
            km: km !== '' ? Number(km) : null,
            tipo_combustivel: tipoCombustivel,
            valor: valor !== '' ? Number(valor) : null,
            litros: litros !== '' ? Number(litros) : null
        }

        if (idEditando !== null){
            fetch('http://127.0.0.1:8000/abastecimentos/' + idEditando, {
                method: 'PUT',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(pacote)
            }).then(() => setTelaInterna('lista'))
        } else {
            fetch('http://127.0.0.1:8000/abastecimentos/', {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(pacote)
            }).then(() => setTelaInterna('lista'))
        }
    }

    function deletarAbastecimento() {
        const confirmou = window.confirm("Tem certeza que deseja apagar este registro de abastecimento?")
        if (confirmou && idEditando !== null) {
            fetch('http://127.0.0.1:8000/abastecimentos/' + idEditando, {
                method: 'DELETE'
            }).then(() => setTelaInterna('lista'))
        }
    }

    return (
        <div>
            {telaInterna === 'lista' ? (
                <div>
                    <h2>Lista de Abastecimentos</h2>
                    <button onClick={FormularioNovoAbastecimento}>+ Registrar Abastecimento</button>
                    <br /><br />

                    {/* AGRUPAMENTO POR VEÍCULO */}
                    {veiculos.map(veiculo => {
                        const abastDoVeiculo = abastecimentos.filter(a => a.veiculo_id === veiculo.id)
                        
                        let totalValor = 0
                        let totalLitros = 0

                        return (
                            <div key={veiculo.id}>
                                <h3>{veiculo.marca} {veiculo.modelo}</h3>

                                {abastDoVeiculo.length === 0 ? (
                                    <p><em>Nenhum abastecimento registrado para este veículo.</em></p>
                                ) : (
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Data</th>
                                                <th>Km</th>
                                                <th>Combustível</th>
                                                <th>Valor Total</th>
                                                <th>Litros</th>
                                                <th>R$ / L</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {abastDoVeiculo.map((item) => {
                                                const v = item.valor ? Number(item.valor) : 0
                                                const l = item.litros ? Number(item.litros) : 0
                                                totalValor += v
                                                totalLitros += l

                                                return (
                                                    <tr key={item.id}>
                                                        <td>{item.data ? item.data.split('-').reverse().join('/') : '-'}</td>
                                                        <td>{item.km !== null ? item.km : '-'}</td>
                                                        <td>{item.tipo_combustivel}</td>
                                                        <td>{item.valor !== null ? `R$ ${v.toFixed(2).replace('.', ',')}` : '-'}</td>
                                                        <td>{item.litros !== null ? `${l} L` : '-'}</td>
                                                        <td>{v > 0 && l > 0 ? `R$ ${(v / l).toFixed(2).replace('.', ',')}` : '-'}</td>
                                                        <td>
                                                            <button onClick={() => FormularioEditarAbastecimento(item)}>Editar</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td><strong>TOTAL DO VEÍCULO</strong></td>
                                                <td>---</td>
                                                <td>---</td>
                                                <td><strong>R$ {totalValor.toFixed(2).replace('.', ',')}</strong></td>
                                                <td><strong>{totalLitros.toFixed(2)} L</strong></td>
                                                <td><strong>R$ {totalLitros > 0 ? (totalValor / totalLitros).toFixed(2).replace('.', ',') : '0,00'} / L</strong></td>
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
                    <h2>{idEditando ? 'Editando Abastecimento' : 'Novo Abastecimento'}</h2>

                    <form onSubmit={salvarAbastecimento}>
                        <div>
                            <label>Veículo: </label>
                            <select value={veiculoId} onChange={(evento) => setVeiculoId(evento.target.value)} required>
                                <option value="">-- Selecione o Veículo --</option>
                                {veiculos.map((veiculo) => (
                                    <option key={veiculo.id} value={veiculo.id}>
                                        {veiculo.marca} {veiculo.modelo}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Data: </label>
                            <input
                                type="date"
                                value={data}
                                onChange={(evento) => setData(evento.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label>KM Atual: </label>
                            <input
                                type="number"
                                placeholder="Ex: 365512"
                                value={km}
                                onChange={(evento) => setKm(evento.target.value)}
                            />
                        </div>

                        <div>
                            <label>Combustível: </label>
                            <select 
                                value={tipoCombustivel} 
                                onChange={(evento) => setTipoCombustivel(evento.target.value)}
                                required
                            >
                                <option value="">-- Selecione o Combustível --</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Gasolina">Gasolina</option>
                                <option value="Etanol">Etanol</option>
                            </select>
                        </div>

                        <div>
                            <label>Valor Total (R$): </label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Ex: 150.00"
                                value={valor}
                                onChange={(evento) => setValor(evento.target.value)}
                            />
                        </div>

                        <div>
                            <label>Litros: </label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Ex: 25.5"
                                value={litros}
                                onChange={(evento) => setLitros(evento.target.value)}
                            />
                        </div>

                        <br />
                        <button type="submit">{idEditando ? 'Salvar Alterações' : 'Cadastrar'}</button>
                        
                        {idEditando !== null && (
                            <button type="button" onClick={deletarAbastecimento}>Excluir Registro</button>
                        )}

                        <button type="button" onClick={() => setTelaInterna('lista')}>Cancelar</button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default Abastecimentos