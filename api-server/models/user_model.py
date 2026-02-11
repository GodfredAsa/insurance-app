# MODEL Layer — database / domain entities

from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Optional


class Role(str, Enum):
    ADMIN = "ADMIN"
    USER = "USER"


@dataclass
class User:
    """User domain model."""

    id: Optional[int]
    email: str
    name: str
    password_hash: str
    role: Role = Role.USER
    created_at: Optional[datetime] = None

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "role": self.role.value,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
