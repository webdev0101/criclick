from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.utils.decorators import method_decorator
from django.views import View

from accounts.decorators import email_verified


class IndexView(View):
    def get(self, request):
        if request.user.is_anonymous:
            return render(request, 'index.html')
        else:
            return redirect('/home')


@method_decorator(login_required, name='dispatch')
@method_decorator(email_verified, name='dispatch')
class HomeView(View):
    def get(self, request):
        return render(request, 'home/index.html')
