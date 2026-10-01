function Sidebar({ navegarPara }) {
  return (
    <aside style={{ width: '220px', background: '#f0f0f0', padding: '15px', height: '100vh' }}>
      <h2>RamosDATA</h2>
      
      <nav>
        {/* HOME */}
        <div>
          <button onClick={() => navegarPara('home')}>Home</button>
        </div>

        {/* MÓDULO OPERAÇÕES */}
        <h4>Operações</h4>
        <ul>
          <li>
            <button onClick={() => navegarPara('romaneios')}>Romaneios</button>
          </li>
        </ul>

        {/* MÓDULO FROTA */}
        <h4>Frota</h4>
        <ul>
          <li><button onClick={() => navegarPara('veiculos')}>Veículos</button></li>
          <li><button onClick={() => navegarPara('manutencoes')}>Manutenções</button></li>
          <li><button onClick={() => navegarPara('abastecimentos')}>Abastecimentos</button></li>
          <li><button onClick={() => navegarPara('infracoes')}>Infrações</button></li>
        </ul>

        {/* MÓDULO FUNCIONÁRIOS */}
        <h4>Funcionários</h4>
        <ul>
          <li><button onClick={() => navegarPara('cadastrarFuncionario')}>Cadastrar Funcionário</button></li>
          <li><button onClick={() => navegarPara('listarFuncionario')}>Listar Funcionário</button></li>
          <li><button onClick={() => navegarPara('proventos')}>Proventos</button></li>
        </ul>

        {/* MÓDULO COMERCIAL */}
        <h4>Comercial</h4>
        <ul>
          <li><button onClick={() => navegarPara('cadastrarVendedor')}>Cadastrar Vendedor</button></li>
          <li><button onClick={() => navegarPara('listarVendedor')}>Listar Vendedor</button></li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar