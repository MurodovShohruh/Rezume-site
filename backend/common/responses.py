from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import exception_handler


def success_response(data=None, message: str = 'OK', status_code: int = status.HTTP_200_OK) -> Response:
    """
    Muvaffaqiyatli javob formati:
    {
        "success": true,
        "message": "OK",
        "data": { ... }
    }
    """
    return Response({
        'success': True,
        'message': message,
        'data': data,
    }, status=status_code)


def error_response(errors, status_code: int = status.HTTP_400_BAD_REQUEST, message: str = 'Xato yuz berdi') -> Response:
    """
    Xato javob formati:
    {
        "success": false,
        "message": "Xato yuz berdi",
        "errors": { ... }
    }
    """
    return Response({
        'success': False,
        'message': message,
        'errors': errors,
    }, status=status_code)


def custom_exception_handler(exc, context):
    """DRF standart xatolarini ham bir xil formatga keltiradi."""
    response = exception_handler(exc, context)

    if response is not None:
        response.data = {
            'success': False,
            'message': 'Xato yuz berdi',
            'errors': response.data,
        }

    return response
