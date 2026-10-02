import { useState } from 'react';
import ListarFuncionarios from './pages/ListarFuncionarios';
import CadastrarFuncionario from './pages/CadastrarFuncionario';
import Sidebar from './components/Sidebar';
import Veiculos from './pages/Veiculos';
import Vendedores from './pages/Vendedores';


function App() {
  const [telaAtual, setTelaAtual] = useState('listarFuncionario')
  
  // Nova gaveta: guarda os dados do funcionário quando clicamos em "Editar"
  const [funcionarioEditando, setFuncionarioEditando] = useState(null)


  // Função ÚNICA para navegar e gerenciar as gavetas de edição
  function navegarPara(novaTela, dados = null) {
    if (novaTela === 'cadastrarFuncionario') {
      setFuncionarioEditando(dados)
  
    } else if (novaTela === 'cadastrarVendedor') {
      setFuncionarioEditando(null) // Limpa o funcionário pra não misturar
    } else {
      // Quando for pra uma tela de lista (ou qualquer outra), limpa as duas gavetas
      setFuncionarioEditando(null)
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
    
    if (telaAtual === 'veiculos'){
      return <Veiculos/>
    }

    if (telaAtual == 'vendedores'){
      return <Vendedores/>
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