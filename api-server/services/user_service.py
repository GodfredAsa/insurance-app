# Business logic — SQLite (db/data.db)

from datetime import datetime

import bcrypt
from sqlalchemy import func
from sqlalchemy.orm import Session

from database import SessionLocal
from models.db_models import UserTable
from models.user_model import Role, User
from schemas.user_schema import UserCreate

DEFAULT_ADMIN_EMAIL = "admin@admin.com"
DEFAULT_ADMIN_PASSWORD = "1234"


def _hash_password(password: str) -> str:
    secret = password.encode("utf-8")[:72]
    return bcrypt.hashpw(secret, bcrypt.gensalt()).decode("utf-8")


def _row_to_user(row: UserTable) -> User:
    return User(
        id=row.id,
        email=row.email,
        name=row.name,
        password_hash=row.password_hash,
        role=Role(row.role) if row.role else Role.USER,
        created_at=row.created_at,
    )


class UserService:
    """User business logic. Data stored in SQLite db/data.db."""

    def _session(self) -> Session:
        return SessionLocal()

    def ensure_default_admin(self) -> None:
        """Create default admin (admin@admin.com / 1234) if not present. Call on app startup."""
        db = self._session()
        try:
            exists = (
                db.query(UserTable)
                .filter(UserTable.email == DEFAULT_ADMIN_EMAIL)
                .first()
            )
            if exists:
                return
            admin = UserTable(
                email=DEFAULT_ADMIN_EMAIL.strip().lower(),
                name="Default Admin",
                password_hash=_hash_password(DEFAULT_ADMIN_PASSWORD),
                role=Role.ADMIN.value,
            )
            db.add(admin)
            db.commit()
        finally:
            db.close()

    def list_all(self) -> list[User]:
        db = self._session()
        try:
            rows = db.query(UserTable).order_by(UserTable.id).all()
            return [_row_to_user(r) for r in rows]
        finally:
            db.close()

    def get_by_id(self, user_id: int) -> User | None:
        db = self._session()
        try:
            row = db.query(UserTable).filter(UserTable.id == user_id).first()
            return _row_to_user(row) if row else None
        finally:
            db.close()

    def get_by_email(self, email: str) -> User | None:
        if not email:
            return None
        norm = email.strip().lower()
        db = self._session()
        try:
            row = (
                db.query(UserTable)
                .filter(func.lower(UserTable.email) == norm)
                .first()
            )
            return _row_to_user(row) if row else None
        finally:
            db.close()

    def authenticate(self, email: str, password: str) -> User | None:
        user = self.get_by_email(email)
        if not user or not user.password_hash:
            return None
        secret = password.encode("utf-8")[:72]
        stored = user.password_hash.strip().encode("utf-8")
        try:
            if not bcrypt.checkpw(secret, stored):
                return None
        except (ValueError, TypeError):
            return None
        return user

    def create(self, data: UserCreate) -> User:
        db = self._session()
        try:
            # Store email in lowercase for case-insensitive lookup
            email_norm = data.email.strip().lower()
            row = UserTable(
                email=email_norm,
                name=data.name.strip(),
                password_hash=_hash_password(data.password),
                role=Role.USER.value,
            )
            db.add(row)
            db.commit()
            db.refresh(row)
            return _row_to_user(row)
        finally:
            db.close()


user_service = UserService()
