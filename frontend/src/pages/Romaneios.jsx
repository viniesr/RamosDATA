import { useEffect, useState } from "react"
import CicloWorkspace from "./CicloWorkspace"

function Romaneios() {
    const [ciclos, setCiclos] = useState([])
    const [cicloAbertoId, setCicloAbertoId] = useState(null)
    const [nomeNovoCiclo, setNomeNovoCiclo] = useState('')
    const [dataInicioNovoCiclo, setDataInicioNovoCiclo] = useState('')
    const [dataFimNovoCiclo, setDataFimNovoCiclo] = useState('')
    const [cicloEmEdicaoId, setCicloEmEdicaoId] = useState(null)
    const [nomeEditando, setNomeEditando] = useState('')
    const [dataInicioEditando, setDataInicioEditando] = useState('')
    const [dataFimEditando, setDataFimEditando] = useState('')

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

    function deletarCiclo(id) {
        if (window.confirm("Tem certeza que deseja apagar este ciclo? Essa ação não poderá ser desfeita.")) {
            fetch(`http://127.0.0.1:8000/ciclos/${id}`, {
                method: 'DELETE'
            }).then(resposta => {
                if (resposta.ok) {
                    carregarCiclos() // Atualiza a lista na tela
                    alert("Ciclo apagado com sucesso!")
                } else {
                    alert("Erro ao apagar o ciclo.")
                }
            })
        }
    }

    function alternarStatusCiclo(ciclo) {
        // Se está Aberto, vira Fechado. Se está Fechado, vira Aberto.
        const novoStatus = ciclo.status === "Aberto" ? "Fechado" : "Aberto"

        const dadosAtualizados = {
            nome: ciclo.nome,
            data_inicio: ciclo.data_inicio,
            data_fim: ciclo.data_fim,
            status: novoStatus
        }

        fetch(`http://127.0.0.1:8000/ciclos/${ciclo.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosAtualizados)
        }).then(resposta => {
            if (resposta.ok) {
                carregarCiclos() // Atualiza a tela com o novo status
            } else {
                alert("Erro ao alterar o status do ciclo.")
            }
        })
    }

    function iniciarEdicao(ciclo) {
        setCicloEmEdicaoId(ciclo.id)
        setNomeEditando(ciclo.nome)
        setDataInicioEditando(ciclo.data_inicio || '')
        setDataFimEditando(ciclo.data_fim || '')
    }

    function cancelarEdicao() {
        setCicloEmEdicaoId(null)
        setNomeEditando('')
        setDataInicioEditando('')
        setDataFimEditando('')
    }

    function salvarEdicaoCiclo(evento, cicloOriginal) {
        evento.preventDefault()

        const dadosAtualizados = {
            nome: nomeEditando,
            data_inicio: dataInicioEditando !== '' ? dataInicioEditando : null,
            data_fim: dataFimEditando !== '' ? dataFimEditando : null,
            status: cicloOriginal.status // Mantém o status que já estava
        }

        fetch(`http://127.0.0.1:8000/ciclos/${cicloOriginal.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosAtualizados)
        }).then(resposta => {
            if (resposta.ok) {
                carregarCiclos()
                cancelarEdicao()
                alert("Ciclo atualizado com sucesso!")
            } else {
                alert("Erro ao atualizar o ciclo.")
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
                            {cicloEmEdicaoId === ciclo.id ? (
                                /* MODO DE EDIÇÃO (Formulário) */
                                <form onSubmit={(e) => salvarEdicaoCiclo(e, ciclo)}>
                                    <h4>Editando Ciclo #{ciclo.id}</h4>
                                    
                                    <div>
                                        <label>Nome: </label>
                                        <input 
                                            type="text" 
                                            value={nomeEditando} 
                                            onChange={(e) => setNomeEditando(e.target.value)} 
                                            required 
                                        />
                                    </div>

                                    <div>
                                        <label>Data Início: </label>
                                        <input 
                                            type="date" 
                                            value={dataInicioEditando} 
                                            onChange={(e) => setDataInicioEditando(e.target.value)} 
                                        />
                                    </div>

                                    <div>
                                        <label>Data Fim: </label>
                                        <input 
                                            type="date" 
                                            value={dataFimEditando} 
                                            onChange={(e) => setDataFimEditando(e.target.value)} 
                                        />
                                    </div>

                                    <button type="submit">Salvar Alterações</button>
                                    <button type="button" onClick={cancelarEdicao}>Cancelar</button>
                                </form>
                            ) : (
                                /* MODO DE VISUALIZAÇÃO NORMAL */
                                <div>
                                    <h3>{ciclo.nome}</h3>
                                    <p><strong>Período:</strong> {ciclo.data_inicio} até {ciclo.data_fim}</p>
                                    <p><strong>Status:</strong> {ciclo.status}</p>
                                    
                                    <button onClick={() => setCicloAbertoId(ciclo.id)}>
                                        Abrir Workspace
                                    </button>

                                    <button onClick={() => iniciarEdicao(ciclo)}>
                                        Editar
                                    </button>

                                    <button onClick={() => alternarStatusCiclo(ciclo)}>
                                        {ciclo.status === "Aberto" ? "Fechar Ciclo" : "Reabrir Ciclo"}
                                    </button>

                                    <button onClick={() => deletarCiclo(ciclo.id)}>
                                        Excluir Ciclo
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Romaneios