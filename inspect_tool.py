from mcp.server.fastmcp import FastMCP
mcp = FastMCP("test")

@mcp.tool()
def sample(x: int):
    return x

tool = mcp._tool_manager.list_tools()[0]
print(f"Attributes: {dir(tool)}")
try:
    print(f"Schema: {tool.parameters}")
except:
    pass
try:
    print(f"Schema: {tool.input_schema}")
except:
    pass
