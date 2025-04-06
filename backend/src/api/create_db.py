from fastapi import APIRouter, HTTPException

from src.database import engine, Base

db_router = APIRouter(tags=["Создание базы данных"])


@db_router.post('/setup_db')
async def setup_db():
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
            await conn.run_sync(Base.metadata.create_all)
        return {'success': True}
    except Exception as e:
        raise HTTPException(status_code=500)
