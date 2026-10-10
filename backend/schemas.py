from pydantic import BaseModel
from typing import Optional

class FuncionarioBase(BaseModel):
    nome: str
    cpf: Optional[str] = None
    status: str = "Ativo"

class FuncionarioCreate(FuncionarioBase):
    pass

class FuncionarioResponse(FuncionarioBase):
    id: int

    class Config:
        from_attributes = True

class VendedorBase(BaseModel):
    nome: str
    loja: Optional[str] = None
    status: str = "Ativo"

class VendedorCreate(VendedorBase):
    pass

class VendedorResponse(VendedorBase):
    id: int

    class Config:
        from_attributes = True

class VeiculoBase(BaseModel):
    placa: Optional[str] = None
    marca: Optional[str] = None
    modelo: str
    ano: Optional[int] = None
    status: str = "Ativo"

class VeiculoCreate(VeiculoBase):
    pass

class VeiculoResponse(VeiculoBase):
    id: int

    class Config:
        from_attributes = True

class CicloBase(BaseModel):
    nome: str
    data_inicio: Optional[str] = None
    data_fim: Optional[str] = None
    cliente: Optional[str] = None
    observacao: Optional[str] = None
    status: Optional[str] = None

class CicloCreate(CicloBase):
    pass

class CicloResponse(CicloBase):
    id: int

    class Config:
        from_attributes = True

class PacoteBase(BaseModel):
    ciclo_id: int
    nome: str
    valor: Optional[float] = None
    observacao: Optional[str] = None

class PacoteCreate(PacoteBase):
    pass 

class PacoteResponse(PacoteBase):
    id: int

    class Config:
        from_attributes = True

class EntregaBase(BaseModel):
    ciclo_id: Optional[int] = None
    pacote_id: Optional[int] = None
    os: Optional[str] = None
    data: str
    destino: Optional[str] = None
    uf: Optional[str] = None
    veiculo_id: Optional[int] = None
    motorista_id: Optional[int] = None
    ajudante1_id: Optional[int] = None
    ajudante2_id: Optional[int] = None
    ajudante3_id: Optional[int] = None
    vendedor_id: Optional[int] = None
    valor: Optional[float] = None
    peso: Optional[float] = None
    observacao: Optional[str] = None
    status: str = "Entregue"

class EntregaCreate(EntregaBase):
    pass 

class EntregaResponse(EntregaBase):
    id: int

    class Config:
        from_attributes = True

class AbastecimentoBase(BaseModel):
    veiculo_id: int
    data: str
    km: Optional[int] = None
    tipo_combustivel: Optional[str] = None
    valor: Optional[float] = None
    litros: Optional[float] = None

class AbastecimentoCreate(AbastecimentoBase):
    pass

class AbastecimentoResponse(AbastecimentoBase):
    id: int

    class Config:
        from_attributes = True

class ManutencaoBase(BaseModel):
    veiculo_id: int
    data: str
    tipo: str
    quantidade: Optional[int] = None
    descricao: str
    km: Optional[int] = None
    valor: Optional[float] = None
    observacoes: Optional[str] = None
    comprovante: Optional[str] = None

class ManutencaoCreate(ManutencaoBase):
    pass

class ManutencaoResponse(ManutencaoBase):
    id: int

    class Config:
        from_attributes = True