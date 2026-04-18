import webbrowser


def open_website(site):
    import webbrowser

    if not site.startswith("http"):
        site = "https://" + site

    # 🔥 still open on Ubuntu (optional for now)
    webbrowser.open(site)

    return {
        "status": "success",
        "message": f"Opening {site}",
        "url": site   # 🔥 CRITICAL
    }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


def search_web(query: str):
    try:
        url = f"https://www.google.com/search?q={query}"
        webbrowser.open(url)

        return {
            "status": "success",
            "message": f"Searching for {query}"
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }