from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import employees, departments, chat, onboarding, auth
import asyncio
import os

app = FastAPI(title="Employee Management System")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://employee-management-system-beta-ruddy.vercel.app",
        "http://localhost:5173",
        "http://localhost:4173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(auth.router)
app.include_router(employees.router)
app.include_router(departments.router)
app.include_router(chat.router)
app.include_router(onboarding.router)

# Mount MCP management API (optional, only if MCP is available)
try:
    from mcp_handler import router as mcp_api_router, mcp
    app.include_router(mcp_api_router)
    # Try to mount MCP SSE server
    try:
        app.mount("/mcp", mcp.sse_app())
    except Exception as e:
        print(f"Warning: Could not mount MCP SSE server: {e}")
except ImportError as e:
    print(f"Warning: MCP handler not available: {e}")

@app.on_event("startup")
async def startup():
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
async def root():
    return {"message": "Welcome to the Employee Management System API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
