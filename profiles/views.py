from django.contrib.auth.decorators import login_required
from django.http import Http404, JsonResponse
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views import View

from accounts.decorators import email_verified
from accounts.models import User
from profiles.forms import PostForm, ProductForm, JobForm, EventForm


class ProfileView(View):
    @method_decorator(login_required, name='dispatch')
    @method_decorator(email_verified, name='dispatch')
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise Http404
        # posts_count = user.posts.count() + user
        if user.id == request.user.id:
            return render(request, 'profile/empty_profile_owner.html', {
                'user': user
            })
        else:
            return render(request, 'profile/empty_profile_visitor.html', {
                'user': user
            })


class ReviewView(View):
    @method_decorator(login_required, name='dispatch')
    @method_decorator(email_verified, name='dispatch')
    def get(self, request, username):
        return render(request, 'profile/review.html')


class ConnectionsView(View):
    @method_decorator(login_required, name='dispatch')
    @method_decorator(email_verified, name='dispatch')
    def get(self, request, username):
        return render(request, 'profile/connections.html')


class AjaxPostCreateView(View):
    @method_decorator(login_required, name='dispatch')
    @method_decorator(email_verified, name='dispatch')
    def post(self, request):
        form = PostForm(owner=request.user, data=request.POST)
        if form.is_valid():
            form.save()
            response = JsonResponse({
                'message': 'Success'
            })
            return response
        else:
            response = JsonResponse(form.errors)
            response.status_code = 400
            return response


class AjaxServiceCreateView(View):
    @method_decorator(login_required, name='dispatch')
    @method_decorator(email_verified, name='dispatch')
    def post(self, request):
        form = ProductForm(owner=request.user, data=request.POST)
        if form.is_valid():
            form.save()
            response = JsonResponse({
                'message': 'Success'
            })
            return response
        else:
            response = JsonResponse(form.errors)
            response.status_code = 400
            return response


class AjaxEventCreateView(View):
    @method_decorator(login_required, name='dispatch')
    @method_decorator(email_verified, name='dispatch')
    def post(self, request):
        form = EventForm(owner=request.user, data=request.POST)
        if form.is_valid():
            form.save()
            response = JsonResponse({
                'message': 'Success'
            })
            return response
        else:
            response = JsonResponse(form.errors)
            response.status_code = 400
            return response


class AjaxJobCreateView(View):
    @method_decorator(login_required, name='dispatch')
    @method_decorator(email_verified, name='dispatch')
    def post(self, request):
        form = JobForm(owner=request.user, data=request.POST)
        if form.is_valid():
            form.save()
            response = JsonResponse({
                'message': 'Success'
            })
            return response
        else:
            response = JsonResponse(form.errors)
            response.status_code = 400
            return response
