import subprocess

# ✅ SAFE COMMAND LIST
ALLOWED_COMMANDS = [
    "ls",
    "pwd",
    "whoami",
    "df -h",
    "uptime",
    "date"
]

def execute_command(user_input: str):

    user_input = user_input.strip()

    # 🚫 BLOCK dangerous patterns
    dangerous_keywords = ["rm", "shutdown", "reboot", "mkfs", ":", ">", "|"]

    for keyword in dangerous_keywords:
        if keyword in user_input:
            return "⚠️ Command blocked for safety."

    # ✅ ALLOW only safe commands
    if user_input not in ALLOWED_COMMANDS:
        return "⚠️ Command not allowed."

    try:
        result = subprocess.check_output(
            user_input,
            shell=True,
            stderr=subprocess.STDOUT,
            text=True
        )
        return result.strip()

    except subprocess.CalledProcessError as e:
        return f"Command failed:\n{e.output}"