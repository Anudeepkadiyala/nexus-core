DANGEROUS_KEYWORDS = [
    "rm -rf",
    "shutdown",
    "reboot",
    "mkfs",
    "dd ",
    "kill ",
    "poweroff"
]

SAFE_COMMANDS = [
    "ls",
    "pwd",
    "whoami",
    "date",
    "echo"
]


def is_dangerous(command: str):
    command = command.lower()
    return any(keyword in command for keyword in DANGEROUS_KEYWORDS)


def is_safe(command: str):
    command = command.lower()
    return any(command.startswith(cmd) for cmd in SAFE_COMMANDS)