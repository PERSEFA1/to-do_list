from sqlalchemy.orm import mapped_column, Mapped
from sqlalchemy import DateTime, func
from datetime import datetime

from src.database import Base


class TaskModel(Base):
    __tablename__ = 'tasks'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    discr: Mapped[str]
    done: Mapped[bool]
    created_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
