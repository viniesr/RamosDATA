import { useState, useEffect } from "react"

function CicloWorkspace({ cicloId }) {
    // GAVETAS DE ESTADO: Dados do Ciclo
    const [ciclo, setCiclo] = useState(null)
    const [entregas, setEntregas] = useState([])

    // GAVETAS DE ESTADO: Listas para os campos de seleção (Dropdowns)
    const [veiculos, setVeiculos] = useState([])
    const [funcionarios, setFuncionarios] = useState([])
    const [vendedores, setVendedores] = useState([])

    // GAVETAS DE ESTADO: Campos do Formulário
    const [os, setOs] = useState('')
    const [dataEntrega, setDataEntrega] = useState(new Date().toISOString().split('T')[0])
    const [destino, setDestino] = useState('')
    const [uf, setUf] = useState('DF')
    const [valor, setValor] = useState('')
    const [observacao, setObservacao] = useState('')
    const [veiculoIdForm, setVeiculoIdForm] = useState('')
    const [motoristaIdForm, setMotoristaIdForm] = useState('')
    const [ajudanteIdForm, setAjudanteIdForm] = useState('')
    const [vendedorIdForm, setVendedorIdForm] = useState('')

    // EFEITO 1: Carrega os dados do ciclo e as entregas sempre que o cicloId mudar
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/ciclos/${cicloId}`)
            .then(resposta => resposta.json())
            .then(dados => setCiclo(dados))

        buscarEntregas()
    }, [cicloId])

    // EFEITO 2: Carrega os veículos, funcionários e vendedores apenas uma vez quando a tela abre
    useEffect(() => {
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

    function buscarEntregas() {
        fetch(`http://127.0.0.1:8000/entregas/?ciclo_id=${cicloId}`)
            .then(resposta => resposta.json())
            .then(dados => setEntregas(dados))
    }

    // FUNÇÃO: Envia a nova entrega para o backend
    function salvarLancamento(evento) {
        evento.preventDefault()

        const dadosDaEntrega = {
            ciclo_id: Number(cicloId),
            os: os !== '' ? os : null,
            data: dataEntrega,
            destino: destino !== '' ? destino : null,
            uf: uf !== '' ? uf : null,
            veiculo_id: veiculoIdForm !== '' ? Number(veiculoIdForm) : null,
            motorista_id: motoristaIdForm !== '' ? Number(motoristaIdForm) : null,
            ajudante1_id: ajudanteIdForm !== '' ? Number(ajudanteIdForm) : null,
            vendedor_id: vendedorIdForm !== '' ? Number(vendedorIdForm) : null,
            valor: valor !== '' ? parseFloat(valor) : null,
            observacao: observacao !== '' ? observacao : null,
            status: "Entregue"
        }

        fetch('http://127.0.0.1:8000/entregas/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosDaEntrega)
        }).then(resposta => {
            if (resposta.ok) {
                // Limpa os campos do formulário
                setOs('')
                setDestino('')
                setValor('')
                setObservacao('')
                setVeiculoIdForm('')
                setMotoristaIdForm('')
                setAjudanteIdForm('')
                setVendedorIdForm('')
                
                // Recarrega a lista de entregas para mostrar a nova OS na tela
                buscarEntregas()
            } else {
                alert("Erro ao cadastrar entrega.")
            }
        })
    }

    return (
        <div>
            <h2>Workspace: {ciclo ? ciclo.nome : 'Carregando...'}</h2>

            <div>
                {/* LADO ESQUERDO: Formulário */}
                <div>
                    <h3>Lançar Nova OS</h3>
                    <form onSubmit={salvarLancamento}>
                        <div>
                            <label>OS: </label>
                            <input type="text" value={os} onChange={(evento) => setOs(evento.target.value)} required />
                        </div>

                        <div>
                            <label>Destino/Cidade: </label>
                            <input type="text" value={destino} onChange={(evento) => setDestino(evento.target.value)} required />
                        </div>

                        <div>
                            <label>UF: </label>
                            <select value={uf} onChange={(evento) => setUf(evento.target.value)} required>
                                <option value="DF">DF</option>
                                <option value="GO">GO</option>
                                <option value="BA">BA</option>
                                <option value="MG">MG</option>
                            </select>
                        </div>

                        <div>
                            <label>Data: </label>
                            <input type="date" value={dataEntrega} onChange={(evento) => setDataEntrega(evento.target.value)} required />
                        </div>

                        <div>
                            <label>Valor (R$): </label>
                            <input type="number" step="0.01" value={valor} onChange={(evento) => setValor(evento.target.value)} />
                        </div>

                        <div>
                            <label>Veículo: </label>
                            <select value={veiculoIdForm} onChange={(evento) => setVeiculoIdForm(evento.target.value)}>
                                <option value="">-- Selecione --</option>
                                {veiculos.map(veiculo => (
                                    <option key={veiculo.id} value={veiculo.id}>{veiculo.placa} - {veiculo.modelo}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Motorista: </label>
                            <select value={motoristaIdForm} onChange={(evento) => setMotoristaIdForm(evento.target.value)}>
                                <option value="">-- Selecione --</option>
                                {funcionarios.map(funcionario => (
                                    <option key={funcionario.id} value={funcionario.id}>{funcionario.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Ajudante: </label>
                            <select value={ajudanteIdForm} onChange={(evento) => setAjudanteIdForm(evento.target.value)}>
                                <option value="">-- Nenhum --</option>
                                {funcionarios.map(funcionario => (
                                    <option key={funcionario.id} value={funcionario.id}>{funcionario.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Vendedor: </label>
                            <select value={vendedorIdForm} onChange={(evento) => setVendedorIdForm(evento.target.value)}>
                                <option value="">-- Selecione --</option>
                                {vendedores.map(vendedor => (
                                    <option key={vendedor.id} value={vendedor.id}>{vendedor.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Observação: </label>
                            <input type="text" value={observacao} onChange={(evento) => setObservacao(evento.target.value)} />
                        </div>

                        <button type="submit">Cadastrar Entrega</button>
                    </form>
                </div>

                {/* LADO DIREITO: Lista de Entregas */}
                <div>
                    <h3>Entregas da Quinzena ({entregas.length})</h3>
                    
                    {entregas.length === 0 ? (
                        <p>Nenhuma entrega lançada neste ciclo ainda.</p>
                    ) : (
                        <ul>
                            {entregas.map(entrega => (
                                <li key={entrega.id}>
                                    <strong>OS: {entrega.os}</strong> | Destino: {entrega.destino} | Valor: R$ {entrega.valor || '0.00'}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CicloWorkspace