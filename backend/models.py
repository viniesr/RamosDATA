from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Funcionario(Base):
    __tablename__ = "funcionarios"

    id = Column(Integer, primary_key = True, index = True, autoincrement = True)
    nome = Column(String, nullable=False)
    cpf = Column(String, nullable=True)
    status = Column(String, default="Ativo", nullable=False)

class Vendedor(Base):
    __tablename__ = "vendedores"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nome = Column(String, nullable=False)
    loja = Column(String, nullable=True)
    status = Column(String, default="Ativo", nullable=False)

class Veiculo(Base):
    __tablename__ = "veiculos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    placa = Column(String, nullable=True)
    marca = Column(String, nullable=True)
    modelo = Column(String, nullable=False)
    ano = Column(Integer, nullable=True)
    status = Column(String, default="Ativo", nullable=False)

class Ciclo(Base):
    __tablename__ = "ciclos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nome = Column(String, nullable=False)
    data_inicio = Column(String, nullable=True)
    data_fim = Column(String, nullable=True)
    cliente = Column(String, nullable=True)
    observacao = Column(String, nullable=True)
    status = Column(String, nullable=True)

class Pacote(Base):
    __tablename__ = "pacotes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    ciclo_id = Column(Integer, ForeignKey("ciclos.id"), nullable=False)
    nome =  Column(String, nullable=False)
    valor = Column(Float, nullable=True)
    observacao = Column(String, nullable=True)

    ciclo = relationship("Ciclo")

class Entrega(Base):
    __tablename__ = "entregas"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    ciclo_id = Column(Integer, ForeignKey("ciclos.id"), nullable=True)
    pacote_id = Column(Integer, ForeignKey("pacotes.id"), nullable=True)
    os = Column(String, nullable=True)
    data = Column(String, nullable=False)
    destino = Column(String, nullable=True)
    uf = Column(String, nullable=True)
    veiculo_id = Column(Integer, ForeignKey("veiculos.id"), nullable=True)
    motorista_id = Column(Integer, ForeignKey("funcionarios.id"), nullable=True)
    ajudante1_id = Column(Integer, ForeignKey("funcionarios.id"), nullable=True)
    ajudante2_id = Column(Integer, ForeignKey("funcionarios.id"), nullable=True)
    ajudante3_id = Column(Integer, ForeignKey("funcionarios.id"), nullable=True)
    vendedor_id = Column(Integer, ForeignKey("vendedores.id"), nullable=True)
    valor = Column(Float, nullable=True)
    peso = Column(Float, nullable=True)
    observacao = Column(String, nullable=True)
    status = Column(String, default="Entregue", nullable=False)

    ciclo = relationship("Ciclo")
    pacote = relationship("Pacote")
    veiculo = relationship("Veiculo")
    motorista = relationship("Funcionario", foreign_keys=[motorista_id])
    ajudante1 = relationship("Funcionario", foreign_keys=[ajudante1_id])
    ajudante2 = relationship("Funcionario", foreign_keys=[ajudante2_id])
    ajudante3 = relationship("Funcionario", foreign_keys=[ajudante3_id])
    vendedor = relationship("Vendedor")