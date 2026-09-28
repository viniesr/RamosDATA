from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import crud
import schemas
import models
from database import SessionLocal,engine

# CRIA O DB CASO NÃO HOUVER
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ramosDATA", description="Sistema de Gestão Logística - Ramos Transportes")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# MÉTODOS - MOTORISTAS

    # CRIAR
@app.post("/motoristas/", response_model=schemas.MotoristaResponse)
def criar_motorista(motorista: schemas.MotoristaCreate, db: Session = Depends (get_db)):
    return crud.create_motorista(db=db, motorista=motorista)

    # LISTAR
@app.get("/motoristas/", response_model=List[schemas.MotoristaResponse])
def listar_motoristas(skip: int=0, limit: int=100, db: Session = Depends (get_db)):
    return crud.get_motoristas(db=db, skip=skip,limit=limit)

    # LISTAR(ID)
@app.get("/motoristas/{motorista_id}", response_model=schemas.MotoristaResponse)
def listar_motorista_id(motorista_id: int, db: Session = Depends (get_db)):
    db_motorista = crud.get_motorista_by_id(db=db, motorista_id=motorista_id)

    if db_motorista is None:
        raise HTTPException(status_code=404, detail="Motorista não encontrado")
    return db_motorista

    # ATUALIZAR
@app.put("/motoristas/{motorista_id}", response_model=schemas.MotoristaResponse)
def atualizar_motorista(motorista_id: int, updating_motorista: schemas.MotoristaCreate, db: Session = Depends(get_db)):

    db_motorista = crud.update_motorista(db=db,motorista_id=motorista_id,updating_motorista=updating_motorista)

    if db_motorista is None:
        raise HTTPException(status_code=404, detail="Motorista não encontrado")
    return db_motorista

    # DELETAR
@app.delete("/motoristas/{motorista_id}", response_model=schemas.MotoristaResponse)
def deletar_motorista(motorista_id: int, db:Session = Depends(get_db)):
    db_motorista = crud.delete_motorista(db=db, motorista_id=motorista_id)

    if db_motorista is None:
        raise HTTPException(status_code=404, detail="Motorista não encontrado")
    return db_motorista

# MÉTODOS - VENDEDORES

    # CRIAR
@app.post("/vendedores/", response_model=schemas.VendedorResponse)
def criar_vendedor(vendedor: schemas.VendedorCreate, db: Session = Depends(get_db)):
    return crud.create_vendedor(db=db, vendedor=vendedor)

    # LISTAR
