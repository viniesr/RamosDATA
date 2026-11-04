import { useEffect, useState } from "react"
import CicloWorkspace from "./CicloWorkspace"

function Romaneios() {
    const [ciclos, setCiclos] = useState([])
    const [cicloAbertoId, setCicloAbertoId] = useState(null)
    const [nomeNovoCiclo, setNomeNovoCiclo] = useState('')
    const [dataInicioNovoCiclo, setDataInicioNovoCiclo] = useState('')
    const [dataFimNovoCiclo, setDataFimNovoCiclo] = useState('')

    // Busca os ciclos no backend assim que a tela abre
    useEffect(() => {
        carregarCiclos()
    }, [])

    function carregarCiclos() {
        fetch('http://127.0.0.1:8000/ciclos/')
            .then(resposta => resposta.json())
            .then(dados => setCiclos(dados))
    }

    // Se o utilizador clicou num ciclo, a tela muda para o Workspace desse ciclo
    if (cicloAbertoId) {
        return (
            <div>
                <button 
                    onClick={() => setCicloAbertoId(null)} 
                >
                    ← Voltar para a Lista de Ciclos
                </button>
                <CicloWorkspace cicloId={cicloAbertoId}/>

            </div>
        )
    }

    function criarNovoCiclo(evento) {
        evento.preventDefault() // Evita que a página recarregue ao apertar o botão

        const dadosDoCiclo = {
            nome: nomeNovoCiclo,
            data_inicio: dataInicioNovoCiclo,
            data_fim: dataFimNovoCiclo,
            status: "Aberto"
        }

        fetch('http://127.0.0.1:8000/ciclos/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosDoCiclo)
        }).then(resposta => {
            if (resposta.ok) {
                carregarCiclos() // Puxa a lista atualizada para a tela
                
                // Limpa os campos depois que criou com sucesso
                setNomeNovoCiclo('')
                setDataInicioNovoCiclo('')
                setDataFimNovoCiclo('')
                
                alert("Novo ciclo criado com sucesso!")
            } else {
                alert("Erro ao criar o ciclo.")
            }
        })
    }

    // TELA 1: LISTAGEM GERAL DE CICLOS
    return (
        <div>
            <div>
                <h2>Gestão de Romaneios — Ciclos</h2>
                
                <div>
                    <h3>Abrir Novo Ciclo</h3>
                    <form onSubmit={criarNovoCiclo}>
                        <label>Nome do Ciclo (Ex: NOV I): </label>
                        <input 
                            type="text" 
                            value={nomeNovoCiclo} 
                            onChange={(evento) => setNomeNovoCiclo(evento.target.value)} 
                            required 
                        />
                        
                        <label> Data Início: </label>
                        <input 
                            type="date" 
                            value={dataInicioNovoCiclo} 
                            onChange={(evento) => setDataInicioNovoCiclo(evento.target.value)} 
                        />

                        <label> Data Fim: </label>
                        <input 
                            type="date" 
                            value={dataFimNovoCiclo} 
                            onChange={(evento) => setDataFimNovoCiclo(evento.target.value)} 
                        />
                        
                        <button type="submit">+ Criar Ciclo</button>
                    </form>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {ciclos.length === 0 ? (
                    <p>Nenhum ciclo encontrado.</p>
                ) : (
                    ciclos.map(ciclo => (
                        <div key={ciclo.id}>
                            {/* Correção aplicada: usando ciclo.nome conforme o schemas.py */}
                            <h3>{ciclo.nome}</h3>
                            <p><strong>Período:</strong> {ciclo.data_inicio} até {ciclo.data_fim}</p>
                            <p><strong>Status:</strong> {ciclo.status}</p>
                            
                            <button 
                                onClick={() => setCicloAbertoId(ciclo.id)}
                            >
                                Abrir Workspace
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Romaneios