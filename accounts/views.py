import urllib.request
from datetime import datetime
from io import BytesIO

import requests
from PIL import Image
from django.contrib.auth import login, update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import SetPasswordForm, PasswordChangeForm
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.template.loader import render_to_string
from django.utils.crypto import get_random_string
from django.utils.decorators import method_decorator
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.views import View
from social_django.models import UserSocialAuth

from accounts.colors import random_color
from accounts.decorators import email_verified
from accounts.forms import LoginForm, RegisterForm, EmailVerifyCodeForm, PasswordResetEmailForm, AccountSettingForm, \
    PhoneVerifyCodeForm, BusinessInfoForm
from accounts.models import User, Profile, Area


class AjaxLoginView(View):
    def post(self, request):
        form = LoginForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            remember_me = form.data.get('remember_me', 'off')
            if remember_me == 'on':
                request.session.set_expiry(0)
            login(request, user)
            data = {
                'message': 'Success'
            }
            response = JsonResponse(data)
            response.status_code = 200
            return response
        else:
            data = form.errors
            response = JsonResponse(data, safe=False)
            response.status_code = 400
            return response


class AjaxRegisterView(View):
    def post(self, request):
        form = RegisterForm(request.POST)
        if form.is_valid():
            username = get_random_string(length=16, allowed_chars='abcdefghijklmnopqrstuvwxyz0123456789')
            email_verify_code = get_random_string(length=6, allowed_chars='1234567890')
            user = User.objects.create_user(
                username=username,
                first_name=form.data['first_name'],
                last_name=form.data['last_name'],
                email=form.data['email'],
                email_verify_code=email_verify_code,
                password=form.data['password1']
            )
            current_site = get_current_site(request)
            subject = 'Activate Account'
            message = render_to_string('emails/account_activation_email.html', {
                'domain': current_site.domain,
                'email_verify_code': email_verify_code
            })
            user.email_user(subject, message='', html_message=message, from_email='no-reply@criclick.com')

            login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            data = {
                'message': 'Success'
            }
            response = JsonResponse(data)
            response.status_code = 200
            return response
        else:
            data = form.errors
            response = JsonResponse(data, safe=False)
            response.status_code = 400
            return response


@method_decorator(login_required, name='dispatch')
class EmailVerificationView(View):
    template_name = 'accounts/verify.html'

    def get(self, request):
        user = request.user
        if user.email_verified_at is None:
            social_count = user.social_auth.count()
            if social_count > 0:
                try:
                    social = user.social_auth.get(provider='google-oauth2')
                    access_token = social.extra_data['access_token']
                    headers = {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Authorization': 'Bearer %s' % access_token
                    }
                    result = requests.request(
                        method='GET',
                        url='https://www.googleapis.com/oauth2/v3/userinfo',
                        headers=headers
                    )
                    user_data = result.json()
                    avatar = user_data['picture']
                    i = Image.open(urllib.request.urlopen(avatar))
                    thumb_io = BytesIO()
                    i.save(thumb_io, format='JPEG', quality=80)
                    inmemory_uploaded_file = InMemoryUploadedFile(thumb_io, None, 'avatar.jpg',
                                                                  'image/jpeg', thumb_io.tell(), None)
                    from django.db import IntegrityError
                    try:
                        Profile.objects.create(user=user, avatar=inmemory_uploaded_file)
                    except IntegrityError:
                        print('Profile exist')
                        profile = Profile.objects.get(user=user)
                        profile.avatar = avatar
                        profile.background_color = random_color()
                        profile.save()
                except UserSocialAuth.DoesNotExist:
                    print('Google account not found')
                    try:
                        social = user.social_auth.get(provider='facebook')
                    except UserSocialAuth.DoesNotExist:
                        print('Facebook account not found')
                user.email_verified_at = datetime.now()
                user.save()
                return redirect('/home')
            return render(request, 'accounts/verify.html')
        else:
            return redirect('/home')

    def post(self, request):
        form = EmailVerifyCodeForm(request.POST)
        if form.is_valid():
            code = form.data['code']
            user = request.user
            if user.email_verify_code == code:
                user.email_verified_at = datetime.now()
                user.save()
                Profile.objects.create(user=user, background_color=random_color())
                data = {
                    'message': 'Success'
                }
                response = JsonResponse(data)
                response.status_code = 200
                return response
            else:
                data = {
                    'message': 'The code you entered is invalid.'
                }
                response = JsonResponse(data, safe=False)
                response.status_code = 400
                return response
        else:
            data = form.errors
            response = JsonResponse(data, safe=False)
            response.status_code = 400
            return response


