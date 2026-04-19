import subprocess

def run_command(command: str):
    try:
        result = subprocess.run(
            command,
            shell=True,
            capture_output=True,
            text=True
        )

        output = result.stdout.strip()
        error = result.stderr.strip()

        return {
            "status": "success",
            "message": "Command executed",
            "output": output if output else "(no output)",
            "error": error
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "output": "",
            "error": str(e)
        }


def open_application(app_name: str):
    try:
        subprocess.Popen(app_name.split())
        
        return {
            "status": "success",
            "message": f"{app_name} launched successfully"
        }
    
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }