from sqlalchemy.orm import Session
import models
import schemas

def create_funcionario(db: Session, funcionario: schemas.FuncionarioCreate):
    db_funcionario = models.Funcionario(
        nome=funcionario.nome,
        cpf= funcionario.cpf,
        status= funcionario.status
    )

    db.add(db_funcionario)
    db.commit()
    db.refresh(db_funcionario)
    return db_funcionario

def get_funcionarios(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Funcionario).offset(skip).limit(limit).all()

def get_funcionario_by_id(db: Session, funcionario_id: int):
    return db.query(models.Funcionario).filter(models.Funcionario.id == funcionario_id).first()

def update_funcionario(db: Session, funcionario_id: int, updating_funcionario: schemas.FuncionarioCreate):

    db_funcionario = get_funcionario_by_id(db, funcionario_id)

    if not db_funcionario:
        return None

    db_funcionario.nome = updating_funcionario.nome
    db_funcionario.cpf = updating_funcionario.cpf
    db_funcionario.status = updating_funcionario.status

    db.commit()
    db.refresh(db_funcionario)
    return db_funcionario

def delete_funcionario(db: Session, funcionario_id: int):
    db_funcionario = get_funcionario_by_id(db,funcionario_id)

    if not db_funcionario:
        return None

    db.delete(db_funcionario)
    db.commit()
    return db_funcionario

def create_vendedor(db: Session, vendedor: schemas.VendedorCreate):
    db_vendedor = models.Vendedor(
        nome=vendedor.nome,
        loja=vendedor.loja,
        status=vendedor.status
    )

    db.add(db_vendedor)
    db.commit()
    db.refresh(db_vendedor)
    return db_vendedor

def get_vendedores(db: Session, skip: int=0, limit: int=100):
    return db.query(models.Vendedor).offset(skip).limit(limit).all()

def get_vendedor_by_id(db: Session, vendedor_id: int):
    return db.query(models.Vendedor).filter(models.Vendedor.id == vendedor_id).first()

def update_vendedor(db:Session, vendedor_id: int, updating_vendedor: schemas.VendedorCreate):
    db_vendedor = get_vendedor_by_id(db, vendedor_id)

    if not db_vendedor:
        return None

    db_vendedor.nome = updating_vendedor.nome
    db_vendedor.loja = updating_vendedor.loja
    db_vendedor.status = updating_vendedor.status

    db.commit()
    db.refresh(db_vendedor)
    return db_vendedor

def delete_vendedor(db:Session, vendedor_id: int):
    db_vendedor = get_vendedor_by_id(db,vendedor_id)

    if not db_vendedor:
        return None

    db.delete(db_vendedor)
    db.commit()
    return db_vendedor

def create_veiculo(db: Session, veiculo: schemas.VeiculoCreate):
    db_veiculo = models.Veiculo(
        placa=veiculo.placa,
        marca=veiculo.marca,
        modelo=veiculo.modelo,
        ano=veiculo.ano,
        status=veiculo.status
    )

    db.add(db_veiculo)
    db.commit()
    db.refresh(db_veiculo)
    return db_veiculo

def get_veiculos(db: Session, skip: int=0, limit: int=100):
    return db.query(models.Veiculo).offset(skip).limit(limit).all()

def get_veiculo_by_id(db: Session, veiculo_id: int):
    return db.query(models.Veiculo).filter(models.Veiculo.id == veiculo_id).first()

def update_veiculo(db:Session, veiculo_id: int, updating_veiculo:schemas.VeiculoCreate):
    db_veiculo = get_veiculo_by_id(db,veiculo_id)

    if not db_veiculo:
        return None

    db_veiculo.placa = updating_veiculo.placa
    db_veiculo.marca = updating_veiculo.marca
    db_veiculo.modelo = updating_veiculo.modelo
    db_veiculo.ano = updating_veiculo.ano
    db_veiculo.status = updating_veiculo.status

    db.commit()
    db.refresh(db_veiculo)
    return db_veiculo

def delete_veiculo(db:Session, veiculo_id: int):
    db_veiculo = get_veiculo_by_id(db, veiculo_id)

    if not db_veiculo:
        return None

    db.delete(db_veiculo)
    db.commit()
    return db_veiculo

