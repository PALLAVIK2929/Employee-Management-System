from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import employees, departments, chat, onboarding, auth
from mcp_handler import mcp
import asyncio

app = FastAPI(title="Employee Management System")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
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

# Mount MCP management API
from mcp_handler import router as mcp_api_router
app.include_router(mcp_api_router)

# Mount MCP server via SSE
# Case 1: Try as a property (if previous failed with 4 args, maybe it's a bound method?)
# Actually, if sse_app is a property that returns an app, then app.mount("/mcp", mcp.sse_app) is correct.
# If it's a method that returns an app, then mcp.sse_app() is correct.
# The error was "TypeError: FastMCP.sse_app() takes from 1 to 2 positional arguments but 4 were given"
# This confirms Starlette is calling it as an app: sse_app(scope, receive, send).
# And since it's a bound method, it gets 'self' as 4th. 
# So it IS a method, but FastMCP.sse_app is likely NOT the app itself, but a way to get it or handle it.
# Let's try calling it.
app.mount("/mcp", mcp.sse_app())

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
