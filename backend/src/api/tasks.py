from fastapi import APIRouter, HTTPException
from sqlalchemy import select

from src.api.dependencies import SessionDep
from src.models.tasks import TaskModel
from src.schemas.tasks import TaskSchema

tasks_router = APIRouter(tags=["Задачи"])


@tasks_router.get('/tasks')
async def get_all_tasks(session: SessionDep):
    query = select(TaskModel)
    result = await session.execute(query)
    return result.scalars().all()


@tasks_router.post('/tasks')
async def post_tasks(data: TaskSchema, session: SessionDep):
    new_task = TaskModel(
        name=data.name,
        discr=data.discr,
        done=data.done
    )
    session.add(new_task)
    await session.commit()
    return {'success': True}


@tasks_router.put('/tasks/{id}')
async def put_task(data: TaskSchema, session: SessionDep, id: int):
    update_task = await session.get(TaskModel, id)
    if update_task != None:
        update_task.name = data.name
        update_task.discr = data.discr
        update_task.done = data.done
        session.add(update_task)
        await session.commit()
        return {'success': True}
    else:
        raise HTTPException(status_code=404)


@tasks_router.delete('/tasks/{id}')
async def delete_task(id: int, session: SessionDep):
    deleted_task = await session.get(TaskModel, id)
    if deleted_task != None:
        try:
            await session.delete(deleted_task)
            await session.commit()
            return {'success': True}
        except Exception as e:
            raise HTTPException(status_code=500, detail=e)
    else:
        raise HTTPException(status_code=404)
