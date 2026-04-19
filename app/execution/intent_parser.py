def parse_intent(user_input: str):
    text = user_input.lower()

    # =========================
    # FILE / SYSTEM INTENTS
    # =========================
    if "files" in text or "list files" in text:
        return "run ls"

    if "current directory" in text:
        return "run pwd"

    if "who am i" in text:
        return "run whoami"

    # =========================
    # APP INTENTS
    # =========================
    if "calculator" in text:
        return "open gnome-calculator"

    if "text editor" in text or "editor" in text:
        return "open gedit"

    # =========================
    # WEB INTENTS (FIXED)
    # =========================
    if "open" in text and "search" in text:
        return user_input  # let router handle both

    if "search" in text:
        return user_input

    if "youtube" in text:
        return "open youtube.com"

    if "google" in text:
        return "open google.com"

    # =========================
    # DEFAULT
    # =========================
    return user_input