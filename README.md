# Insurance Project

Monorepo with a FastAPI backend and an Angular frontend (with Tailwind CSS).

## Structure

- **`api-server/`** – FastAPI backend (MVP: api, presenters, models, schemas, services)
- **`client/`** – Angular 19 frontend with Tailwind CSS

## Run the API

```bash
cd api-server
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
# Run from inside api-server (use main:app, not app.main:app):
uvicorn main:app --reload
```

- API: http://127.0.0.1:8000  
- Docs: http://127.0.0.1:8000/docs  

## Run the Client

```bash
cd client
npm install
npm start
```

- App: http://localhost:4200  

## Prerequisites

- Python 3.9+
- Node.js 18+
- npm
