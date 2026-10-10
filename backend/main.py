from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from fastapi.staticfiles import StaticFiles

import os
import crud
import schemas
import models
from database import SessionLocal,engine

# CRIA O DB CASO NÃO HOUVER
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ramosDATA", description="Sistema de Gestão Logística - Ramos Transportes")

# CRIAR PASTA DE UPLOADS CASO NÃO EXISTA
os.makedirs("uploads", exist_ok=True)

# SERVIR FICHEIROS ESTÁTICOS (Permite abrir os PDFs/fotos no navegador)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

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

# MÉTODOS - FUNCIONÁRIOS

    # CRIAR
@app.post("/funcionarios/", response_model=schemas.FuncionarioResponse)
def criar_funcionario(funcionario: schemas.FuncionarioCreate, db: Session = Depends (get_db)):
    return crud.create_funcionario(db=db, funcionario=funcionario)

    # LISTAR
@app.get("/funcionarios/", response_model=List[schemas.FuncionarioResponse])
def listar_funcionarios(skip: int=0, limit: int=100, db: Session = Depends (get_db)):
    return crud.get_funcionarios(db=db, skip=skip,limit=limit)

    # LISTAR(ID)
@app.get("/funcionarios/{funcionario_id}", response_model=schemas.FuncionarioResponse)
def listar_funcionario_id(funcionario_id: int, db: Session = Depends (get_db)):
    db_funcionario = crud.get_funcionario_by_id(db=db, funcionario_id=funcionario_id)

    if db_funcionario is None:
        raise HTTPException(status_code=404, detail="Funcionario não encontrado")
    return db_funcionario

    # ATUALIZAR
@app.put("/funcionarios/{funcionario_id}", response_model=schemas.FuncionarioResponse)
def atualizar_funcionario(funcionario_id: int, updating_funcionario: schemas.FuncionarioCreate, db: Session = Depends(get_db)):

    db_funcionario = crud.update_funcionario(db=db,funcionario_id=funcionario_id,updating_funcionario=updating_funcionario)

    if db_funcionario is None:
        raise HTTPException(status_code=404, detail="Funcionario não encontrado")
    return db_funcionario

    # DELETAR
@app.delete("/funcionarios/{funcionario_id}", response_model=schemas.FuncionarioResponse)
def deletar_funcionario(funcionario_id: int, db:Session = Depends(get_db)):
    db_funcionario = crud.delete_funcionario(db=db, funcionario_id=funcionario_id)

    if db_funcionario is None:
        raise HTTPException(status_code=404, detail="Funcionario não encontrado")
    return db_funcionario

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

# MÉTODOS - ABASTECIMENTOS

    # CRIAR
@app.post("/abastecimentos/", response_model=schemas.AbastecimentoResponse)
def criar_abastecimento(abastecimento: schemas.AbastecimentoCreate, db: Session = Depends(get_db)):
    return crud.create_abastecimento(db=db, abastecimento=abastecimento)

    # LISTAR
@app.get("/abastecimentos/", response_model=List[schemas.AbastecimentoResponse])
def listar_abastecimentos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_abastecimentos(db=db, skip=skip, limit=limit)

    # ATUALIZAR
@app.put("/abastecimentos/{abastecimento_id}", response_model=schemas.AbastecimentoResponse)
def atualizar_abastecimento(abastecimento_id: int, updating_abastecimento: schemas.AbastecimentoCreate, db: Session = Depends(get_db)):
    db_abastecimento = crud.update_abastecimento(db=db, abastecimento_id=abastecimento_id, updating_abastecimento=updating_abastecimento)

    if db_abastecimento is None:
        raise HTTPException(status_code=404, detail="Abastecimento não encontrado")
    return db_abastecimento

    # DELETAR
@app.delete("/abastecimentos/{abastecimento_id}")
def deletar_abastecimento(abastecimento_id: int, db: Session = Depends(get_db)):
    sucesso = crud.delete_abastecimento(db=db, abastecimento_id=abastecimento_id)

    if not sucesso:
        raise HTTPException(status_code=404, detail="Abastecimento não encontrado")
    return {"message": "Abastecimento deletado com sucesso"}

# MÉTODOS - MANUTENÇÕES

    # CRIAR
@app.post("/manutencoes/", response_model=schemas.ManutencaoResponse)
def criar_manutencao(manutencao: schemas.ManutencaoCreate, db: Session = Depends(get_db)):
    return crud.create_manutencao(db=db, manutencao=manutencao)
    # LISTAR
@app.get("/manutencoes/", response_model=List[schemas.ManutencaoResponse])
def listar_manutencao(skip: int = 0, limit: int = 100, db:Session = Depends(get_db)):
    return crud.get_manutencoes(db=db, skip=skip, limit=limit)

    # ATUALIZAR
@app.put("/manutencoes/{manutencao_id}", response_model=schemas.ManutencaoResponse)
def atualizar_manutencao(manutencao_id: int, updating_manutencao: schemas.ManutencaoCreate, db:Session = Depends(get_db)):
    db_manutencao = crud.update_manutencao(db=db, manutencao_id = manutencao_id, updating_manutencao= updating_manutencao)

    if db_manutencao is None:
        raise HTTPException(status_code=404, detail="Manutenção não encontrada")
    return db_manutencao

    # DELETAR
@app.delete("/manutencoes/{manutencao_id}")
def deletar_manutencao(manutencao_id: int, db:Session=Depends(get_db)):
    db_manutencao = crud.delete_manutencao(db=db, manutencao_id=manutencao_id)

    if not db_manutencao:
        raise HTTPException(status_code=404, detail="Manutenção não encontrada")
    return db_manutencao

    # UPLOAD
@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    # Caminho onde o arquivo será salvo
    file_path = os.path.join("uploads", file.filename)
    
    # Salva o arquivo no disco
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
        
    return {"url": f"uploads/{file.filename}"}