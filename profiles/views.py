import os
import shutil
from io import BytesIO

from PIL import Image
from django.contrib.auth.decorators import login_required
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.http import Http404, JsonResponse
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views import View

from accounts.decorators import email_verified
from accounts.models import User
from criclick import settings
from profiles.forms import PostForm, ProductForm, JobForm, EventForm, OfferForm, PostTempFileForm


class ProfileView(View):
    @method_decorator(login_required, name='dispatch')
    @method_decorator(email_verified, name='dispatch')
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise Http404
        posts_count = user.posts.count()
        if user.id == request.user.id:
            directory = settings.MEDIA_ROOT + '/user_{0}/posts/tmp/'.format(request.user.id)
            try:
                shutil.rmtree(directory)
            except FileNotFoundError:
                print('Directory not found.')
            if posts_count == 0:
                return render(request, 'profile/empty_profile_owner.html', {
                    'user': user
                })
            else:
                posts = user.posts.all()
                return render(request, 'profile/profile_owner.html', {
                    'posts': posts
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


class AjaxPostFileUploadView(View):
    @method_decorator(login_required, name='dispatch')
    @method_decorator(email_verified, name='dispatch')
    def post(self, request, post_type):
        form = PostTempFileForm(files=request.FILES)
        if form.is_valid():
            file = request.FILES['file']
            directory = settings.MEDIA_ROOT + '/user_{0}/posts/tmp/{1}/'.format(request.user.id, post_type)
            os.makedirs(directory, exist_ok=True)
            filename = file.name
            file_path = directory + filename
            i = Image.open(file)
            i.save(file_path, format='JPEG', quality=80)
            return JsonResponse({
                'message': 'success'
            })
        else:
            response = JsonResponse({
                'error': 'File can\'t be empty.'
            })
            response.status_code = 400
            return response


class AjaxPostFileRemoveView(View):
    @method_decorator(login_required, name='dispatch')
    @method_decorator(email_verified, name='dispatch')
    def post(self, request, post_type):
        filename = request.POST['filename']
        directory = settings.MEDIA_ROOT + '/user_{0}/posts/tmp/{1}/'.format(request.user.id, post_type)
        file_path = directory + filename
        try:
            os.remove(file_path)
        except FileNotFoundError:
            response = JsonResponse({
                'error': 'File not found'
            })
            response.status_code = 404
            return response
        return JsonResponse({
            'message': 'success'
        })


class AjaxProductCreateView(View):
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


class AjaxOfferCreateView(View):
    @method_decorator(login_required, name='dispatch')
    @method_decorator(email_verified, name='dispatch')
    def post(self, request):
        form = OfferForm(owner=request.user, data=request.POST)
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
