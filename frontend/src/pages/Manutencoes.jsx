import { useState, useEffect } from "react";

function Manutencoes(){
    const[telaInterna,setTelaInterna] = useState('lista')

    const[manutencoes, setManutencoes] = useState([])
    const[veiculos, setVeiculos] = useState([])

    const [veiculoId, setVeiculoId] = useState('')
    const [data, setData] = useState(new Date().toISOString().split('T')[0])
    const [tipo, setTipo] = useState('Conserto + Peça')
    const [descricao, setDescricao] = useState('')
    const [quantidade, setQuantidade] = useState('')
    const [km, setKm] = useState('')
    const [valor, setValor] = useState('')
    const [observacoes, setObservacoes] = useState('')
    const [comprovante, setComprovante] = useState('')
    const [idEditando, setIdEditando] = useState(null)

    const [arquivoSelecionado, setArquivoSelecionado] = useState(null)

    useEffect(() => {
        // Puxa a lista de veículos para sabermos o nome/placa pelo ID
        fetch('http://127.0.0.1:8000/veiculos/')
            .then((resposta) => resposta.json())
            .then((dados) => setVeiculos(dados))

        // Puxa a lista de manutenções cadastradas
        fetch('http://127.0.0.1:8000/manutencoes/')
            .then((resposta) => resposta.json())
            .then((dados) => setManutencoes(dados))
    }, [telaInterna])

    function FormularioNovaManutencao(){
        setVeiculoId('')
        setData(new Date().toISOString().split('T')[0])
        setTipo('Conserto + Peça')
        setDescricao('')
        setQuantidade('')
        setKm('')
        setValor('')
        setObservacoes('')
        setComprovante('')
        setArquivoSelecionado(null)
        setIdEditando(null)
        setTelaInterna('formulario')
    }

    function FormularioEditarManutencao(manutencao) {
        setVeiculoId(manutencao.veiculo_id)
        setData(manutencao.data || '')
        setTipo(manutencao.tipo || 'Conserto + Peça')
        setDescricao(manutencao.descricao || '')
        setQuantidade(manutencao.quantidade ?? '')
        setKm(manutencao.km ?? '')
        setValor(manutencao.valor ?? '')
        setObservacoes(manutencao.observacoes || '')
        setComprovante(manutencao.comprovante || '')
        setArquivoSelecionado(null)
        setIdEditando(manutencao.id)
        setTelaInterna('formulario')
    }

    function obterNomeVeiculo(id) {
        const veiculo = veiculos.find((v) => v.id === id)
        return veiculo ? `${veiculo.modelo} - ${veiculo.placa || 'Sem Placa'}` : `Veículo #${id}`
    }

    async function salvarManutencao(evento){
        evento.preventDefault()

        let caminhoComprovante = comprovante

        if (arquivoSelecionado) {
            const formDataEnvio = new FormData()
            formDataEnvio.append('file', arquivoSelecionado)

            try {
                const respostaUpload = await fetch ('http://127.0.0.1:8000/upload/', {
                    method: 'POST',
                    body: formDataEnvio,
                })
                const dadosUpload = await respostaUpload.json()
                caminhoComprovante = dadosUpload.url
            } catch (erro) {
                alert('Erro ao fazer upload!')
                return
            }
        }

        const pacote = {
            veiculo_id: Number(veiculoId),
            data: data,
            tipo: tipo,
            descricao: descricao,
            quantidade: quantidade !== '' ? Number(quantidade) : null,
            km: km !== '' ? Number(km) : null,
            valor: valor !== '' ? Number(valor) : null,
            observacoes: observacoes !== '' ? observacoes : null,
            comprovante: caminhoComprovante !== '' ? caminhoComprovante : null
        }

        // 3. Define se é criação (POST) ou edição (PUT)
        const url = idEditando !== null 
            ? 'http://127.0.0.1:8000/manutencoes/' + idEditando 
            : 'http://127.0.0.1:8000/manutencoes/'

        const metodo = idEditando !== null ? 'PUT' : 'POST'

        // 4. Salva no backend e volta para a tela de lista
        fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pacote)
        }).then(() => {
            setTelaInterna('lista')
        })

    }

    function deletarManutencao(manutencao) {
        const confirmou = window.confirm(`Tem certeza que deseja apagar a manutenção do veículo ${obterNomeVeiculo(manutencao.veiculo_id)}?`)

        if (confirmou) {
            fetch('http://127.0.0.1:8000/manutencoes/' + manutencao.id, {
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
                    <h2>Lista de Manutenções</h2>
                    <button onClick={FormularioNovaManutencao}>+ Registrar Manutenção</button>

                    <table>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Veículo</th>
                                <th>Tipo</th>
                                <th>Descrição</th>
                                <th>KM</th>
                                <th>Valor</th>
                                <th>Comprovante</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {manutencoes.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        {item.data ? item.data.split('-').reverse().join('/') : '-'}
                                    </td>
                                    <td>{obterNomeVeiculo(item.veiculo_id)}</td>
                                    <td>{item.tipo}</td>
                                    <td>{item.descricao}</td>
                                    <td>{item.km !== null ? `${item.km} km` : '-'}</td>
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
                                                📎 Ver Nota
                                            </a>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td>
                                        <button onClick={() => FormularioEditarManutencao(item)}>Editar</button>
                                        <button onClick={() => deletarManutencao(item)}>Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>
                    <div>
                    <h2>{idEditando ? 'Editando Manutenção' : 'Nova Manutenção'}</h2>

                    <form onSubmit={salvarManutencao}>
                        <div>
                            <label>Veículo: </label>
                            <select 
                                value={veiculoId} 
                                onChange={(evento) => setVeiculoId(evento.target.value)} 
                                required
                            >
                                <option value="">-- Selecione o Veículo --</option>
                                {veiculos.map((veiculo) => (
                                    <option key={veiculo.id} value={veiculo.id}>
                                        {veiculo.modelo} - {veiculo.placa || 'Sem Placa'}
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
                            <label>Tipo: </label>
                            <select 
                                value={tipo} 
                                onChange={(evento) => setTipo(evento.target.value)}
                                required
                            >
                                <option value="Conserto + Peça">Conserto + Peça</option>
                                <option value="Peça">Peça</option>
                                <option value="Ajuste">Ajuste</option>
                                <option value="Pagamento/Acerto">Pagamento/Acerto</option>
                                <option value="Mão de Obra">Mão de Obra</option>
                                <option value="Item">Item</option>
                            </select>
                        </div>

                        <div>
                            <label>Descrição / Serviço: </label>
                            <input
                                type="text"
                                placeholder="Ex: Troca de óleo, retífica, alinhamento..."
                                value={descricao}
                                onChange={(evento) => setDescricao(evento.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label>Quantidade: </label>
                            <input
                                type="number"
                                placeholder="Ex: 1"
                                value={quantidade}
                                onChange={(evento) => setQuantidade(evento.target.value)}
                            />
                        </div>

                        <div>
                            <label>KM Atual: </label>
                            <input
                                type="number"
                                placeholder="Ex: 150000"
                                value={km}
                                onChange={(evento) => setKm(evento.target.value)}
                            />
                        </div>

                        <div>
                            <label>Valor Total (R$): </label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Ex: 250.00"
                                value={valor}
                                onChange={(evento) => setValor(evento.target.value)}
                            />
                        </div>

                        <div>
                            <label>Observações: </label>
                            <textarea
                                placeholder="Detalhes adicionais..."
                                value={observacoes}
                                onChange={(evento) => setObservacoes(evento.target.value)}
                            />
                        </div>

                        {/* Campo para anexar a Nota Fiscal / Comprovante */}
                        <div>
                            <label>Comprovante / NF (PDF ou Imagem): </label>
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(evento) => setArquivoSelecionado(evento.target.files[0])}
                            />
                            {comprovante && !arquivoSelecionado && (
                                <p>
                                    Anexo cadastrado:{" "}
                                    <a 
                                        href={`http://127.0.0.1:8000/${comprovante}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        Ver Nota Atual
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
                </div>
            )}
        </div>
    ) }

export default Manutencoes