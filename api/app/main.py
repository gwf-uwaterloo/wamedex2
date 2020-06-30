import io

import pkg_resources
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles

from app.routers import search
from app.services.searcher import Searcher
from app.settings import settings

app = FastAPI()

# Set global state for reusable services
if not settings.testing:
    app.state.searcher = Searcher()

# Disable CORS in development mode
if settings.development:
    app.add_middleware(CORSMiddleware,
                       allow_origins=["http://localhost:3000", "http://23.251.153.91:8000/"],
                       allow_credentials=True,
                       allow_headers=['*'],allow_methods=["*"])

# API endpoints
app.include_router(search.router, tags=['search'], prefix="/api")


@app.get("/api/status", status_code=200)
def status():
    return


@app.get("/api/.*", status_code=404, include_in_schema=False)
def invalid_api():
    return None


# Serve static files and client build if not running in development mode
if not settings.development:
    app.mount("/static",
              StaticFiles(directory=pkg_resources.resource_filename(
                  __name__, 'static')),
              name="static")

    @app.get("/manifest.json", include_in_schema=False)
    def manifest():
        return FileResponse(pkg_resources.resource_filename(__name__, 'static/manifest.json'))

    @app.get("/favicon.ico", include_in_schema=False)
    def favicon():
        return FileResponse(pkg_resources.resource_filename(__name__, 'static/favicon.ico'))

    @app.get("/logo192.png", include_in_schema=False)
    def favicon():
        return FileResponse(pkg_resources.resource_filename(__name__, 'static/logo192.png'))

    @app.get("/logo512.png", include_in_schema=False)
    def favicon():
        return FileResponse(pkg_resources.resource_filename(__name__, 'static/logo512.png'))

    @app.get("/.*", include_in_schema=False)
    def root():
        return HTMLResponse(pkg_resources.resource_string(__name__, 'static/index.html'))