def create_ciclo(db:Session, ciclo: schemas.CicloCreate):
    db_ciclo = models.Ciclo(
        nome=ciclo.nome,
        data_inicio=ciclo.data_inicio,
        data_fim=ciclo.data_fim,
        cliente=ciclo.cliente,
        observacao=ciclo.observacao,
        status=ciclo.status
    )

    db.add(db_ciclo)
    db.commit()
    db.refresh(db_ciclo)
    return db_ciclo

def get_ciclos(db:Session, skip: int=0, limit: int=100):
    return db.query(models.Ciclo).offset(skip).limit(limit).all()

def get_ciclo_by_id(db:Session, ciclo_id: int):
    return db.query(models.Ciclo).filter(models.Ciclo.id == ciclo_id).first()

def update_ciclo(db: Session, ciclo_id: int, updating_ciclo: schemas.CicloCreate):
    db_ciclo = get_ciclo_by_id(db, ciclo_id)

    if not db_ciclo:
        return None

    db_ciclo.nome = updating_ciclo.nome
    db_ciclo.data_inicio = updating_ciclo.data_inicio
    db_ciclo.data_fim = updating_ciclo.data_fim
    db_ciclo.cliente = updating_ciclo.cliente
    db_ciclo.observacao = updating_ciclo.observacao
    db_ciclo.status = updating_ciclo.status

    db.commit()
    db.refresh(db_ciclo)
    return db_ciclo

def delete_ciclo(db:Session, ciclo_id: int):
    db_ciclo = get_ciclo_by_id(db, ciclo_id)

    if not db_ciclo:
        return None

    db.delete(db_ciclo)
    db.commit()
    return db_ciclo

def create_pacote(db:Session, pacote: schemas.PacoteCreate):
    db_pacote=models.Pacote(
        ciclo_id=pacote.ciclo_id,
        nome=pacote.nome,
        valor=pacote.valor,
        observacao=pacote.observacao
    )

    db.add(db_pacote)
    db.commit()
    db.refresh(db_pacote)
    return db_pacote

def get_pacotes(db:Session, skip: int=0, limit: int=100):
    return db.query(models.Pacote).offset(skip).limit(limit).all()

def get_pacote_by_id(db:Session, pacote_id: int):
    return db.query(models.Pacote).filter(models.Pacote.id == pacote_id).first()

def update_pacote(db: Session, pacote_id: int, updating_pacote: schemas.PacoteCreate):
    db_pacote = get_pacote_by_id(db,pacote_id)

    if not db_pacote:
        return None

    db_pacote.ciclo_id = updating_pacote.ciclo_id
    db_pacote.nome = updating_pacote.nome
    db_pacote.valor = updating_pacote.valor
    db_pacote.observacao = updating_pacote.observacao

    db.commit()
    db.refresh(db_pacote)
    return db_pacote

def delete_pacote(db: Session, pacote_id: int):
    db_pacote = get_pacote_by_id(db, pacote_id)

    if not db_pacote:
        return None

    db.delete(db_pacote)
    db.commit()
    return db_pacote

def create_entrega(db:Session, entrega: schemas.EntregaCreate):
    db_entrega=models.Entrega(
        ciclo_id=entrega.ciclo_id,
        pacote_id=entrega.pacote_id,
        os=entrega.os,
        data=entrega.data,
        destino=entrega.destino,
        uf=entrega.uf,
        veiculo_id=entrega.veiculo_id,
        motorista_id=entrega.motorista_id,
        ajudante1_id=entrega.ajudante1_id,
        ajudante2_id=entrega.ajudante2_id,
        ajudante3_id=entrega.ajudante3_id,
        vendedor_id=entrega.vendedor_id,
        valor=entrega.valor,
        peso=entrega.peso,
        observacao=entrega.observacao,
        status=entrega.status
    )

    db.add(db_entrega)
    db.commit()
    db.refresh(db_entrega)
    return db_entrega

def get_entregas(db:Session, skip: int=0, limit: int=100):
    return db.query(models.Entrega).offset(skip).limit(limit).all()

def get_entrega_by_id(db:Session, entrega_id: int):
    return db.query(models.Entrega).filter(models.Entrega.id == entrega_id).first()

