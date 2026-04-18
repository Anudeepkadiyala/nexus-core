import subprocess

def run_command(command: str):
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        
        return {
            "status": "success",
            "output": result.stdout,
            "error": result.stderr
        }
    
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
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