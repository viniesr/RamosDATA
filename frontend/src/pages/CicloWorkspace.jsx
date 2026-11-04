import { useState, useEffect } from "react"

function CicloWorkspace({ cicloId }) {
    
    const [ciclo, setCiclo] = useState(null)
    const [entregas, setEntregas] = useState([])
    const [entregasSelecionadas, setEntregasSelecionadas] = useState([])
    const [pacotes, setPacotes] = useState([])
    const [nomePacote, setNomePacote] = useState('')
    const [valorPacote, setValorPacote] = useState(1000.0)
    const [pacoteDestinoId, setPacoteDestinoId] = useState('')
    
    const [veiculos, setVeiculos] = useState([])
    const [funcionarios, setFuncionarios] = useState([])
    const [vendedores, setVendedores] = useState([])

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

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/ciclos/${cicloId}`)
            .then(resposta => resposta.json())
            .then(dados => setCiclo(dados))

        buscarEntregas()
        buscarPacotes()
    }, [cicloId])

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

    function buscarPacotes() {
        // Supondo que o seu backend aceite filtrar pacotes pelo ciclo_id
        fetch(`http://127.0.0.1:8000/pacotes/?ciclo_id=${cicloId}`)
            .then(resposta => resposta.json())
            .then(dados => setPacotes(dados))
    }

    function getNomeVeiculo(id) {
        if (!id || veiculos.length === 0) return '---'
        const veiculo = veiculos.find(v => v.id === id)
        return veiculo ? `${veiculo.marca} - ${veiculo.modelo}` : 'Desconhecido'
    }

    function getNomeFuncionario(id) {
        if (!id || funcionarios.length === 0) return '---'
        const funcionario = funcionarios.find(f => f.id === id)
        return funcionario ? funcionario.nome : 'Desconhecido'
    }

    function getNomePacote(id) {
        if (!id || pacotes.length === 0) return 'Avulsa'
        const pacoteEncontrado = pacotes.find(p => p.id === id)
        return pacoteEncontrado ? pacoteEncontrado.nome : 'Pacote Não Encontrado'
    }

    function alternarSelecaoEntrega(id) {
    if (entregasSelecionadas.includes(id)) {
        setEntregasSelecionadas(entregasSelecionadas.filter(item => item !== id))
    } else {
        setEntregasSelecionadas([...entregasSelecionadas, id])
    }
}
    const valorTotalSelecionado = entregas.reduce((soma, entrega) => {
    if (entregasSelecionadas.includes(entrega.id)) {
        return soma + (entrega.valor || 0)
    }
    return soma
}, 0)

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
                setOs('')
                setDestino('')
                setValor('')
                setObservacao('')
                setVeiculoIdForm('')
                setMotoristaIdForm('')
                setAjudanteIdForm('')
                setVendedorIdForm('')
                
                buscarEntregas()
            } else {
                alert("Erro ao cadastrar entrega.")
            }
        })
    }

    function criarPacoteVazio(evento) {
        evento.preventDefault() // Evita que a página recarregue ao submeter o formulário

        const dadosDoPacote = {
            ciclo_id: Number(cicloId),
            nome: nomePacote,
            valor: Number(valorPacote),
            observacao: ""
        }

        fetch('http://127.0.0.1:8000/pacotes/', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json'},
            body: JSON.stringify(dadosDoPacote)
        }).then(resposta => {
            if(resposta.ok) {
                buscarPacotes()
                setNomePacote('')
                setValorPacote(1000.0)
                alert("Pacote criado com sucesso!")
            } else {
                alert("Erro ao criar pacote.")
            }
        })
    }

    function vincularEntregasAoPacote() {
        // Validação 1: Tem alguma nota fiscal na mão?
        if (entregasSelecionadas.length === 0) {
            alert("Por favor, marque as caixinhas de pelo menos uma entrega na tabela.")
            return
        }

        // Validação 2: Escolheu alguma pasta?
        if (pacoteDestinoId === '') {
            alert("Por favor, escolha um pacote no menu para enviar as entregas.")
            return
        }

        // Vamos preparar os pedidos para o backend
        // O .map() vai passar por cada ID de entrega que você marcou na tela
        const pedidos = entregasSelecionadas.map(id => {
            
            // Passo A: Encontramos os dados originais dessa entrega na nossa lista
            const entregaOriginal = entregas.find(e => e.id === id)
            
            // Passo B: Montamos os dados exatamente como o backend exige (schemas.py),
            // mas colocamos o número do Pacote escolhido no campo pacote_id
            const dadosAtualizados = {
                ciclo_id: entregaOriginal.ciclo_id,
                pacote_id: Number(pacoteDestinoId),
                os: entregaOriginal.os,
                data: entregaOriginal.data,
                destino: entregaOriginal.destino,
                uf: entregaOriginal.uf,
                veiculo_id: entregaOriginal.veiculo_id,
                motorista_id: entregaOriginal.motorista_id,
                ajudante1_id: entregaOriginal.ajudante1_id,
                ajudante2_id: entregaOriginal.ajudante2_id,
                ajudante3_id: entregaOriginal.ajudante3_id,
                vendedor_id: entregaOriginal.vendedor_id,
                valor: entregaOriginal.valor,
                peso: entregaOriginal.peso,
                observacao: entregaOriginal.observacao,
                status: entregaOriginal.status
            }

            // Passo C: Criamos o pedido de alteração (PUT) para essa entrega específica
            return fetch(`http://127.0.0.1:8000/entregas/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosAtualizados)
            })
        })

        // O Promise.all pega todos esses pedidos (notas fiscais) e processa todos ao mesmo tempo
        Promise.all(pedidos).then(respostas => {
            // Verifica se o servidor deu "OK" para todas as atualizações
            const todasComSucesso = respostas.every(r => r.ok)
            
            if (todasComSucesso) {
                alert("Entregas movidas para o pacote com sucesso!")
                setEntregasSelecionadas([]) // Solta os papéis da mão (desmarca as caixinhas)
                setPacoteDestinoId('') // Limpa a escolha do pacote no menu
                buscarEntregas() // Recarrega a tabela para mostrar as mudanças
            } else {
                alert("Ocorreu um erro ao tentar mover algumas entregas.")
            }
        })
    }

    function removerEntregaDoPacote(entrega) {
        // Montamos os mesmos dados da entrega, mas definimos o pacote_id como null (sem pacote)
        const dadosAtualizados = {
            ciclo_id: entrega.ciclo_id,
            pacote_id: null,
            os: entrega.os,
            data: entrega.data,
            destino: entrega.destino,
            uf: entrega.uf,
            veiculo_id: entrega.veiculo_id,
            motorista_id: entrega.motorista_id,
            ajudante1_id: entrega.ajudante1_id,
            ajudante2_id: entrega.ajudante2_id,
            ajudante3_id: entrega.ajudante3_id,
            vendedor_id: entrega.vendedor_id,
            valor: entrega.valor,
            peso: entrega.peso,
            observacao: entrega.observacao,
            status: entrega.status
        }

        fetch(`http://127.0.0.1:8000/entregas/${entrega.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosAtualizados)
        }).then(resposta => {
            if (resposta.ok) {
                buscarEntregas() // Recarrega a tabela
            } else {
                alert("Erro ao remover entrega do pacote.")
            }
        })
    }

    function deletarEntrega(id) {
        if (window.confirm("Tem certeza que deseja apagar esta OS?")) {
            fetch(`http://127.0.0.1:8000/entregas/${id}`, {
                method: 'DELETE'
            }).then(resposta => {
                if (resposta.ok) {
                    buscarEntregas()
                } else {
                    alert("Erro ao apagar a entrega.")
                }
            })
        }
    }

    function deletarPacote(id) {
        if (window.confirm("Tem certeza que deseja apagar este pacote?")) {
            fetch(`http://127.0.0.1:8000/pacotes/${id}`, {
                method: 'DELETE'
            }).then(resposta => {
                if (resposta.ok) {
                    buscarPacotes()
                    buscarEntregas() // Recarrega entregas caso alguma estivesse vinculada
                } else {
                    alert("Erro ao apagar o pacote.")
                }
            })
        }
    }

    // Filtramos a lista geral para pegar apenas as notas fiscais que estão "soltas na mesa"
    const entregasAvulsas = entregas.filter(e => e.pacote_id === null)

    

    return (
        <div>
            <h2>Workspace: {ciclo ? ciclo.nome : 'Carregando...'}</h2>

            <div>
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
                                    <option key={veiculo.id} value={veiculo.id}>{veiculo.marca} - {veiculo.modelo}</option>
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
                <div>
                    <h4>
                        OSs Selecionadas: {entregasSelecionadas.length} | 
                        Total Selecionado: R$ {valorTotalSelecionado.toFixed(2)}
                    </h4>
                </div>
                <div>
                    <label>Enviar selecionadas para o Pacote: </label>
                    <select value={pacoteDestinoId} onChange={(evento) => setPacoteDestinoId(evento.target.value)}>
                        <option value="">-- Escolha o Pacote --</option>
                        {pacotes.map(pacote => (
                            <option key={pacote.id} value={pacote.id}>
                                {pacote.nome} (R$ {pacote.valor ? pacote.valor.toFixed(2) : '0.00'})
                            </option>
                        ))}
                    </select>
                    <button onClick={vincularEntregasAoPacote}>Mover para o Pacote</button>
                </div>
                <div>
                    <h3>+ Novo Pacote</h3>
                    <form onSubmit={criarPacoteVazio}>
                        <label>Nome do Pacote: </label>
                        <input 
                            type="text" 
                            value={nomePacote} 
                            onChange={(evento) => setNomePacote(evento.target.value)} 
                            required 
                        />
                        
                        <label> Valor (R$): </label>
                        <input 
                            type="number" 
                            step="0.01" 
                            value={valorPacote} 
                            onChange={(evento) => setValorPacote(evento.target.value)} 
                            required 
                        />
                        
                        <button type="submit">+ Criar Pacote</button>
                    </form>
                </div>
                <div>
    <h3>Pacotes do Ciclo ({pacotes.length})</h3>
    {pacotes.length === 0 ? (
        <p>Nenhum pacote criado ainda.</p>
    ) : (
        <div>
            {pacotes.map(pacote => {
                // Filtramos apenas as entregas que pertencem a ESTE pacote específico
                const entregasDoPacote = entregas.filter(e => e.pacote_id === pacote.id)

                return (
                    <div key={pacote.id}>
                        <strong>{pacote.nome}</strong>
                        <p>Valor do Pacote: R$ {pacote.valor ? pacote.valor.toFixed(2) : '0.00'}</p>
                        
                        {/* Lista das OSs que estão dentro desta pasta/pacote */}
                        <div>
                            <p><strong>Entregas Incluídas ({entregasDoPacote.length}):</strong></p>
                            {entregasDoPacote.length === 0 ? (
                                <p><em>Nenhuma entrega vinculada a este pacote ainda.</em></p>
                            ) : (
                                <ul>
                                    {entregasDoPacote.map(e => (
                                        <li key={e.id}>
                                            OS: {e.os} - {e.destino} ({e.uf}) | R$ {e.valor ? e.valor.toFixed(2) : '0.00'} {" - "}
                                            <button onClick={() => removerEntregaDoPacote(e)}>Soltar</button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <button onClick={() => deletarPacote(pacote.id)}>Excluir Pacote</button>
                    </div>
                )
            })}
        </div>
    )}
</div>
                <div>
                    <h3>Entregas Avulsas da Quinzena ({entregasAvulsas.length})</h3>
                    
                    {entregasAvulsas.length === 0 ? (
                        <p>Nenhuma entrega avulsa no momento.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Sel.</th>
                                    <th>OS</th>
                                    <th>Destino</th>
                                    <th>Veículo</th>
                                    <th>Motorista</th>
                                    <th>Valor (R$)</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entregasAvulsas.map(entrega => (
                                    <tr key={entrega.id}>
                                        <td>
                                            <input 
                                                type="checkbox" 
                                                checked={entregasSelecionadas.includes(entrega.id)}
                                                onChange={() => alternarSelecaoEntrega(entrega.id)}
                                            />
                                        </td>
                                        <td>{entrega.os}</td>
                                        <td>{entrega.destino} - {entrega.uf}</td>
                                        <td>{getNomeVeiculo(entrega.veiculo_id)}</td>
                                        <td>{getNomeFuncionario(entrega.motorista_id)}</td>
                                        
                                        {/* Aqui devolvemos a coluna do Valor que tinha sumido! */}
                                        <td>{entrega.valor ? entrega.valor.toFixed(2) : '0.00'}</td>
                                        
                                        {/* Como é avulsa, só tem a opção de Excluir */}
                                        <td>
                                            <button onClick={() => deletarEntrega(entrega.id)}>Excluir</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CicloWorkspace