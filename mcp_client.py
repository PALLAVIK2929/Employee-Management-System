import asyncio
import sys
import json
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def run_repl():
    # Define server parameters - point to the mcp_server.py
    server_params = StdioServerParameters(
        command="python3",
        args=["mcp_server.py"],
    )

    print("\n🚀 --- Interactive Employee Management MCP Client ---")
    print("Type 'help' for available commands, or 'exit' to quit.\n")

    try:
        async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                # Initialize the session
                await session.initialize()

                # Get initial tool list
                tools_result = await session.list_tools()
                tools = {tool.name: tool for tool in tools_result.tools}

                while True:
                    try:
                        cmd_input = input("mcp> ").strip()
                        if not cmd_input:
                            continue
                        
                        if cmd_input.lower() in ['exit', 'quit', 'q']:
                            print("Goodbye!")
                            break
                        
                        if cmd_input.lower() == 'help':
                            print("\nCommands:")
                            print("  list              - List all available tools")
                            print("  tools             - Same as list")
                            print("  resources         - List available resources")
                            print("  call <name> <json>- Call a tool with JSON arguments")
                            print("                      Example: call search_employees {\"query\": \"Pallavi\"}")
                            print("  exit/quit         - Exit the client\n")
                            continue

                        if cmd_input.lower() in ['list', 'tools']:
                            tools_result = await session.list_tools()
                            print("\nAvailable Tools:")
                            for tool in tools_result.tools:
                                print(f"  - {tool.name}: {tool.description}")
                            print()
                            continue

                        if cmd_input.lower() == 'resources':
                            res_result = await session.list_resources()
                            print("\nAvailable Resources:")
                            for res in res_result.resources:
                                print(f"  - {res.uri}: {res.name}")
                            print()
                            continue

                        if cmd_input.startswith("call "):
                            parts = cmd_input.split(" ", 2)
                            if len(parts) < 2:
                                print("Error: Specify tool name. Use 'call <tool_name> [json_args]'")
                                continue
                            
                            tool_name = parts[1]
                            args_str = parts[2] if len(parts) > 2 else "{}"
                            
                            try:
                                arguments = json.loads(args_str)
                            except json.JSONDecodeError:
                                print(f"Error: Invalid JSON arguments: {args_str}")
                                continue

                            print(f"Calling {tool_name}...")
                            try:
                                result = await session.call_tool(tool_name, arguments)
                                print("\nResult:")
                                for content in result.content:
                                    if hasattr(content, 'text'):
                                        # Attempt to pretty print JSON if the response is JSON-like
                                        try:
                                            parsed = json.loads(content.text)
                                            print(json.dumps(parsed, indent=2))
                                        except:
                                            print(content.text)
                                    else:
                                        print(content)
                                print()
                            except Exception as e:
                                print(f"Error calling tool: {e}")
                            continue

                        print(f"Unknown command: {cmd_input}. Type 'help' for assistance.")

                    except EOFError:
                        break
                    except Exception as e:
                        print(f"An error occurred: {e}")

    except Exception as e:
        print(f"Failed to connect to MCP server: {e}")

if __name__ == "__main__":
    try:
        asyncio.run(run_repl())
    except KeyboardInterrupt:
        print("\nClient terminated.")
