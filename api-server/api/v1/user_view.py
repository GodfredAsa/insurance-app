# VIEW Layer — routes (API). All require valid JWT.

from fastapi import APIRouter, Depends, HTTPException

from auth.dependencies import get_current_admin_user_id, get_current_user_id
from presenters.user_presenter import UserPresenter
from schemas.user_schema import UserCreate, UserResponse

router = APIRouter()
presenter = UserPresenter()


@router.get("", response_model=list[UserResponse])
@router.get("/", response_model=list[UserResponse])
def list_users(current_user_id: int = Depends(get_current_admin_user_id)):
    return presenter.list_users()


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, current_user_id: int = Depends(get_current_user_id)):
    user = presenter.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/", response_model=UserResponse, status_code=201)
def create_user(data: UserCreate, _: int = Depends(get_current_user_id)):
    return presenter.create_user(data)
