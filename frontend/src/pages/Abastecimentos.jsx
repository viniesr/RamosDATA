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

    return (
        <div>
            <h2>Módulo de Abastecimentos</h2>
        </div>
    )
}

export default Abastecimentos