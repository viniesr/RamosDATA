import { useEffect, useState } from "react"

function Romaneios() {
    const [abaAtiva, setAbaAtiva] = useState('lancamento') 

    // 1. Listas do Banco de Dados
    const [ciclos, setCiclos] = useState([])
    const [cicloSelecionadoId, setCicloSelecionadoId] = useState('')

    const [veiculos, setVeiculos] = useState([])
    const [funcionarios, setFuncionarios] = useState([])
    const [vendedores, setVendedores] = useState([])
    const [entregasSoltas, setEntregasSoltas] = useState([])
    
    // 2. Campos do Formulário de Entrega
    const [veiculoId, setVeiculoId] = useState('')
    const [motoristaId, setMotoristaId] = useState('')
    const [ajudanteId, setAjudanteId] = useState('')
    const [vendedorId, setVendedorId] = useState('')

    const [os, setOs] = useState('')
    const [dataEntrega, setDataEntrega] = useState(new Date().toISOString().split('T')[0])
    const [destino, setDestino] = useState('')
    const [uf, setUf] = useState('DF')
    const [observacao, setObservacao] = useState('')

    // 3. Busca os dados no backend assim que a tela abre
    useEffect(() => {
        fetch('http://127.0.0.1:8000/ciclos/')
            .then(resposta => resposta.json())
            .then(dados => {
                setCiclos(dados)
                // Se existir algum ciclo aberto, já deixa ele pré-selecionado automaticamente
                const cicloAberto = dados.find(item => item.status === 'Aberto')
                if (cicloAberto) {
                    setCicloSelecionadoId(cicloAberto.id)
                }
            })

        fetch('http://127.0.0.1:8000/veiculos/')
            .then(resposta => resposta.json())
            .then(dados => setVeiculos(dados))

        fetch('http://127.0.0.1:8000/funcionarios/')
            .then(resposta => resposta.json())
            .then(dados => setFuncionarios(dados))

        fetch('http://127.0.0.1:8000/vendedores/')
            .then(resposta => resposta.json())
            .then(dados => setVendedores(dados))
    }, [])

    // 4. Busca as entregas do ciclo selecionado sempre que mudar o cicloSelecionadoId
    useEffect(() => {
        if (cicloSelecionadoId !== '') {
            buscarEntregasSoltas(cicloSelecionadoId)
        } else {
            setEntregasSoltas([])
        }
    }, [cicloSelecionadoId])

    // 5. Função para buscar entregas sem pacote dentro do ciclo ativo
    function buscarEntregasSoltas(idDoCiclo) {
        fetch(`http://127.0.0.1:8000/entregas/?ciclo_id=${idDoCiclo}`)
            .then(resposta => resposta.json())
            .then(dados => {
                // Filtra entregas do ciclo que ainda não possuem pacote_id
                const avulsasDoCiclo = dados.filter(item => item.pacote_id === null)
                setEntregasSoltas(avulsasDoCiclo)
            })
    }

    // 6. Função para salvar a entrega vinculada ao ciclo ativo
    function salvarLancamento(evento) {
        evento.preventDefault()

        if (cicloSelecionadoId === '') {
            alert('Por favor, selecione ou abra um ciclo antes de cadastrar uma entrega.')
            return
        }

        const dadosDaEntrega = {
            ciclo_id: Number(cicloSelecionadoId),
            os: os !== '' ? os : null,
            data: dataEntrega,
            destino: destino !== '' ? destino : null,
            uf: uf !== '' ? uf : null,
            veiculo_id: veiculoId !== '' ? Number(veiculoId) : null,
            motorista_id: motoristaId !== '' ? Number(motoristaId) : null,
            ajudante1_id: ajudanteId !== '' ? Number(ajudanteId) : null,
            vendedor_id: vendedorId !== '' ? Number(vendedorId) : null,
            observacao: observacao !== '' ? observacao : null,
            status: "Entregue"
        }

        fetch('http://127.0.0.1:8000/entregas/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosDaEntrega)
        }).then(resposta => {
            // Limpa apenas os campos da entrega para a próxima digitação
            setOs('')
            setDestino('')
            setObservacao('')
            setVeiculoId('')
            setMotoristaId('')
            setAjudanteId('')
            setVendedorId('')
            
            // Recarrega a lista do ciclo atual
            buscarEntregasSoltas(cicloSelecionadoId)
        })
    }

    return (
        <div>
            <h2>Gestão de Romaneios e Entregas</h2>
            
            {/* SELEÇÃO DO CICLO OPERACIONAL ATIVO */}
            <div>
                <label><strong>Ciclo Operacional Selecionado: </strong></label>
                <select 
                    value={cicloSelecionadoId} 
                    onChange={(evento) => setCicloSelecionadoId(evento.target.value)}
                >
                    <option value="">-- Selecione um Ciclo --</option>
                    {ciclos.map(item => (
                        <option key={item.id} value={item.id}>
                            Ciclo #{item.id} - {item.descricao || `Período ${item.data_inicio}`} ({item.status})
                        </option>
                    ))}
                </select>
            </div>

            <br />

            {/* NAVEGAÇÃO POR ABAS DO FLUXO */}
            <div>
                <button onClick={() => setAbaAtiva('ciclos')}>
                    1. Gerenciar Ciclos
                </button>
                <button onClick={() => setAbaAtiva('entregas')}>
                    2. Lançar Entregas
                </button>
                <button onClick={() => setAbaAtiva('pacotes')}>
                    3. Montar Pacotes / Fechamento
                </button>
            </div>

            <hr />

            {/* ABA 1: GERENCIAR CICLOS */}
            {abaAtiva === 'ciclos' && (
                <div>
                    <h3>Abertura e Fechamento de Ciclos</h3>
                    <p>Aqui vai o formulário para abrir um novo ciclo e a lista de ciclos existentes.</p>
                </div>
            )}

            {/* ABA 2: LANÇAR ENTREGAS */}
            {abaAtiva === 'entregas' && (
                <div>
                    <h3>Lançamento de Entregas no Ciclo Ativo</h3>

                    {cicloSelecionadoId === '' ? (
                        <p><strong>Aviso:</strong> Selecione um Ciclo Operacional no topo para liberar o lançamento de entregas.</p>
                    ) : (
                        <form onSubmit={salvarLancamento}>
                            <div>
                                <label>OS: </label>
                                <input 
                                    type="text" 
                                    value={os} 
                                    onChange={(evento) => setOs(evento.target.value)} 
                                    placeholder="Ex: 1544004" 
                                    required 
                                />
                            </div>

                            <div>
                                <label>Destino/Cidade: </label>
                                <input 
                                    type="text" 
                                    value={destino} 
                                    onChange={(evento) => setDestino(evento.target.value)} 
                                    placeholder="Ex: GAMA" 
                                    required 
                                />
                            </div>

                            <div>
                                <label>UF: </label>
                                <select value={uf} onChange={(evento) => setUf(evento.target.value)} required>
                                    <option value="">-- UF --</option>
                                    <option value="DF">DF</option>
                                    <option value="GO">GO</option>
                                    <option value="MG">MG</option>
                                </select>
                            </div>

                            <div>
                                <label>Data: </label>
                                <input 
                                    type="date" 
                                    value={dataEntrega} 
                                    onChange={(evento) => setDataEntrega(evento.target.value)} 
                                    required 
                                />
                            </div>

                            <div>
                                <label>Observação: </label>
                                <input 
                                    type="text" 
                                    value={observacao} 
                                    onChange={(evento) => setObservacao(evento.target.value)} 
                                />
                            </div>

                            <div>
                                <label>Veículo: </label>
                                <select value={veiculoId} onChange={(evento) => setVeiculoId(evento.target.value)}>
                                    <option value="">-- Selecione --</option>
                                    {veiculos.map(item => (
                                        <option key={item.id} value={item.id}>{item.placa} - {item.modelo}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label>Motorista: </label>
                                <select value={motoristaId} onChange={(evento) => setMotoristaId(evento.target.value)}>
                                    <option value="">-- Selecione --</option>
                                    {funcionarios.map(item => (
                                        <option key={item.id} value={item.id}>{item.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label>Ajudante: </label>
                                <select value={ajudanteId} onChange={(evento) => setAjudanteId(evento.target.value)}>
                                    <option value="">-- Nenhum --</option>
                                    {funcionarios.map(item => (
                                        <option key={item.id} value={item.id}>{item.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label>Vendedor: </label>
                                <select value={vendedorId} onChange={(evento) => setVendedorId(evento.target.value)}>
                                    <option value="">-- Selecione --</option>
                                    {vendedores.map(item => (
                                        <option key={item.id} value={item.id}>{item.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit">Cadastrar Entrega</button>
                        </form>
                    )}

                    <h4>Histórico de Entregas Avulsas (Aguardando Fechamento)</h4>
                    <ul>
                        {entregasSoltas.map(item => (
                            <li key={item.id}>
                                <strong>OS: {item.os}</strong> | {item.destino} - {item.uf} | Data: {item.data.split('-').reverse().join('/')}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* ABA 3: PACOTES E FECHAMENTO */}
            {abaAtiva === 'pacotes' && (
                <div>
                    <h3>Agrupamento de Pacotes e Fechamento</h3>
                    <p>Aqui vai a montagem dos pacotes vincuados às entregas do ciclo.</p>
                </div>
            )}
        </div>
    )
}

export default Romaneios