@method_decorator(login_required, name='dispatch')
class AjaxEmailResendView(View):
    def post(self, request):
        user = request.user
        email_verify_code = get_random_string(length=6, allowed_chars='1234567890')
        current_site = get_current_site(request)
        subject = 'Activate Account'
        message = render_to_string('emails/account_activation_email.html', {
            'domain': current_site.domain,
            'email_verify_code': email_verify_code
        })
        user.email_verify_code = email_verify_code
        user.save()
        user.email_user(subject, message='', html_message=message, from_email='no-reply@criclick.com')
        data = {
            'message': 'Success'
        }
        response = JsonResponse(data)
        response.status_code = 200
        return response


class AjaxPasswordResetView(View):
    def send_password_reset_link(self, request, user):
        current_site = get_current_site(request)
        subject = 'Password reset sent'
        # if request.is_secure():
        #     protocol = 'https'
        # else:
        #     protocol = 'http'
        protocol = 'http'
        message = render_to_string('emails/password_reset.html', {
            'protocol': protocol,
            'domain': current_site.domain,
            'uid': urlsafe_base64_encode(force_bytes(user.pk)),
            'token': default_token_generator.make_token(user)
        })
        user.email_user(subject, message='', html_message=message, from_email='no-reply@criclick.com')

    @method_decorator(email_verified, name='dispatch')
    @method_decorator(login_required, name='dispatch')
    def get(self, request):
        user = request.user
        self.send_password_reset_link(request, user)
        data = {
            'message': 'We sent you an email please check and click the link.'
        }
        response = JsonResponse(data)
        response.status_code = 200
        return response

    def post(self, request):
        form = PasswordResetEmailForm(request.POST)
        if form.is_valid():
            email = form.data['email']
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                data = {
                    'message': 'We couldn\'t find this email in our database.'
                }
                response = JsonResponse(data, safe=False)
                response.status_code = 404
                return response
            self.send_password_reset_link(request, user)
            data = {
                'message': 'We sent you an email please check and click the link.'
            }
            response = JsonResponse(data)
            response.status_code = 200
            return response
        else:
            data = form.errors
            response = JsonResponse(data, safe=False)
            response.status_code = 400
            return response


class PasswordResetConfirmView(View):
    def get(self, request, uidb64, token):
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        if user is not None and default_token_generator.check_token(user, token):
            return render(request, 'accounts/password_confirm.html')
        else:
            return redirect('/')

    def post(self, request, uidb64, token):
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        if user is not None and default_token_generator.check_token(user, token):
            form = SetPasswordForm(data=request.POST, user=user)
            if form.is_valid():
                form.save()
                data = {
                    'message': 'Success'
                }
                response = JsonResponse(data)
                response.status_code = 200
                return response
            else:
                data = form.errors
                response = JsonResponse(data, safe=False)
                response.status_code = 400
                return response
        else:
            return redirect('/accounts/login/')


@method_decorator(login_required, name='dispatch')
@method_decorator(email_verified, name='dispatch')
class ProfileRedirectView(View):
    def get(self, request):
        user = request.user
        return redirect('/' + user.username + '/')


@method_decorator(login_required, name='dispatch')
@method_decorator(email_verified, name='dispatch')
class AjaxPasswordChangeView(View):
    def post(self, request):
        form = PasswordChangeForm(data=request.POST, user=request.user)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)
            data = {
                'message': 'Success'
            }
            response = JsonResponse(data=data)
            response.status_code = 200
            return response
        else:
            response = JsonResponse(data=form.errors, safe=False)
            response.status_code = 400
            return response


class AjaxPhoneVerifyView(View):
    @method_decorator(login_required, name='dispatch')
    @method_decorator(email_verified, name='dispatch')
    def post(self, request):
        form = PhoneVerifyCodeForm(user=request.user, data=request.POST)
        if form.is_valid():
            form.save()
            data = {
                'message': 'Success'
            }
            response = JsonResponse(data=data)
            response.status_code = 200
            return response
        else:
            response = JsonResponse(data=form.errors, safe=False)
            response.status_code = 400
            return response


class AjaxPhoneCodeResendView(View):
    @method_decorator(login_required, name='dispatch')
    @method_decorator(email_verified, name='dispatch')
    def get(self, request):
        request.user.sms_to_verify()
        data = {
            'messages': 'Success'
        }
        response = JsonResponse(data)
        response.status_code = 200
        return response


