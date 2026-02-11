# App entry point

from fastapi import Depends, FastAPI

from api.v1 import auth_view, user_view
from auth.dependencies import get_current_user_id

app = FastAPI(
    title="Insurance API",
    description="Backend API for the insurance project (MVC)",
    version="0.1.0",
    redirect_slashes=False,
)

app.include_router(user_view.router, prefix="/api/v1/users", tags=["users"])
app.include_router(auth_view.router, prefix="/api/v1", tags=["auth"])
# Also mount at /api/v1 so /api/v1/register and /api/v1/login work
app.include_router(auth_view.router, prefix="/api/v1", tags=["auth"])


@app.on_event("startup")
def on_startup():
    from database import init_db
    from services.user_service import user_service
    init_db()
    user_service.ensure_default_admin()


@app.get("/")
def root(_: int = Depends(get_current_user_id)):
    return {"message": "Insurance API", "status": "ok"}


@app.get("/health")
def health(_: int = Depends(get_current_user_id)):
    return {"status": "healthy"}
