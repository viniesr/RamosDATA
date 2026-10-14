import { useState, useEffect } from "react"

function Infracoes() {
    const [telaInterna, setTelaInterna] = useState('lista')

    const [infracoes, setInfracoes] = useState([])
    const [veiculos, setVeiculos] = useState([])
    const [funcionarios, setFuncionarios] = useState([])

    // Campos do formulário
    const [veiculoId, setVeiculoId] = useState('')
    const [funcionarioId, setFuncionarioId] = useState('')
    const [infracaoText, setInfracaoText] = useState('')
    const [pts, setPts] = useState('')
    const [data, setData] = useState(new Date().toISOString().split('T')[0])
    const [hora, setHora] = useState('')
    const [local, setLocal] = useState('')
    const [valor, setValor] = useState('')
    const [status, setStatus] = useState('pendente')
    const [transferida, setTransferida] = useState('não')

    const [idEditando, setIdEditando] = useState(null)

    useEffect(() => {
        // Puxa veículos
        fetch('http://127.0.0.1:8000/veiculos/')
            .then((res) => res.json())
            .then((dados) => setVeiculos(dados))

        // Puxa funcionários
        fetch('http://127.0.0.1:8000/funcionarios/')
            .then((res) => res.json())
            .then((dados) => setFuncionarios(dados))

        // Puxa infrações
        fetch('http://127.0.0.1:8000/infracoes/')
            .then((res) => res.json())
            .then((dados) => setInfracoes(dados))
    }, [telaInterna])

    function FormularioNovaInfracao() {
        setVeiculoId('')
        setFuncionarioId('')
        setInfracaoText('')
        setPts('')
        setData(new Date().toISOString().split('T')[0])
        setHora('')
        setLocal('')
        setValor('')
        setStatus('pendente')
        setTransferida('não')
        setIdEditando(null)
        setTelaInterna('formulario')
    }

    function FormularioEditarInfracao(item) {
        setVeiculoId(item.veiculo_id)
        setFuncionarioId(item.funcionario_id || '')
        setInfracaoText(item.infracao || '')
        setPts(item.pts ?? '')
        setData(item.data || '')
        setHora(item.hora || '')
        setLocal(item.local || '')
        setValor(item.valor ?? '')
        setStatus(item.status || 'pendente')
        setTransferida(item.transferida || 'não')
        setIdEditando(item.id)
        setTelaInterna('formulario')
    }

    function obterNomeVeiculo(id) {
        const v = veiculos.find((item) => item.id === id)
        return v ? `${v.modelo} - ${v.placa || 'Sem Placa'}` : `Veículo #${id}`
    }

    function obterNomeFuncionario(id) {
        if (!id) return '-'
        const f = funcionarios.find((item) => item.id === id)
        return f ? f.nome : '-'
    }

    function obterGravidade(pontos) {
        const p = Number(pontos)
        if (p === 7) return 'Gravíssima'
        if (p === 5) return 'Grave'
        if (p === 4) return 'Média'
        if (p === 3) return 'Leve'
        return '-'
    }

    function salvarInfracao(evento) {
        evento.preventDefault()

        const pacote = {
            veiculo_id: Number(veiculoId),
            funcionario_id: funcionarioId !== '' ? Number(funcionarioId) : null,
            infracao: infracaoText,
            pts: pts !== '' ? Number(pts) : null,
            data: data,
            hora: hora !== '' ? hora : null,
            local: local !== '' ? local : null,
            valor: valor !== '' ? Number(valor) : null,
            status: status,
            transferida: transferida
        }

        const url = idEditando !== null 
            ? 'http://127.0.0.1:8000/infracoes/' + idEditando 
            : 'http://127.0.0.1:8000/infracoes/'

        const metodo = idEditando !== null ? 'PUT' : 'POST'

        fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pacote)
        }).then(() => {
            setTelaInterna('lista')
        })
    }

    function deletarInfracao(item) {
        const confirmou = window.confirm(`Tem certeza que deseja apagar a infração do veículo ${obterNomeVeiculo(item.veiculo_id)}?`)

        if (confirmou) {
            fetch('http://127.0.0.1:8000/infracoes/' + item.id, {
                method: 'DELETE'
            }).then(() => {
                setTelaInterna('lista')
            })
        }
    }
    

    return (
        <div>
            {telaInterna === 'lista' ? (
                <div>
                    <h2>Registro de Infrações da Frota</h2>
                    <button onClick={FormularioNovaInfracao}>+ Cadastrar Infração</button>

                    <table>
                        <thead>
                            <tr>
                                <th>Nº</th>
                                <th>Veículo</th>
                                <th>Infração</th>
                                <th>Pts</th>
                                <th>Gravidade</th>
                                <th>Data/Hora</th>
                                <th>Local</th>
                                <th>Motorista</th>
                                <th>Valor</th>
                                <th>Status</th>
                                <th>Transf.?</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {infracoes.map((item) => (
                                <tr key={item.id}>
                                    <td>{String(item.id).padStart(3, '0')}</td>
                                    <td>{obterNomeVeiculo(item.veiculo_id)}</td>
                                    <td>{item.infracao}</td>
                                    <td>{item.pts ?? '-'}</td>
                                    <td>{obterGravidade(item.pts)}</td>
                                    <td>
                                        {item.data ? item.data.split('-').reverse().join('/') : '-'}
                                        {item.hora ? ` ${item.hora}` : ''}
                                    </td>
                                    <td>{item.local || '-'}</td>
                                    <td>{obterNomeFuncionario(item.funcionario_id)}</td>
                                    <td>
                                        {item.valor !== null 
                                            ? `R$ ${Number(item.valor).toFixed(2).replace('.', ',')}` 
                                            : '-'}
                                    </td>
                                    <td>{item.status}</td>
                                    <td>{item.transferida}</td>
                                    <td>
                                        <button onClick={() => FormularioEditarInfracao(item)}>Editar</button>
                                        <button onClick={() => deletarInfracao(item)}>Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>
                    <h2>{idEditando ? 'Editando Infração' : 'Nova Infração'}</h2>

                    <form onSubmit={salvarInfracao}>
                        <div>
                            <label>Veículo: </label>
                            <select 
                                value={veiculoId} 
                                onChange={(e) => setVeiculoId(e.target.value)} 
                                required
                            >
                                <option value="">-- Selecione o Veículo --</option>
                                {veiculos.map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.modelo} - {v.placa || 'Sem Placa'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Motorista / Condutor: </label>
                            <select 
                                value={funcionarioId} 
                                onChange={(e) => setFuncionarioId(e.target.value)}
                            >
                                <option value="">-- Não identificado / Outro --</option>
                                {funcionarios.map((f) => (
                                    <option key={f.id} value={f.id}>
                                        {f.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Descrição da Infração: </label>
                            <input
                                type="text"
                                placeholder="Ex: TRANSITAR VELOCIDADE SUPERIOR MAX..."
                                value={infracaoText}
                                onChange={(e) => setInfracaoText(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label>Pontos (CNH): </label>
                            <input
                                type="number"
                                placeholder="Ex: 4"
                                value={pts}
                                onChange={(e) => setPts(e.target.value)}
                            />
                        </div>

                        <div>
                            <label>Data: </label>
                            <input
                                type="date"
                                value={data}
                                onChange={(e) => setData(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label>Hora: </label>
                            <input
                                type="time"
                                value={hora}
                                onChange={(e) => setHora(e.target.value)}
                            />
                        </div>

                        <div>
                            <label>Local: </label>
                            <input
                                type="text"
                                placeholder="Ex: RODOVIA DF-290 KM 27.5"
                                value={local}
                                onChange={(e) => setLocal(e.target.value)}
                            />
                        </div>

                        <div>
                            <label>Valor Total (R$): </label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Ex: 135.37"
                                value={valor}
                                onChange={(e) => setValor(e.target.value)}
                            />
                        </div>

                        <div>
                            <label>Status: </label>
                            <select 
                                value={status} 
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="pendente">Pendente</option>
                                <option value="paga">Paga</option>
                                <option value="cancelada">Cancelada / D000</option>
                            </select>
                        </div>

                        <div>
                            <label>Transferida (Pontuação indicativa)? </label>
                            <select 
                                value={transferida} 
                                onChange={(e) => setTransferida(e.target.value)}
                            >
                                <option value="não">Não</option>
                                <option value="sim">Sim</option>
                            </select>
                        </div>

                        <br />
                        <button type="submit">
                            {idEditando ? 'Salvar Alterações' : 'Cadastrar'}
                        </button>

                        <button type="button" onClick={() => setTelaInterna('lista')}>
                            Cancelar
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default Infracoes