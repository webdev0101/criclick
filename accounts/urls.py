from django.contrib.auth import views as auth_views
from django.urls import path

from accounts.views import AjaxLoginView, AjaxRegisterView, EmailVerificationView, AjaxEmailResendView, \
    AjaxPasswordResetView, PasswordResetConfirmView, SettingsView, \
    ProfileRedirectView, BusinessInfoView, AjaxPasswordChangeView, AjaxPhoneVerifyView, AjaxPhoneCodeResendView, \
    AjaxCheckUsernameView, SettingsUploadPhotoView

urlpatterns = [
    path('login/', AjaxLoginView.as_view()),
    path('register/', AjaxRegisterView.as_view()),
    path('email/verify/', EmailVerificationView.as_view()),
    path('email/resend/', AjaxEmailResendView.as_view()),
    path('phone/verify/', AjaxPhoneVerifyView.as_view()),
    path('phone/resend/', AjaxPhoneCodeResendView.as_view()),
    path('password/reset/', AjaxPasswordResetView.as_view()),
    path('password/reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view()),
    path('logout/', auth_views.LogoutView.as_view(next_page='/')),
    path('settings/', SettingsView.as_view()),
    path('settings/upload/<photo_type>/', SettingsUploadPhotoView.as_view()),
    path('check-username/', AjaxCheckUsernameView.as_view()),
    path('profile/', ProfileRedirectView.as_view()),
    path('biz-info/', BusinessInfoView.as_view()),
    path('password/change/', AjaxPasswordChangeView.as_view())
]
