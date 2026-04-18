from app.brain.memory import save_memory
from app.brain.ai import get_ai_response
from app.brain.executor import execute_command

def route_request(user_input: str, mode: str):
    user_input = user_input.lower()
    save_memory(user_input)

    # 🧠 COMMAND MODE
    if mode == "command":
        result = execute_command(user_input)
        if result:
            return result
        return "Command not recognized."

    # 🧠 ORACLE MODE
    elif mode == "oracle":
        return get_ai_response(user_input)

    # ⚡ SYNTHESIS MODE
    elif mode == "synthesis":
        result = execute_command(user_input)

        if result:
            explanation = get_ai_response(
                f"Explain this output clearly:\n{result}"
            )
            return f"{result}\n\nExplanation:\n{explanation}"

        return get_ai_response(user_input)

    return "Invalid mode"