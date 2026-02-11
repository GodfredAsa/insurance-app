# PRESENTER Layer — coordination between view and service

from schemas.user_schema import UserCreate, UserResponse
from services.user_service import user_service


class UserPresenter:
    """Coordinates user view (API) with user service and shapes responses."""

    @staticmethod
    def create_user(data: UserCreate) -> UserResponse:
        user = user_service.create(data)
        return UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            role=user.role.value,
            created_at=user.created_at.isoformat() if user.created_at else None,
        )

    @staticmethod
    def get_user(user_id: int) -> UserResponse | None:
        user = user_service.get_by_id(user_id)
        if not user:
            return None
        return UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            role=user.role.value,
            created_at=user.created_at.isoformat() if user.created_at else None,
        )

    @staticmethod
    def list_users() -> list[UserResponse]:
        users = user_service.list_all()
        return [
            UserResponse(
                id=u.id,
                email=u.email,
                name=u.name,
                role=u.role.value,
                created_at=u.created_at.isoformat() if u.created_at else None,
            )
            for u in users
        ]
