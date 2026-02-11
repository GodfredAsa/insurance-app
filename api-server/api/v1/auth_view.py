# VIEW Layer — auth routes (register, login)

from fastapi import APIRouter, HTTPException

from presenters.auth_presenter import AuthPresenter
from schemas.user_schema import LoginRequest, TokenResponse, UserCreate, UserResponse
from services.user_service import user_service

router = APIRouter()
presenter = AuthPresenter()


@router.post("/register", response_model=UserResponse, status_code=201)
def register(data: UserCreate):
    if user_service.get_by_email(data.email):
        raise HTTPException(status_code=409, detail="Email already registered")
    return presenter.register(data)


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest):
    result = presenter.login(data)
    if not result:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return result
