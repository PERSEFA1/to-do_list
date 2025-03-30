from pydantic import BaseModel
from datetime import datetime


class TaskSchema(BaseModel):
    name: str
    discr: str
    done: bool = False
    date: datetime = datetime.now
