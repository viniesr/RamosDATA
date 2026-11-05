import { useState, useEffect } from "react"

function Rodagem(){

    const [telaInterna, setTelaInterna] = useState('lista')

    const [rodagens, setRodagens] = useState([])
    const [veiculos, setVeiculos] = useState([])

    const [veiculoId, setVeiculoId] = useState('')
    const [semana, setSemana] = useState('')
    const [dataInicio, setDataInicio] = useState('')
    const [dataFim, setDataFim] = useState('')
    const [kmRodado, setKmRodado] = useState('')
    const [observacao, setObservacao] = useState('')
    const [idEditando, setIdEditando] = useState(null)

    return (
        <div>
            <h2>Registro de Rodagem e Consumo</h2>
        </div>
    )
}

export default Rodagem