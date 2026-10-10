import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Veiculos from './pages/Veiculos';
import Vendedores from './pages/Vendedores';
import Funcionarios from './pages/Funcionarios';
import Abastecimentos from './pages/Abastecimentos';
import Manutencoes from './pages/Manutencoes';


function App() {
  const [telaAtual, setTelaAtual] = useState('funcionarios')
  
  function navegarPara(novaTela) {
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

    if (telaAtual == 'funcionarios'){
      return <Funcionarios/>
    }

    if (telaAtual == 'abastecimentos'){
      return <Abastecimentos/>
    }
    if (telaAtual == 'manutencoes'){
      return <Manutencoes/>
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