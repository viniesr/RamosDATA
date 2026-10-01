import ListarFuncionarios from './pages/ListarFuncionarios'
import CadastrarFuncionario from './pages/CadastrarFuncionario'
import ListarVendedores from './pages/ListarVendedores'
import CadastrarVendedor from './pages/CadastrarVendedor'
import Sidebar from './components/Sidebar'
import { useState } from 'react'

function App() {
  const [telaAtual, setTelaAtual] = useState('listarFuncionario')
  
  // Nova gaveta: guarda os dados do funcionário quando clicamos em "Editar"
  const [funcionarioEditando, setFuncionarioEditando] = useState(null)

  const [vendedorEditando, setVendedorEditando] = useState(null)

  // Função ÚNICA para navegar e gerenciar as gavetas de edição
  function navegarPara(novaTela, dados = null) {
    if (novaTela === 'cadastrarFuncionario') {
      setFuncionarioEditando(dados)
      setVendedorEditando(null) // Limpa o vendedor pra não misturar
    } else if (novaTela === 'cadastrarVendedor') {
      setVendedorEditando(dados)
      setFuncionarioEditando(null) // Limpa o funcionário pra não misturar
    } else {
      // Quando for pra uma tela de lista (ou qualquer outra), limpa as duas gavetas
      setFuncionarioEditando(null)
      setVendedorEditando(null)
    }

    setTelaAtual(novaTela)
  }

  function renderizarConteudo() {
    if (telaAtual === 'listarFuncionario') {
      return <ListarFuncionarios navegarPara={navegarPara} />
    }
    
    if (telaAtual === 'cadastrarFuncionario') {
      return <CadastrarFuncionario navegarPara={navegarPara} funcionarioEditando={funcionarioEditando} />
    }

    if (telaAtual === 'listarVendedor') {
      return <ListarVendedores navegarPara={navegarPara} />
    }

    if (telaAtual === 'cadastrarVendedor') {
      return <CadastrarVendedor navegarPara={navegarPara} vendedorEditando={vendedorEditando} />
    }

    return (
      <div>
        <h2>Tela em desenvolvimento: {telaAtual}</h2>
        <p>Em breve esta funcionalidade estará disponível</p>
      </div>
    )
  }

  return (
    <div style={{display: 'flex'}}>
      <Sidebar navegarPara={navegarPara} />
      <main style={{padding: '20px', flex: 1}}>
        {renderizarConteudo()}
      </main>
    </div>
  )
}

export default App