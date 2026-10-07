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

    function FormularioNovoAbastecimento(){
        setVeiculoId('')
        setData(new Date().toISOString().split('T')[0])
        setKm('')
        setTipoCombustivel('')
        setValor('')
        setLitros('')
        setIdEditando(null)
        setTelaInterna('formulario')
    }

    function FormularioEditarAbastecimento(abastecimento) {
        setVeiculoId(abastecimento.veiculo_id)
        setData(abastecimento.data || '')
        setKm(abastecimento.km ?? '')
        setTipoCombustivel(abastecimento.tipo_combustivel || '')
        setValor(abastecimento.valor ?? '')
        setLitros(abastecimento.litros ?? '')
        setIdEditando(abastecimento.id)
        setTelaInterna('formulario')
    }

    function salvarAbastecimento(evento){
        evento.preventDefault()

        const pacote = {
            veiculo_id: Number(veiculoId),
            data: data,
            km: km !== '' ? Number(km) : null,
            tipo_combustivel: tipoCombustivel,
            valor: valor !== '' ? Number(valor) : null,
            litros: litros !== '' ? Number(litros) : null
        }

        if (idEditando !== null){
            fetch('http://127.0.0.1:8000/abastecimentos/' + idEditando, {
                method: 'PUT',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(pacote)
            }) .then(() => setTelaInterna('lista'))
        } else {
            fetch('http:127.0.0.1:8000/abastecimentos/', {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(pacote)
            }) .then(() => setTelaInterna('lista'))
        }
    }

function deletarAbastecimento() {
        const confirmou = window.confirm("Tem certeza que deseja apagar este registro de abastecimento?")
        if (confirmou && idEditando !== null) {
            fetch('http://127.0.0.1:8000/abastecimentos/' + idEditando, {
                method: 'DELETE'
            }).then(() => setTelaInterna('lista'))
        }
    }

    return (
        <div>
            <h2>Módulo de Abastecimentos</h2>
        </div>
    )
}

export default Abastecimentos