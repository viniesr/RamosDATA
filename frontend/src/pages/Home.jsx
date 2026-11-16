import { useState, useEffect } from "react"

function Home() {

    const [veiculos, setVeiculos] = useState([])
    const [ciclos, setCiclos] = useState([])
    const [pacotes, setPacotes] = useState([])
    const [entregas, setEntregas] = useState([])
    const [abastecimentos, setAbastecimentos] = useState([])
    const [manutencoes, setManutencoes] = useState([])
    const [proventos, setProventos] = useState([])
    const [infracoes, setInfracoes] = useState([])
    const [rodagens, setRodagens] = useState([])

    const [mesSelecionado, setMesSelecionado] = useState('2026-11')

    useEffect(() => {
        fetch('http://127.0.0.1:8000/veiculos/').then(r => r.json()).then(d => setVeiculos(d))
        fetch('http://127.0.0.1:8000/ciclos/').then(r => r.json()).then(d => setCiclos(d))
        fetch('http://127.0.0.1:8000/pacotes/').then(r => r.json()).then(d => setPacotes(d))
        fetch('http://127.0.0.1:8000/entregas/').then(r => r.json()).then(d => setEntregas(d))
        fetch('http://127.0.0.1:8000/abastecimentos/').then(r => r.json()).then(d => setAbastecimentos(d))
        fetch('http://127.0.0.1:8000/manutencoes/').then(r => r.json()).then(d => setManutencoes(d))
        fetch('http://127.0.0.1:8000/proventos/').then(r => r.json()).then(d => setProventos(d))
        fetch('http://127.0.0.1:8000/infracoes/').then(r => r.json()).then(d => setInfracoes(d))
        fetch('http://127.0.0.1:8000/rodagens/').then(r => r.json()).then(d => setRodagens(d))
    }, [])

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

    // 6. Pega apenas os proventos pagos no mês escolhido
    const proventosFiltrados = proventos.filter((item) => {
        if (!item.data_pagamento) return false
        return item.data_pagamento.startsWith(mesSelecionado)
    })

    // 7. Soma o valor de todos esses proventos filtrados
    let totalProventos = 0
    proventosFiltrados.forEach((item) => {
        totalProventos = totalProventos + Number(item.valor || 0)
    })

    // 8. Soma o Custo Total Geral (Frota + Pessoal)
    const custoTotalGeral = custoTotalFrota + totalProventos

    // 9. Pega apenas os registros de rodagem que começam no mês escolhido
    const rodagensFiltradas = rodagens.filter((item) => {
        if (!item.data_inicio) return false
        return item.data_inicio.startsWith(mesSelecionado)
    })

    // 10. Soma o KM rodado de toda a frota no mês
    let totalKmRodado = 0
    rodagensFiltradas.forEach((item) => {
        totalKmRodado = totalKmRodado + Number(item.km_rodado || 0)
    })

    // 11. Pega os ciclos que começam no mês selecionado (ex: "2026-11")
    const ciclosDoMes = ciclos.filter((c) => {
        if (!c.data_inicio) return false
        return c.data_inicio.startsWith(mesSelecionado)
    })

    // Guarda os IDs desses ciclos do mês
    const idsCiclosDoMes = ciclosDoMes.map((c) => c.id)

    // 12. Soma o valor dos PACOTES que pertencem aos ciclos deste mês
    let totalPacotesMes = 0
    pacotes.forEach((p) => {
        if (idsCiclosDoMes.includes(p.ciclo_id)) {
            totalPacotesMes = totalPacotesMes + Number(p.valor || 0)
        }
    })

    // 13. Soma o valor das ENTREGAS AVULSAS (pacote_id === null) dos ciclos deste mês
    let totalAvulsasMes = 0
    entregas.forEach((e) => {
        if (idsCiclosDoMes.includes(e.ciclo_id) && e.pacote_id === null) {
            totalAvulsasMes = totalAvulsasMes + Number(e.valor || 0)
        }
    })

    // 14. Faturamento Bruto = Pacotes + Avulsas
    const faturamentoBruto = totalPacotesMes + totalAvulsasMes

    // 15. Resultado Líquido e Margem %
    const resultadoLiquido = faturamentoBruto - custoTotalGeral
    const margemPercentual = faturamentoBruto > 0 
        ? ((resultadoLiquido / faturamentoBruto) * 100).toFixed(1) 
        : '0.0'

    // 16. Alertas e Pendências (Infrações ignoram o filtro de mês)
    const infracoesPendentes = infracoes.filter((i) => i.status && i.status.toLowerCase() === 'pendente')
    const ciclosAbertos = ciclos.filter((c) => c.status === 'Aberto')

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

            <hr />

            <h3>1. Resumo Financeiro e Operacional</h3>
            <table>
                <thead>
                    <tr>
                        <th>Faturamento Bruto</th>
                        <th>Custos de Frota (Posto + Oficina)</th>
                        <th>Despesas de Pessoal (Proventos)</th>
                        <th>Resultado Líquido</th>
                        <th>KM Rodado Geral</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>R$ {faturamentoBruto.toFixed(2).replace('.', ',')}</strong></td>
                        <td>R$ {custoTotalFrota.toFixed(2).replace('.', ',')}</td>
                        <td>R$ {totalProventos.toFixed(2).replace('.', ',')}</td>
                        <td><strong>R$ {resultadoLiquido.toFixed(2).replace('.', ',')}</strong> ({margemPercentual}%)</td>
                        <td>{totalKmRodado.toFixed(1)} km</td>
                    </tr>
                </tbody>
            </table>

            <hr />

            <h3>2. Alertas e Pendências</h3>
            <ul>
                <li>
                    <strong>Infrações Ativas (Todos os meses):</strong> {infracoesPendentes.length} multa(s) pendente(s)
                </li>
                <li>
                    <strong>Ciclos de Romaneio em Aberto:</strong> {ciclosAbertos.length} ciclo(s) aberto(s)
                </li>
            </ul>
        </div>
    )
}

export default Home