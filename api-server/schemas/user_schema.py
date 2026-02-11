# Data validation (Pydantic)

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    """Payload for creating a user. Role is always USER when created via API."""

    email: EmailStr
    name: str
    password: str


class UserResponse(BaseModel):
    """Response schema for a user."""

    id: int | None
    email: str
    name: str
    role: str
    created_at: str | None = None

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    """Payload for login (authentication)."""

    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """JWT token response."""

    access_token: str
    token_type: str = "bearer"
