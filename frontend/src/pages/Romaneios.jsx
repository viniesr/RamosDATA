import { useEffect, useState } from "react"

function Romaneios() {
   
    const [abaAtiva, setAbaAtiva] = useState('lancamento') 

    const [veiculos, setVeiculos] = useState([])
    const [funcionarios, setFuncioarios] = useState([])
    const [vendedores, setVendedores] = useState([])
    const [entregasSoltas, setEntregasSoltas] = useState([])
    
    const [veiculoId, setVeiculoId] = useState('')
    const [motoristaId, setMotoristaId] = useState('')
    const [ajudanteId, setAjudanteId] = useState('')
    const [vendedorId, setVendedorId] = useState('')

    const [os, setOs] = useState('')
    const [dataEntrega, setDataEntrega] = useState(new Date().toISOString().split('T')[0])
    const [destino, setDestino] = useState('')
    const [uf, setUf] = useState('')
    const [observacao, setObservacao] = useState('')

    useEffect(() => {
        fetch('http://127.0.0.1:8000/veiculos/')
        .then(resposta => resposta.json())
        .then(dados => setVeiculos(dados))

        fetch('http://127.0.0.1:8000/funcionarios/')
        .then(resposta => resposta.json())
        .then(dados => setFuncioarios(dados))

        fetch('http://127.0.0.1:8000/vendedores/')
        .then(resposta => resposta.json())
        .then(dados => setVendedores(dados))

        buscarEntregasSoltas()
    }, [])

    function buscarEntregasSoltas(){
        fetch('http://127.0.0.1:8000/entregas/')
        .then(resposta => resposta.json())
        .then(dados => {
            const soltas = dados.filter(evento => evento.pacote_id === null)
            setEntregasSoltas(soltas)
        })
    }

    function salvarLancamento(evento) {
        evento.preventDefault()

        const dadosDaEntrega = {
            os: os !== '' ? os : null,
            data: dataEntrega,
            destino: destino !== '' ? destino : null,
            uf: uf !== '' ? uf : null,
            veiculo_id: veiculoId !== '' ? Number(veiculoId) : null,
            motorista_id: motoristaId !== '' ? Number(motoristaId) : null,
            ajudante1_id: ajudanteId !== '' ? Number(ajudanteId) : null,
            vendedor_id: vendedorId !== '' ? Number(vendedorId) : null,
            observacao: observacao !== '' ? observacao : null,
            status: "Entregue"
        }

        fetch('http://127.0.0.1:8000/entregas/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosDaEntrega)
        }).then(resposta => {
         
            setOs('')
            setDestino('')
            setObservacao('')
            setVeiculoId('')
            setMotoristaId('')
            setAjudanteId('')
            setVendedorId('')
            
      
            buscarEntregasSoltas()
        })
    }

    return (
        <></>
    )
}

export default Romaneios