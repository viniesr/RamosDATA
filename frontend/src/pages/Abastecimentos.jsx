import { useState, useEffect } from "react"

function Abastecimentos() {
    // Controla se vemos a lista ou o formulário
    const [telaInterna, setTelaInterna] = useState('lista')

    // Listas que vêm do banco de dados
    const [abastecimentos, setAbastecimentos] = useState([])
    const [veiculos, setVeiculos] = useState([])

    // Estados para cada caixinha do formulário
    const [veiculoId, setVeiculoId] = useState('')
    const [data, setData] = useState(new Date().toISOString().split('T')[0]) // Já vem com a data de HOJE
    const [km, setKm] = useState('')
    const [tipoCombustivel, setTipoCombustivel] = useState('Diesel')
    const [valor, setValor] = useState('')
    const [litros, setLitros] = useState('')
    const [idEditando, setIdEditando] = useState(null)

    useEffect(() => {
        // Puxa a lista de veículos cadastrados no backend
        fetch('http://127.0.0.1:8000/veiculos/')
            .then((resposta) => resposta.json())
            .then((dados) => setVeiculos(dados))

        // Puxa a lista de abastecimentos cadastrados no backend
        fetch('http://127.0.0.1:8000/abastecimentos/')
            .then((resposta) => resposta.json())
            .then((dados) => setAbastecimentos(dados))
    }, [telaInterna])

    function FormularioNovoAbastecimento(){
        setVeiculoId('')
        setData(new Date().toISOString().split('T')[0])
        setKm('')
        setTipoCombustivel('')
        setValor('')
        setLitros('')
        setIdEditando(null)
        setTelaInterna('formulario')
    }

    function FormularioEditarAbastecimento(abastecimento) {
        setVeiculoId(abastecimento.veiculo_id)
        setData(abastecimento.data || '')
        setKm(abastecimento.km ?? '')
        setTipoCombustivel(abastecimento.tipo_combustivel || '')
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
            }) .then(() => setTelaInterna('lista'))
        } else {
            fetch('http://127.0.0.1:8000/abastecimentos/', {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(pacote)
            }) .then(() => setTelaInterna('lista'))
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

    function obterNomeVeiculo(id) {
        const veiculo = veiculos.find((veiculo) => veiculo.id === id)
        return veiculo ? veiculo.modelo : `Veículo #${id}`
    }

    return (
        <div>
            {telaInterna === 'lista' ? (
                <div>
                    <h2>Lista de Abastecimentos</h2>
                    <button onClick={FormularioNovoAbastecimento}>+ Registrar Abastecimento</button>

                    <table>
                        <thead>
                            <tr>
                                <th>Veículo</th>
                                <th>Km</th>
                                <th>Data</th>
                                <th>Combustível</th>
                                <th>Valor</th>
                                <th>Litros</th>
                                <th>R$ / L</th> {/* <- Nova Coluna */}
                                <th>Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            {abastecimentos.map((item) => (
                                <tr key={item.id}>
                                    <td>{obterNomeVeiculo(item.veiculo_id)}</td>
                                    <td>{item.km !== null ? item.km : '-'}</td>
                                    
                                    {/* Formata 'AAAA-MM-DD' para 'DD/MM/AAAA' */}
                                    <td>
                                        {item.data ? item.data.split('-').reverse().join('/') : '-'}
                                    </td>

                                    <td>{item.tipo_combustivel}</td>

                                    {/* Formata de 250 para R$ 250,00 e 91.58 para R$ 91,58 */}
                                    <td>
                                        {item.valor !== null 
                                            ? `R$ ${Number(item.valor).toFixed(2).replace('.', ',')}` 
                                            : '-'}
                                    </td>

                                    <td>{item.litros !== null ? `${item.litros} L` : '-'}</td>

                                    {/* Preço por litro com 2 casas decimais e vírgula */}
                                    <td>
                                        {item.valor && item.litros 
                                            ? `R$ ${(item.valor / item.litros).toFixed(2).replace('.', ',')}` 
                                            : '-'}
                                    </td>

                                    <td>
                                        <button onClick={() => FormularioEditarAbastecimento(item)}>Editar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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

                        {/* Os próximos campos vão entrar aqui */}

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