@app.get("/vendedores/", response_model=List[schemas.VendedorResponse])
def listar_vendedores(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_vendedores(db=db, skip=skip, limit=limit)

    # LISTAR(ID)
@app.get("/vendedores/{vendedor_id}", response_model=schemas.VendedorResponse)
def listar_vendedor_id(vendedor_id: int, db:Session = Depends(get_db)):
    db_vendedor = crud.get_vendedor_by_id(db=db, vendedor_id=vendedor_id)

    if db_vendedor is None:
        raise HTTPException(status_code=404, detail="Vendedor não encontrado")
    return db_vendedor

    # ATUALIZAR
@app.put("/vendedores/{vendedor_id}", response_model=schemas.VendedorResponse)
def atualizar_vendedor(vendedor_id: int, updating_vendedor: schemas.VendedorCreate, db: Session = Depends(get_db)):
    db_vendedor = crud.update_vendedor(db=db, vendedor_id=vendedor_id, updating_vendedor=updating_vendedor)

    if db_vendedor is None:
        raise HTTPException(status_code=404, detail="Vendedor não encontrado")
    return db_vendedor

    # DELETAR
@app.delete("/vendedores/{vendedor_id}", response_model=schemas.VendedorResponse)
def deletar_vendedor(vendedor_id: int, db:Session = Depends(get_db)):
    db_vendedor = crud.delete_vendedor(db=db, vendedor_id=vendedor_id)

    if db_vendedor is None:
        raise HTTPException(status_code=404, detail="Vendedor não encontrado")
    return db_vendedor

# MÉTODOS - AJUDANTES

    # CRIAR
@app.post("/ajudantes/", response_model=schemas.AjudanteResponse)
def criar_ajudante(ajudante: schemas.AjudanteCreate, db:Session = Depends(get_db)):
    return crud.create_ajudante(db=db, ajudante=ajudante)

    # LISTAR
@app.get("/ajudantes/", response_model=List[schemas.AjudanteResponse])
def listar_ajudantes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_ajudantes(db=db, skip=skip, limit=limit)

    # LISTAR(ID)
@app.get("/ajudantes/{ajudante_id}", response_model=schemas.AjudanteResponse)
def listar_ajudante_id(ajudante_id: int, db:Session = Depends(get_db)):
    db_ajudante = crud.get_ajudante_by_id(db=db,ajudante_id=ajudante_id)

    if db_ajudante is None:
        raise HTTPException(status_code=404, detail="Ajudante não encontrado")
    return db_ajudante

    # ATUALIZAR
@app.put("/ajudantes/{ajudante_id}", response_model=schemas.AjudanteResponse)
def atualizar_ajudante(ajudante_id: int, updating_ajudante: schemas.AjudanteCreate, db:Session = Depends(get_db)):
    db_ajudante = crud.update_ajudante(db=db, ajudante_id=ajudante_id, updating_ajudante=updating_ajudante)

    if db_ajudante is None:
        raise HTTPException(status_code=404, detail="Ajudante não encontrado")
    return db_ajudante

    # DELETAR
@app.delete("/ajudantes/{ajudante_id}", response_model=schemas.AjudanteResponse)
def deletar_ajudante(ajudante_id: int, db: Session = Depends(get_db)):
    db_ajudante = crud.delete_ajudante(db=db, ajudante_id=ajudante_id)

    if db_ajudante is None:
        raise HTTPException(status_code=404, detail="Ajudante não encontrado")
    return db_ajudante

# MÉTODOS - VEÍCULOS

    # CRIAR
@app.post("/veiculos/", response_model=schemas.VeiculoResponse)
def criar_veiculo(veiculo: schemas.VeiculoCreate, db: Session = Depends(get_db)):
    return crud.create_veiculo(db=db,veiculo=veiculo)

    # LISTAR
@app.get("/veiculos/", response_model=List[schemas.VeiculoResponse])
def listar_veiculos(skip: int=0, limit: int=100, db:Session = Depends(get_db)):
    return crud.get_veiculos(db=db,skip=skip, limit=limit)

    # LISTAR(ID)
@app.get("/veiculos/{veiculo_id}", response_model=schemas.VeiculoResponse)
def listar_veiculo_id(veiculo_id: int, db:Session = Depends(get_db)):
    db_veiculo = crud.get_veiculo_by_id(db=db, veiculo_id=veiculo_id)

    if db_veiculo is None:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")
    return db_veiculo

    # ATUALIZAR
@app.put("/veiculos/{veiculo_id}", response_model=schemas.VeiculoResponse)
def atualizar_veiculo(veiculo_id: int, updating_veiculo: schemas.VeiculoCreate, db: Session = Depends(get_db)):
    db_veiculo = crud.update_veiculo(db=db, veiculo_id=veiculo_id, updating_veiculo=updating_veiculo)

    if db_veiculo is None:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")
    return db_veiculo

    # DELETAR
@app.delete("/veiculos/{veiculo_id}", response_model=schemas.VeiculoResponse)
def deletar_veiculo(veiculo_id: int, db: Session = Depends(get_db)):
    db_veiculo = crud.delete_veiculo(db=db, veiculo_id=veiculo_id)

    if db_veiculo is None:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")
    return db_veiculo

# MÉTODOS - CICLOS

    # CRIAR
@app.post("/ciclos/", response_model=schemas.CicloResponse)
def criar_ciclo(ciclo: schemas.CicloCreate, db:Session = Depends(get_db)):
    return crud.create_ciclo(db=db,ciclo=ciclo)

    # LISTAR
@app.get("/ciclos/", response_model=List[schemas.CicloResponse])
def listar_ciclos(skip: int = 0, limit: int = 100, db:Session = Depends(get_db)):
    return crud.get_ciclos(db=db,skip=skip,limit=limit)

    # LISTAR(ID)
@app.get("/ciclos/{ciclo_id}", response_model=schemas.CicloResponse)
def listar_ciclo_id(ciclo_id: int, db:Session = Depends(get_db)):
    db_ciclo_id = crud.get_ciclo_by_id(db=db, ciclo_id=ciclo_id)

    if db_ciclo_id is None:
        raise HTTPException(status_code=404, detail="Ciclo não encontrado")
    return db_ciclo_id

    # ATUALIZAR
@app.put("/ciclos/{ciclo_id}", response_model=schemas.CicloResponse)
def atualizar_ciclo(ciclo_id: int, updating_ciclo: schemas.CicloCreate, db: Session = Depends(get_db)):
    db_ciclo = crud.update_ciclo(db=db, ciclo_id=ciclo_id, updating_ciclo=updating_ciclo)

    if db_ciclo is None:
        raise HTTPException(status_code=404, detail="Ciclo não encontrado")
    return db_ciclo

    # DELETAR
@app.delete("/ciclos/{ciclo_id}", response_model=schemas.CicloResponse)
def deletar_ciclo(ciclo_id: int, db:Session = Depends(get_db)):
    db_ciclo = crud.delete_ciclo(db=db, ciclo_id=ciclo_id)

    if db_ciclo is None:
        raise HTTPException(status_code=404, detail="Ciclo não encontrado")
    return db_ciclo

# MÉTODOS - PACOTES

    # CRIAR
@app.post("/pacotes/", response_model=schemas.PacoteResponse)
def criar_pacote(pacote: schemas.PacoteCreate, db: Session = Depends(get_db)):
    return crud.create_pacote(db=db, pacote=pacote)

    # LISTAR
@app.get("/pacotes/", response_model=List[schemas.PacoteResponse])
def listar_pacote(skip: int= 0, limit: int=100, db: Session = Depends(get_db)):
    return crud.get_pacotes(db=db,skip=skip,limit=limit)

    # LISTAR(ID)
@app.get("/pacotes/{pacote_id}", response_model=schemas.PacoteResponse)
def listar_pacote_id(pacote_id: int, db: Session =  Depends(get_db)):
    db_pacote_id = crud.get_pacote_by_id(db=db, pacote_id=pacote_id)

    if db_pacote_id is None:
        raise HTTPException(status_code=404, detail="Pacote não encontrado")
    return db_pacote_id

    # ATUALIZAR
@app.put("/pacotes/{pacote_id}", response_model=schemas.PacoteResponse)
def atualizar_pacote(pacote_id: int, updating_pacote: schemas.PacoteCreate, db: Session = Depends(get_db)):
    db_pacote = crud.update_pacote(db=db, pacote_id=pacote_id, updating_pacote=updating_pacote)

    if db_pacote is None:
        raise HTTPException(status_code=404, detail="Pacote não encontrado")
    return db_pacote

    # DELETAR
@app.delete("/pacotes/{pacote_id}", response_model=schemas.PacoteResponse)
def deletar_pacote(pacote_id: int, db:Session = Depends(get_db)):
    db_pacote = crud.delete_pacote(db=db, pacote_id=pacote_id)

    if db_pacote is None:
        raise HTTPException(status_code=404, detail="Pacote não encontrado")
    return db_pacote

# MÉTODOS - ENTREGAS

    # CRIAR
@app.post("/entregas/", response_model=schemas.EntregaResponse)
def criar_entrega(entrega: schemas.EntregaCreate, db: Session = Depends(get_db)):
    return crud.create_entrega(db=db, entrega=entrega)

    # LISTAR
@app.get("/entregas/", response_model=List[schemas.EntregaResponse])
def listar_entregas(skip: int = 0, limit: int=100, db: Session = Depends(get_db)):
    return crud.get_entregas(db=db, skip=skip, limit=limit)

    # LISTAR(ID)
@app.get("/entregas/{entrega_id}", response_model=schemas.EntregaResponse)
def listar_entrega_id(entrega_id: int, db: Session = Depends(get_db)):
    db_entrega_id = crud.get_entrega_by_id(db=db, entrega_id=entrega_id)

    if db_entrega_id is None:
        raise HTTPException(status_code=404, detail="Entrega não encontrada")
    return db_entrega_id

    # ATUALIZAR
@app.put("/entregas/{entrega_id}", response_model=schemas.EntregaResponse)
def atualizar_entrega(entrega_id: int, updating_entrega: schemas.EntregaCreate, db: Session = Depends(get_db)):
    db_entrega = crud.update_entrega(db=db, entrega_id=entrega_id, updating_entrega=updating_entrega)

    if db_entrega is None:
        raise HTTPException(status_code=404, detail="Entrega não encontrada")
    return db_entrega

    # DELETAR
@app.delete("/entregas/{entrega_id}", response_model=schemas.EntregaResponse)
def deletar_entregas(entrega_id: int, db: Session = Depends(get_db)):
    db_entrega = crud.delete_entrega(db=db, entrega_id=entrega_id)

    if db_entrega is None:
        raise HTTPException(status_code=404, detail="Entrega não encontrada")
    return db_entrega