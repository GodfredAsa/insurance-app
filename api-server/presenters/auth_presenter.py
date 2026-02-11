# PRESENTER Layer — auth (register, login)

from schemas.user_schema import LoginRequest, TokenResponse, UserCreate, UserResponse
from services.user_service import user_service

from auth.jwt import create_access_token


class AuthPresenter:
    """Coordinates auth view with user service and JWT."""

    @staticmethod
    def register(data: UserCreate) -> UserResponse:
        user = user_service.create(data)
        return UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            role=user.role.value,
            created_at=user.created_at.isoformat() if user.created_at else None,
        )

    @staticmethod
    def login(data: LoginRequest) -> TokenResponse | None:
        user = user_service.authenticate(data.email, data.password)
        if not user:
            return None
        token = create_access_token(sub=user.id)
        return TokenResponse(access_token=token, token_type="bearer")
