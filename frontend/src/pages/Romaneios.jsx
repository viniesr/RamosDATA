import { useEffect, useState } from "react"
// No Passo 3, vamos importar o Workspace aqui:
// import CicloWorkspace from "./CicloWorkspace"

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
                    style={{ marginBottom: '20px', cursor: 'pointer' }}
                >
                    ← Voltar para a Lista de Ciclos
                </button>
                <h2>(O ambiente de trabalho do Ciclo #{cicloAbertoId} vai entrar aqui no Passo 3!)</h2>
                
                {/* No próximo passo, isto será:
                <CicloWorkspace cicloId={cicloAbertoId} /> 
                */}
            </div>
        )
    }

    // TELA 1: LISTAGEM GERAL DE CICLOS
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Gestão de Romaneios — Ciclos</h2>
                {/* A lógica do modal de Novo Ciclo pode ser adicionada neste botão depois */}
                <button style={{ padding: '10px 15px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    + Novo Ciclo
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {ciclos.length === 0 ? (
                    <p>Nenhum ciclo encontrado.</p>
                ) : (
                    ciclos.map(ciclo => (
                        <div key={ciclo.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px' }}>
                            {/* Correção aplicada: usando ciclo.nome conforme o schemas.py */}
                            <h3 style={{ margin: '0 0 10px 0' }}>{ciclo.nome}</h3>
                            <p style={{ margin: '5px 0' }}><strong>Período:</strong> {ciclo.data_inicio} até {ciclo.data_fim}</p>
                            <p style={{ margin: '5px 0' }}><strong>Status:</strong> {ciclo.status}</p>
                            
                            <button 
                                onClick={() => setCicloAbertoId(ciclo.id)}
                                style={{ marginTop: '10px', padding: '8px 12px', cursor: 'pointer' }}
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