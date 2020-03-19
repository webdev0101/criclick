from functools import wraps

from django.http import JsonResponse
from django.shortcuts import redirect


def email_verified(function):
    @wraps(function)
    def wrap(request, *args, **kwargs):
        if request.user.email_verified_at is None:
            if request.is_ajax():
                data = {
                    'error_code': 'email_not_verified',
                    'message': 'Email not verified',
                }
                response = JsonResponse(data=data)
                response.status_code = 403
                return response
            else:
                return redirect('/accounts/email/verify')
        else:
            pass
        return function(request, *args, **kwargs)

    return wrap
