current_mode = "oracle"

def set_mode(mode: str):
    global current_mode
    current_mode = mode.lower()
    return f"Mode switched to {current_mode}"

def get_mode():
    return current_mode