class SettingsView(View):
    @method_decorator(login_required, name='dispatch')
    @method_decorator(email_verified, name='dispatch')
    def get(self, request):
        email = request.user.email
        email_name_domain = email.split('@')
        mail_name = email_name_domain[0]
        mail_name_list = list(mail_name)
        for idx in range(len(mail_name_list)):
            if idx == 0 or idx == len(mail_name_list) - 1:
                continue
            mail_name_list[idx] = '*'
        mail_name = "".join(mail_name_list)
        mail_domain = email_name_domain[1]
        hidden_email = mail_name + '@' + mail_domain
        return render(request, 'accounts/settings.html', {
            'hidden_email': hidden_email,
        })

    @method_decorator(login_required, name='dispatch')
    @method_decorator(email_verified, name='dispatch')
    def post(self, request):
        form = AccountSettingForm(user=request.user, data=request.POST)
        if form.is_valid():
            form.save()
            if form.user.phone and form.user.phone_verified_at is None:
                form.user.sms_to_verify()
                data = {
                    'message': 'Success',
                    'phone_verified': 'false'
                }
            else:
                data = {
                    'message': 'Success',
                    'phone_verified': 'true'
                }
            response = JsonResponse(data)
            response.status_code = 200
            return response
        else:
            data = form.errors
            response = JsonResponse(data)
            response.status_code = 400
            return response


class SettingsUploadPhotoView(View):
    @method_decorator(login_required, name='dispatch')
    @method_decorator(email_verified, name='dispatch')
    def post(self, request, photo_type):
        file = request.FILES.get('file', None)
        ext = file.content_type.split('/')[-1]
        i = Image.open(file)
        thumb_io = BytesIO()
        i.save(thumb_io, format='JPEG', quality=80)
        if photo_type == 'avatar':
            inmemory_uploaded_file = InMemoryUploadedFile(thumb_io, None, 'avatar.' + ext,
                                                          'image/jpeg', thumb_io.tell(), None)
            request.user.profile.avatar = inmemory_uploaded_file
            request.user.profile.save()
        elif photo_type == 'banner':
            inmemory_uploaded_file = InMemoryUploadedFile(thumb_io, None, 'banner.' + ext,
                                                          'image/jpeg', thumb_io.tell(), None)
            points_string = request.POST.get('points', None)
            zoom = request.POST.get('zoom', None)
            request.user.profile.banner_points = points_string
            request.user.profile.banner_zoom = zoom
            request.user.profile.banner = inmemory_uploaded_file
            request.user.profile.save()
        return JsonResponse({

        })


class SettingsPhotoView(View):
    @method_decorator(login_required, name='dispatch')
    @method_decorator(email_verified, name='dispatch')
    def get(self, request, photo_type):
        image_data = None
        if photo_type == 'avatar':
            image_data = request.user.profile.get_original_avatar_base64()
        elif photo_type == 'banner':
            image_data = request.user.profile.get_original_banner_base64()
        if image_data is None:
            response = JsonResponse({
                'data': ''
            })
            response.status_code = 404
            return response
        else:
            return JsonResponse({
                'data': image_data
            })


class AjaxCheckUsernameView(View):
    @method_decorator(login_required, name='dispatch')
    @method_decorator(email_verified, name='dispatch')
    def get(self, request):
        username = request.GET['username'].lower()
        if username == '':
            data = {
                'message': ''
            }
            response = JsonResponse(data)
            response.status_code = 400
            return response
        if len(username) < 4:
            data = {
                'message': 'The username must be at least 4 characters long.'
            }
            response = JsonResponse(data)
            response.status_code = 400
            return response
        try:
            user = User.objects.get(username=username)
            if user.username != request.user.username:
                data = {
                    'message': 'This username is already being used. Please try another one.'
                }
                response = JsonResponse(data)
                response.status_code = 400
                return response
        except User.DoesNotExist:
            data = {
                'message': 'Success'
            }
            response = JsonResponse(data)
            response.status_code = 200
            return response
        data = {
            'message': 'Success'
        }
        response = JsonResponse(data)
        response.status_code = 200
        return response


class BusinessInfoView(View):
    @method_decorator(login_required, name='dispatch')
    @method_decorator(email_verified, name='dispatch')
    def get(self, request):
        if hasattr(request.user, 'businessinfo'):
            form = BusinessInfoForm(user=request.user, instance=request.user.businessinfo)
        else:
            form = BusinessInfoForm(user=request.user)
        linkedin_account = request.user.social_auth.filter(provider='linkedin-oauth2')
        areas = Area.objects.all()
        return render(request, 'accounts/biz_info.html', {
            'linkedin_account': linkedin_account,
            'areas': areas,
            'form': form,
        })

    @method_decorator(login_required, name='dispatch')
    @method_decorator(email_verified, name='dispatch')
    def post(self, request):
        if hasattr(request.user, 'businessinfo'):
            form = BusinessInfoForm(user=request.user, data=request.POST, instance=request.user.businessinfo)
        else:
            form = BusinessInfoForm(user=request.user, data=request.POST)
        if form.is_valid():
            form.save()
            response = JsonResponse({

            })
            response.status_code = 200
            return response
        else:
            data = form.errors
            response = JsonResponse(data)
            response.status_code = 400
            return response
