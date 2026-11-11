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

    return (
        <div>
            <h2>Visão Geral da Operação (Dashboard)</h2>
            <p>Carregando dados da RamosDATA...</p>
        </div>
    )
}

export default Home