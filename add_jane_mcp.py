import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def add_jane():
    server_params = StdioServerParameters(
        command="python3",
        args=["mcp_server.py"],
    )
    
    print("Connecting to MCP server...")
    try:
        async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()
                
                print("Calling add_employee tool...")
                result = await session.call_tool("add_employee", {
                    "first_name": "Jane",
                    "last_name": "Doe",
                    "email": "jane.doe@example.com",
                    "role": "Lead Engineer",
                    "department_id": 2  # Engineering
                })
                
                print("\nTool Call Result:")
                for content in result.content:
                    print(content.text)
                    
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(add_jane())
