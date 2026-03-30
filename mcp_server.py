import asyncio
import httpx
from mcp.server.fastmcp import FastMCP

# Initialize FastMCP server
mcp = FastMCP("Employee Management System")

API_BASE_URL = "http://localhost:8000"

@mcp.tool()
async def list_employees():
    """List all employees in the system."""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{API_BASE_URL}/employees/")
        response.raise_for_status()
        return response.json()

@mcp.tool()
async def get_employee(employee_id: int):
    """Get detailed information about a specific employee by their ID."""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{API_BASE_URL}/employees/{employee_id}")
        if response.status_code == 404:
            return f"Employee with ID {employee_id} not found."
        response.raise_for_status()
        return response.json()

@mcp.tool()
async def list_departments():
    """List all departments in the organization."""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{API_BASE_URL}/departments/")
        response.raise_for_status()
        return response.json()

@mcp.tool()
async def add_employee(first_name: str, last_name: str, email: str, role: str, department_id: int):
    """Add a new employee to the system."""
    payload = {
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "role": role,
        "department_id": department_id
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{API_BASE_URL}/employees/", json=payload)
        response.raise_for_status()
        return response.json()

@mcp.tool()
async def update_employee(employee_id: int, first_name: str = None, last_name: str = None, email: str = None, role: str = None, department_id: int = None):
    """Update an existing employee's information. Only provide fields that need to be changed."""
    payload = {k: v for k, v in {
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "role": role,
        "department_id": department_id
    }.items() if v is not None}
    async with httpx.AsyncClient() as client:
        response = await client.put(f"{API_BASE_URL}/employees/{employee_id}", json=payload)
        response.raise_for_status()
        return response.json()

@mcp.tool()
async def delete_employee(employee_id: int):
    """Delete an employee from the system."""
    async with httpx.AsyncClient() as client:
        response = await client.delete(f"{API_BASE_URL}/employees/{employee_id}")
        response.raise_for_status()
        return response.json()

@mcp.tool()
async def search_employees(query: str):
    """Search for employees by name, email, or role."""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{API_BASE_URL}/employees/")
        response.raise_for_status()
        employees = response.json()
        query = query.lower()
        results = [
            e for e in employees 
            if query in (e.get('first_name') or '').lower() or 
               query in (e.get('last_name') or '').lower() or 
               query in (e.get('email') or '').lower() or 
               query in (e.get('role') or '').lower()
        ]
        return results

@mcp.tool()
async def add_department(name: str):
    """Add a new department to the organization."""
    payload = {"name": name}
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{API_BASE_URL}/departments/", json=payload)
        response.raise_for_status()
        return response.json()

@mcp.tool()
async def update_department(department_id: int, name: str):
    """Update a department's name."""
    payload = {"name": name}
    async with httpx.AsyncClient() as client:
        response = await client.put(f"{API_BASE_URL}/departments/{department_id}", json=payload)
        response.raise_for_status()
        return response.json()

@mcp.tool()
async def delete_department(department_id: int):
    """Delete a department. Employees in this department will be unassigned."""
    async with httpx.AsyncClient() as client:
        response = await client.delete(f"{API_BASE_URL}/departments/{department_id}")
        response.raise_for_status()
        return response.json()

@mcp.tool()
async def search_handbook(query: str):
    """Search the employee handbook for information on company policies, culture, and procedures."""
    payload = {"message": query}
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{API_BASE_URL}/chat/", json=payload)
        response.raise_for_status()
        data = response.json()
        return data.get("reply", "No information found.")

@mcp.resource("employees://list")
async def employee_resource() -> str:
    """Read-only resource for the employee list."""
    employees = await list_employees()
    return str(employees)

@mcp.resource("departments://list")
async def department_resource() -> str:
    """Read-only resource for the department list."""
    departments = await list_departments()
    return str(departments)

if __name__ == "__main__":
    mcp.run()
