import webbrowser


def open_website(site):
    if not site.startswith("http"):
        site = "https://" + site

    return {
        "status": "success",
        "message": f"Opening {site}",
        "url": site
    }


def search_web(query: str):
    try:
        url = f"https://www.google.com/search?q={query}"

        return {
            "status": "success",
            "message": f"Searching for {query}",
            "url": url
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }