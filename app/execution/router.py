from app.execution.system_control import run_command, open_application
from app.execution.security import is_dangerous, is_safe
from app.execution.state import PENDING_ACTION
from app.execution.browser_control import open_website, search_web


def route_action(user_input: str):
    user_input = user_input.lower().strip()

    # =========================
    # HANDLE CONFIRMATION
    # =========================
    if user_input in ["yes", "confirm"]:
        if PENDING_ACTION["command"]:
            command = PENDING_ACTION["command"]
            PENDING_ACTION["command"] = None
            return run_command(command)

        return {"status": "no_action", "message": "Nothing to confirm"}

    if user_input in ["no", "cancel"]:
        PENDING_ACTION["command"] = None
        return {"status": "cancelled", "message": "Action cancelled"}

    # =========================
    # 🌐 BROWSER CONTROL (FIXED POSITION)
    # =========================
    if "open" in user_input:

    # 🔥 HANDLE SEARCH
    if "search" in user_input:
        parts = user_input.split("search")
        query = parts[1].strip()

        search_url = f"https://www.google.com/search?q={query.replace(' ', '+')}"

        return {
            "status": "success",
            "message": f"Searching for {query}",
            "url": search_url
        }

    # 🔥 NORMAL OPEN
    site = user_input.replace("open", "").strip()

    if "." not in site:
        site = site + ".com"

    url = "https://" + site

    return {
        "status": "success",
        "message": f"Opening {url}",
        "url": url
    }
    if "search" in user_input:
    query = user_input.replace("search", "").strip()

    url = f"https://www.google.com/search?q={query.replace(' ', '+')}"

    return {
        "status": "success",
        "message": f"Searching for {query}",
        "url": url
    }

    # =========================
    # OPEN APPLICATION
    # =========================
    if "open" in user_input:
        app_name = user_input.replace("open", "").strip()
        return open_application(app_name)

    # =========================
    # RUN COMMAND
    # =========================
    elif "run" in user_input:
        command = user_input.replace("run", "").strip()

        if is_dangerous(command):
            return {"status": "blocked", "message": "Command blocked for safety"}

        if not is_safe(command):
            PENDING_ACTION["command"] = command
            return {
                "status": "pending",
                "message": f"Permission required to run: {command}. Confirm?"
            }

        return run_command(command)

    return {"status": "no_action", "message": "No executable action detected"}