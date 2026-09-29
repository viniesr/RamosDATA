import ListarFuncionarios from './pages/ListarFuncionarios'
import CadastrarFuncionario from './pages/CadastrarFuncionario'
import Sidebar from './components/Sidebar'
import { useState } from 'react'

function App() {
  const [telaAtual, setTelaAtual] = useState('listarFuncionario')
  
  // Nova gaveta: guarda os dados do funcionário quando clicamos em "Editar"
  const [funcionarioEditando, setFuncionarioEditando] = useState(null)

  // A função navegarPara agora aceita a tela e, opcionalmente, os dados do funcionário
  function navegarPara(novaTela, dadosFuncionario = null) {
    setFuncionarioEditando(dadosFuncionario)
    setTelaAtual(novaTela)
  }

  function renderizarConteudo() {
    if (telaAtual === 'listarFuncionario') {
      return <ListarFuncionarios navegarPara={navegarPara} />
    }
    
    if (telaAtual === 'cadastrarFuncionario') {
      return <CadastrarFuncionario navegarPara={navegarPara} funcionarioEditando={funcionarioEditando} />
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