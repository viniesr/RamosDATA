import { useState, useEffect } from "react"

// O { cicloId } é a "porta de entrada". Ele recebe o ID que a Tela 1 enviou.
function CicloWorkspace({ cicloId }) {
    
    return (
        <div>
            <h2>Área de Trabalho do Ciclo #{cicloId}</h2>
            <p>Este componente agora sabe que precisa carregar as entregas da quinzena {cicloId}.</p>
        </div>
    )
}

export default CicloWorkspace