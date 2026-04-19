from app.execution.system_control import run_command, open_application
from app.execution.security import is_dangerous, is_safe
from app.execution.state import PENDING_ACTION

# 🧠 CONTEXT MEMORY
CONTEXT = {
    "last_app": None
}

def split_multi_step_command(user_input: str):
    text = user_input.strip().lower()

    separators = [" then ", " and "]
    steps = [text]

    for sep in separators:
        new_steps = []
        for step in steps:
            parts = [p.strip() for p in step.split(sep) if p.strip()]
            new_steps.extend(parts)
        steps = new_steps

    return steps

def plan_task(user_input: str):
    text = user_input.lower().strip()

    # 🔥 SEARCH INTENTS
    if "find" in text or "search" in text:
        query = text.replace("find", "").replace("search", "").strip()
        return [
            "open google",
            f"search {query}"
        ]

    # 🔥 WEATHER
    if "weather" in text:
        return [
            "open google",
            f"search {text}"
        ]

    # 🔥 NEWS
    if "news" in text:
        return [
            "open google",
            f"search {text}"
        ]

    # 🔥 WATCH / VIDEO
    if "watch" in text:
        query = text.replace("watch", "").strip()
        return [
            "open youtube",
            f"search {query}"
        ]

    # 🔥 CHECK / LOOKUP (generic)
    if "check" in text or "lookup" in text:
        return [
            "open google",
            f"search {text}"
        ]

    # fallback
    return [text]

def route_action(user_input: str, is_substep=False):
    user_input = user_input.lower().strip()

    # =========================
    # INTELLIGENT TASK PLANNING
    # =========================
    planned_steps = plan_task(user_input)

    if not is_substep:
    planned_steps = plan_task(user_input)

    if len(planned_steps) > 1:
        results = []

        for step in planned_steps:
            result = route_action(step, is_substep=True)

            if result.get("status") != "no_action":
                results.append({
                    "step": step,
                    "result": result
                })

        return {
            "status": "multi_action",
            "message": f"Executed {len(results)} steps",
            "steps": results
        }

    # =========================
    # MULTI-STEP EXECUTION
    # =========================
    steps = split_multi_step_command(user_input)

    if len(steps) > 1:
        results = []

        for step in steps:
            result = route_action(step)

            if result.get("status") != "no_action":
                results.append({
                    "step": step,
                    "result": result
                })

        return {
            "status": "multi_action",
            "message": f"Executed {len(results)} steps",
            "steps": results
        }

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
    # 🌐 OPEN + SEARCH (TOP PRIORITY)
    # =========================
    if "open" in user_input and "search" in user_input:
        parts = user_input.split("search")
        site = parts[0].replace("open", "").strip()
        query = parts[1].strip()

        if "." not in site:
            site = site + ".com"

        if "youtube" in site:
            url = f"https://www.youtube.com/results?search_query={query.replace(' ', '+')}"
        else:
            url = f"https://www.google.com/search?q={query.replace(' ', '+')}"

        CONTEXT["last_app"] = site

        return {
            "status": "success",
            "message": f"Searching {query} on {site}",
            "url": url
        }

    # =========================
    # 🔍 SEARCH ONLY (USES CONTEXT)
    # =========================
    if "search" in user_input:
        query = user_input.replace("search", "").strip()

        last_app = CONTEXT.get("last_app")

        if last_app and "youtube" in last_app:
            url = f"https://www.youtube.com/results?search_query={query.replace(' ', '+')}"
        else:
            url = f"https://www.google.com/search?q={query.replace(' ', '+')}"

        return {
            "status": "success",
            "message": f"Searching for {query}",
            "url": url
        }

    # =========================
    # 🌐 OPEN WEBSITE (LAZY MODE)
    # =========================
    if "open" in user_input:
        site = user_input.replace("open", "").strip()

        if "." not in site:
            site = site + ".com"

        CONTEXT["last_app"] = site

        return {
            "status": "success",
            "message": f"Opening {site}...",   # ✅ no URL returned
            "app": site                  # ✅ store context only
        }

    # =========================
    # OPEN APPLICATION
    # =========================
    if "app" in user_input:
        app_name = user_input.replace("open", "").strip()
        return open_application(app_name)

    # =========================
    # RUN COMMAND
    # =========================
    if "run" in user_input:
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