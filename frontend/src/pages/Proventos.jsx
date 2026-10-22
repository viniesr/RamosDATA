import { useState, useEffect } from "react"

function Proventos() {
    const [telaInterna, setTelaInterna] = useState('lista')

    const [proventos, setProventos] = useState([])
    const [funcionarios, setFuncionarios] = useState([])

    // Campos do formulário
    const [funcionarioId, setFuncionarioId] = useState('')
    const [tipo, setTipo] = useState('Fechamento')
    const [dataPagamento, setDataPagamento] = useState(new Date().toISOString().split('T')[0])
    
    // Período agora dividido em Data Início e Data Fim
    const [dataInicio, setDataInicio] = useState('')
    const [dataFim, setDataFim] = useState('')

    const [valor, setValor] = useState('')
    const [meio, setMeio] = useState('PIX')
    const [observacoes, setObservacoes] = useState('')
    const [comprovante, setComprovante] = useState('')
    
    const [idEditando, setIdEditando] = useState(null)
    const [arquivoSelecionado, setArquivoSelecionado] = useState(null)

    useEffect(() => {
        fetch('http://127.0.0.1:8000/funcionarios/')
            .then((res) => res.json())
            .then((dados) => setFuncionarios(dados))

        fetch('http://127.0.0.1:8000/proventos/')
            .then((res) => res.json())
            .then((dados) => setProventos(dados))
    }, [telaInterna])

    function FormularioNovoProvento() {
        setFuncionarioId('')
        setTipo('Fechamento')
        setDataPagamento(new Date().toISOString().split('T')[0])
        setDataInicio('')
        setDataFim('')
        setValor('')
        setMeio('PIX')
        setObservacoes('')
        setComprovante('')
        setArquivoSelecionado(null)
        setIdEditando(null)
        setTelaInterna('formulario')
    }

    function FormularioEditarProvento(item) {
        setFuncionarioId(item.funcionario_id)
        setTipo(item.tipo || 'Fechamento')
        setDataPagamento(item.data_pagamento || '')

        // Se o período estiver salvo no formato "DD/MM/AAAA a DD/MM/AAAA", resgata para os inputs
        if (item.periodo && item.periodo.includes(' a ')) {
            const partes = item.periodo.split(' a ')
            
            // Converte DD/MM/AAAA de volta para AAAA-MM-DD para o input HTML type="date"
            const converterParaInputDate = (dataBR) => {
                const p = dataBR.split('/')
                return p.length === 3 ? `${p[2]}-${p[1]}-${p[0]}` : ''
            }

            setDataInicio(converterParaInputDate(partes[0]))
            setDataFim(converterParaInputDate(partes[1]))
        } else {
            setDataInicio('')
            setDataFim('')
        }

        setValor(item.valor ?? '')
        setMeio(item.meio || 'PIX')
        setObservacoes(item.observacoes || '')
        setComprovante(item.comprovante || '')
        setArquivoSelecionado(null)
        setIdEditando(item.id)
        setTelaInterna('formulario')
    }

    function obterNomeFuncionario(id) {
        const f = funcionarios.find((item) => item.id === id)
        return f ? f.nome : `Funcionário #${id}`
    }

    async function salvarProvento(evento) {
        evento.preventDefault()

        let caminhoComprovante = comprovante

        if (arquivoSelecionado) {
            const formDataEnvio = new FormData()
            formDataEnvio.append('file', arquivoSelecionado)

            try {
                const respostaUpload = await fetch('http://127.0.0.1:8000/upload/', {
                    method: 'POST',
                    body: formDataEnvio,
                })
                const dadosUpload = await respostaUpload.json()
                caminhoComprovante = dadosUpload.url
            } catch (erro) {
                alert('Erro ao fazer upload do comprovante!')
                return
            }
        }

        // Formata o período de AAAA-MM-DD para DD/MM/AAAA e junta as duas datas
        let periodoFormatado = null
        if (dataInicio && dataFim) {
            const inicioBR = dataInicio.split('-').reverse().join('/')
            const fimBR = dataFim.split('-').reverse().join('/')
            periodoFormatado = `${inicioBR} a ${fimBR}`
        } else if (dataInicio) {
            periodoFormatado = dataInicio.split('-').reverse().join('/')
        }

        const pacote = {
            funcionario_id: Number(funcionarioId),
            tipo: tipo,
            data_pagamento: dataPagamento,
            periodo: periodoFormatado,
            valor: Number(valor),
            meio: meio,
            comprovante: caminhoComprovante !== '' ? caminhoComprovante : null,
            observacoes: observacoes !== '' ? observacoes : null
        }

        const url = idEditando !== null 
            ? 'http://127.0.0.1:8000/proventos/' + idEditando 
            : 'http://127.0.0.1:8000/proventos/'

        const metodo = idEditando !== null ? 'PUT' : 'POST'

        fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pacote)
        }).then(() => {
            setTelaInterna('lista')
        })
    }

    function deletarProvento(item) {
        const confirmou = window.confirm(`Tem certeza que deseja apagar o registro de pagamento do funcionário ${obterNomeFuncionario(item.funcionario_id)}?`)

        if (confirmou) {
            fetch('http://127.0.0.1:8000/proventos/' + item.id, {
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
                    <h2>Proventos e Pagamentos (RH)</h2>
                    <button onClick={FormularioNovoProvento}>+ Registrar Pagamento / Vale</button>

                    <table>
                        <thead>
                            <tr>
                                <th>Nº</th>
                                <th>Funcionário</th>
                                <th>Tipo</th>
                                <th>Data Pagamento</th>
                                <th>Período Referente</th>
                                <th>Meio</th>
                                <th>Valor</th>
                                <th>Comprovante</th>
                                <th>Observações</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {proventos.map((item) => (
                                <tr key={item.id}>
                                    <td>{String(item.id).padStart(3, '0')}</td>
                                    <td>{obterNomeFuncionario(item.funcionario_id)}</td>
                                    <td>{item.tipo}</td>
                                    <td>
                                        {item.data_pagamento 
                                            ? item.data_pagamento.split('-').reverse().join('/') 
                                            : '-'}
                                    </td>
                                    <td>{item.periodo || '-'}</td>
                                    <td>{item.meio || '-'}</td>
                                    <td>
                                        {item.valor !== null 
                                            ? `R$ ${Number(item.valor).toFixed(2).replace('.', ',')}` 
                                            : '-'}
                                    </td>
                                    <td>
                                        {item.comprovante ? (
                                            <a 
                                                href={`http://127.0.0.1:8000/${item.comprovante}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                            >
                                                📎 Ver Comprovante
                                            </a>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td>{item.observacoes || '-'}</td>
                                    <td>
                                        <button onClick={() => FormularioEditarProvento(item)}>Editar</button>
                                        <button onClick={() => deletarProvento(item)}>Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>
                    <h2>{idEditando ? 'Editando Pagamento' : 'Novo Pagamento / Vale'}</h2>

                    <form onSubmit={salvarProvento}>
                        <div>
                            <label>Funcionário / Motorista: </label>
                            <select 
                                value={funcionarioId} 
                                onChange={(e) => setFuncionarioId(e.target.value)} 
                                required
                            >
                                <option value="">-- Selecione o Funcionário --</option>
                                {funcionarios.map((f) => (
                                    <option key={f.id} value={f.id}>
                                        {f.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Tipo de Lançamento: </label>
                            <select 
                                value={tipo} 
                                onChange={(e) => setTipo(e.target.value)}
                                required
                            >
                                <option value="Fechamento">Fechamento</option>
                                <option value="Adiantamento/Vale">Adiantamento / Vale</option>
                                <option value="Bônus">Bônus</option>
                                <option value="Outros">Outros</option>
                            </select>
                        </div>

                        <div>
                            <label>Data de Pagamento: </label>
                            <input
                                type="date"
                                value={dataPagamento}
                                onChange={(e) => setDataPagamento(e.target.value)}
                                required
                            />
                        </div>

                        {/* DOIS SELETORES DE DATA PARA O PERÍODO */}
                        <div>
                            <label>Período - Data Início: </label>
                            <input
                                type="date"
                                value={dataInicio}
                                onChange={(e) => setDataInicio(e.target.value)}
                            />
                        </div>

                        <div>
                            <label>Período - Data Fim: </label>
                            <input
                                type="date"
                                value={dataFim}
                                onChange={(e) => setDataFim(e.target.value)}
                            />
                        </div>

                        <div>
                            <label>Meio de Pagamento: </label>
                            <select 
                                value={meio} 
                                onChange={(e) => setMeio(e.target.value)}
                            >
                                <option value="PIX">PIX</option>
                                <option value="Espécie">Espécie (Dinheiro)</option>
                                <option value="Transferência">Transferência</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>

                        <div>
                            <label>Valor Total (R$): </label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Ex: 1350.00"
                                value={valor}
                                onChange={(e) => setValor(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label>Observações / Detalhamento: </label>
                            <textarea
                                placeholder="Ex: Referente à 9 dias trabalhados (R$ 150,00/dia), feito um vale de R$ 350,00..."
                                value={observacoes}
                                onChange={(e) => setObservacoes(e.target.value)}
                            />
                        </div>

                        <div>
                            <label>Comprovante / Recibo (PDF ou Imagem): </label>
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => setArquivoSelecionado(e.target.files[0])}
                            />
                            {comprovante && !arquivoSelecionado && (
                                <p>
                                    Comprovante cadastrado:{" "}
                                    <a 
                                        href={`http://127.0.0.1:8000/${comprovante}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        Ver Comprovante Atual
                                    </a>
                                </p>
                            )}
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

export default Proventos