import { useEffect, useState } from "react"
import CicloWorkspace from "./CicloWorkspace"

function Romaneios() {
    const [ciclos, setCiclos] = useState([])
    const [cicloAbertoId, setCicloAbertoId] = useState(null)

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

    // TELA 1: LISTAGEM GERAL DE CICLOS
    return (
        <div>
            <div>
                <h2>Gestão de Romaneios — Ciclos</h2>
                {/* A lógica do modal de Novo Ciclo pode ser adicionada neste botão depois */}
                <button>
                    + Novo Ciclo
                </button>
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