import os
from datetime import datetime, timedelta, timezone

import jwt

# Use env in production; default for dev only
SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))


def create_access_token(sub: str | int) -> str:
    """Create a JWT access token. `sub` is typically the user id or email."""
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(sub), "exp": expire}
    raw = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return raw if isinstance(raw, str) else raw.decode("utf-8")


def verify_token(token: str | bytes) -> dict:
    """Decode and verify JWT; return payload. Raises jwt.InvalidTokenError if invalid."""
    if isinstance(token, bytes):
        token = token.decode("utf-8")
    token = token.strip()
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
