import { useState, useEffect } from "react"

function Home() {

    const [veiculos, setVeiculos] = useState([])
    const [romaneios, setRomaneios] = useState([])
    const [abastecimentos, setAbastecimentos] = useState([])
    const [manutencoes, setManutencoes] = useState([])
    const [proventos, setProventos] = useState([])
    const [infracoes, setInfracoes] = useState([])
    const [rodagens, setRodagens] = useState([])

    useEffect(() => {
        // Busca paralela de todos os dados do sistema
        fetch('http://127.0.0.1:8000/veiculos/').then(r => r.json()).then(d => setVeiculos(d))
        fetch('http://127.0.0.1:8000/romaneios/').then(r => r.json()).then(d => setRomaneios(d))
        fetch('http://127.0.0.1:8000/abastecimentos/').then(r => r.json()).then(d => setAbastecimentos(d))
        fetch('http://127.0.0.1:8000/manutencoes/').then(r => r.json()).then(d => setManutencoes(d))
        fetch('http://127.0.0.1:8000/proventos/').then(r => r.json()).then(d => setProventos(d))
        fetch('http://127.0.0.1:8000/infracoes/').then(r => r.json()).then(d => setInfracoes(d))
        fetch('http://127.0.0.1:8000/rodagens/').then(r => r.json()).then(d => setRodagens(d))
    }, [])

    const [mesSelecionado, setMesSelecionado] = useState('2026-11')

        // 1. Pega apenas os abastecimentos onde a data começa com o mês escolhido (ex: "2026-11")
    const abastecimentosFiltrados = abastecimentos.filter((item) => {
        if (!item.data) return false
        return item.data.startsWith(mesSelecionado)
    })

    // 2. Soma o valor de todos esses abastecimentos filtrados
    let totalAbastecimentos = 0
    abastecimentosFiltrados.forEach((item) => {
        totalAbastecimentos = totalAbastecimentos + Number(item.valor || 0)
    })

    // 3. Pega apenas as manutenções do mês escolhido
    const manutencoesFiltradas = manutencoes.filter((item) => {
        if (!item.data) return false
        return item.data.startsWith(mesSelecionado)
    })

    // 4. Soma o valor de todas essas manutenções filtradas
    let totalManutencoes = 0
    manutencoesFiltradas.forEach((item) => {
        totalManutencoes = totalManutencoes + Number(item.valor || 0)
    })

    // 5. Junta os dois para ter o Custo Total da Frota no mês
    const custoTotalFrota = totalAbastecimentos + totalManutencoes

    return (
    <div>
        <h2>Visão Geral da Operação (Dashboard)</h2>

        <div>
            <label>Escolha o Mês/Ano: </label>
            <input 
                type="month" 
                value={mesSelecionado} 
                onChange={(evento) => setMesSelecionado(evento.target.value)} 
            />
        </div>

        <br />

        <table>
            <thead>
                <tr>
                    <th>Gasto com Combustível</th>
                    <th>Gasto com Manutenção</th>
                    <th>Custo Total da Frota</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>R$ {totalAbastecimentos.toFixed(2).replace('.', ',')}</td>
                    <td>R$ {totalManutencoes.toFixed(2).replace('.', ',')}</td>
                    <td><strong>R$ {custoTotalFrota.toFixed(2).replace('.', ',')}</strong></td>
                </tr>
            </tbody>
        </table>
    </div>
)
}

export default Home