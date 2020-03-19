from django.contrib.auth.decorators import login_required
from django.http import Http404
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views import View

from accounts.decorators import email_verified
from accounts.models import User


class IndexView(View):
    def get(self, request):
        return render(request, 'index.html')


@method_decorator(login_required, name='dispatch')
@method_decorator(email_verified, name='dispatch')
class HomeView(View):
    def get(self, request):
        return render(request, 'home/index.html')


@method_decorator(login_required, name='dispatch')
@method_decorator(email_verified, name='dispatch')
class ProfileView(View):
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise Http404
        if user.id == request.user.id:
            return render(request, 'profile/empty_profile_owner.html', {
                'user': user
            })
        else:
            return render(request, 'profile/empty_profile_visitor.html', {
                'user': user
            })


@method_decorator(login_required, name='dispatch')
@method_decorator(email_verified, name='dispatch')
class ReviewView(View):
    def get(self, request, username):
        return render(request, 'profile/review.html')
