def success_response(message: str, data=None) -> dict:
    return {
        "success": True,
        "message": message,
        "data": data,
    }
