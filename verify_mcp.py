import asyncio
import httpx
from mcp import ClientSession
from mcp.client.sse import sse_client

async def verify():
    url = "http://localhost:8000/mcp/sse"
    print(f"Connecting to MCP SSE server at {url}...")
    
    try:
        async with sse_client(url) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()
                print("✅ Session initialized successfully!")
                
                # List tools
                tools_result = await session.list_tools()
                print(f"✅ Found {len(tools_result.tools)} tools:")
                for tool in tools_result.tools:
                    print(f"  - {tool.name}")
                
                # Try calling a simple tool
                print("\nTesting 'list_departments' tool...")
                result = await session.call_tool("list_departments", {})
                print(f"✅ Tool call successful! Result count: {len(result.content)}")
                
    except Exception as e:
        print(f"❌ Verification failed: {e}")

if __name__ == "__main__":
    asyncio.run(verify())