def update_entrega(db:Session, entrega_id: int, updating_entrega: schemas.EntregaCreate):
    db_entrega = get_entrega_by_id(db,entrega_id)

    if not db_entrega:
        return None

    db_entrega.ciclo_id = updating_entrega.ciclo_id
    db_entrega.pacote_id = updating_entrega.pacote_id
    db_entrega.os = updating_entrega.os
    db_entrega.data = updating_entrega.data
    db_entrega.destino = updating_entrega.destino
    db_entrega.uf = updating_entrega.uf
    db_entrega.veiculo_id = updating_entrega.veiculo_id
    db_entrega.motorista_id = updating_entrega.motorista_id
    db_entrega.ajudante1_id = updating_entrega.ajudante1_id
    db_entrega.ajudante2_id = updating_entrega.ajudante2_id
    db_entrega.ajudante3_id = updating_entrega.ajudante3_id
    db_entrega.vendedor_id = updating_entrega.vendedor_id
    db_entrega.valor = updating_entrega.valor
    db_entrega.peso = updating_entrega.peso
    db_entrega.observacao = updating_entrega.observacao
    db_entrega.status = updating_entrega.status

    db.commit()
    db.refresh(db_entrega)
    return db_entrega

def delete_entrega(db: Session, entrega_id: int):
    db_entrega = get_entrega_by_id(db, entrega_id)

    if not db_entrega:
        return None

    db.delete(db_entrega)
    db.commit()
    return db_entrega

def create_abastecimento(db: Session, abastecimento: schemas.AbastecimentoCreate):
    db_abastecimento = models.Abastecimento(**abastecimento.model_dump())
    db.add(db_abastecimento)
    db.commit()
    db.refresh(db_abastecimento)
    return db_abastecimento

def get_abastecimentos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Abastecimento).offset(skip).limit(limit).all()

def update_abastecimento(db: Session, abastecimento_id: int, updating_abastecimento: schemas.AbastecimentoCreate):
    db_abastecimento = db.query(models.Abastecimento).filter(models.Abastecimento.id == abastecimento_id).first()

    if not db_abastecimento:
        return None

    db_abastecimento.veiculo_id = updating_abastecimento.veiculo_id
    db_abastecimento.data = updating_abastecimento.data
    db_abastecimento.km = updating_abastecimento.km
    db_abastecimento.tipo_combustivel = updating_abastecimento.tipo_combustivel
    db_abastecimento.valor = updating_abastecimento.valor
    db_abastecimento.litros = updating_abastecimento.litros

    db.commit()
    db.refresh(db_abastecimento)
    return db_abastecimento

def delete_abastecimento(db: Session, abastecimento_id: int):
    db_abastecimento = db.query(models.Abastecimento).filter(models.Abastecimento.id == abastecimento_id).first()
    if db_abastecimento:
        db.delete(db_abastecimento)
        db.commit()
        return True
    return False

def create_manutencao(db: Session, manutencao:schemas.ManutencaoCreate):
    db_manutencao = models.Manutencao(
        veiculo_id = manutencao.veiculo_id,
        data = manutencao.data,
        tipo = manutencao.tipo,
        quantidade = manutencao.quantidade,
        descricao = manutencao.descricao,
        km = manutencao.km,
        valor = manutencao.valor,
        observacoes = manutencao.observacoes
    )

    db.add(db_manutencao)
    db.commit()
    db.refresh(db_manutencao)
    return db_manutencao

def get_manutencoes(db:Session, skip: int = 0, limit: int = 100):
    return db.query(models.Manutencao).offset(skip).limit(limit).all()

def get_manutencao_by_id(db:Session, manutencao_id: int):
    return db.query(models.Manutencao).filter(models.Manutencao.id == manutencao_id).first()

def update_manutencao(db:Session, manutencao_id: int, updating_manutencao: schemas.ManutencaoCreate):
    db_manutencao = db.query(models.Manutencao).filter(models.Manutencao.id == manutencao_id).first()

    if not db_manutencao:
        return None

    db_manutencao.veiculo_id = updating_manutencao.veiculo_id
    db_manutencao.data = updating_manutencao.data
    db_manutencao.tipo = updating_manutencao.tipo
    db_manutencao.quantidade = updating_manutencao.quantidade
    db_manutencao.descricao = updating_manutencao.descricao
    db_manutencao.km = updating_manutencao.km
    db_manutencao.valor = updating_manutencao.valor
    db_manutencao.observacoes = updating_manutencao.observacoes

    db.commit()
    db.refresh(db_manutencao)
    return db_manutencao

def delete_manutencao(db: Session, manutencao_id: int):
    db_manutencao = get_manutencao_by_id(db, manutencao_id)

    if not db_manutencao:
        return None

    db.delete(db_manutencao)
    db.commit()
    return db_manutencao