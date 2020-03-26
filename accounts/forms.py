from datetime import datetime

from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm, UsernameField
from django.contrib.gis.geos import Point
from django.core.exceptions import ValidationError

from accounts.colors import random_color
from accounts.models import User, BusinessInfo


class LoginForm(AuthenticationForm):
    username = forms.EmailField()
    password = forms.CharField()
    remember_me = forms.BooleanField(required=False)

    def get_invalid_login_error(self):
        return forms.ValidationError(
            "Verify your %(username)s and password and try again.",
            code='invalid_login',
            params={'username': self.username_field.verbose_name},
        )


class RegisterForm(UserCreationForm):
    username = forms.CharField(required=False)
    first_name = forms.CharField()
    last_name = forms.CharField()
    email = forms.EmailField()
    password1 = forms.CharField()
    password2 = forms.CharField()

    class Meta(UserCreationForm.Meta):
        model = User
        fields = UserCreationForm.Meta.fields + ('email', 'first_name', 'last_name')


class PasswordResetEmailForm(forms.Form):
    email = forms.EmailField()


class EmailVerifyCodeForm(forms.Form):
    code = forms.RegexField(regex=r'^\d{6}$', error_messages={'invalid': 'The code you entered is invalid'})


class PhoneVerifyCodeForm(forms.Form):
    phone_verify_code = forms.RegexField(regex=r'^\d{6}$')

    def __init__(self, user, *args, **kwargs):
        self.user = user
        super().__init__(*args, **kwargs)

    def clean_phone_verify_code(self):
        code = self.cleaned_data['phone_verify_code']
        if code != self.user.phone_verify_code:
            raise ValidationError("Verify code doesn't match.")
        return code

    def save(self):
        self.user.phone_verified_at = datetime.now()
        self.user.save()
        return self.user


class AccountSettingForm(forms.Form):
    first_name = forms.CharField(max_length=64)
    last_name = forms.CharField(max_length=64)
    username = UsernameField()
    email = forms.EmailField()
    phone = forms.RegexField(regex=r'^\+?1?\d{9,15}$', required=False)
    location = forms.CharField(max_length=191, required=False)
    latitude = forms.DecimalField(required=False)
    longitude = forms.DecimalField(required=False)

    def __init__(self, user, *args, **kwargs):
        self.user = user
        super().__init__(*args, **kwargs)

    def clean_username(self):
        username = self.cleaned_data['username'].lower()
        if User.objects.filter(username=username).exists() and self.user.username != username:
            raise ValidationError("That username has been taken. Please choose another.")
        if len(username) < 4:
            raise ValidationError("The username must be at least 4 characters long.")
        return username

    def save(self, commit=True):
        self.user.first_name = self.cleaned_data["first_name"]
        self.user.last_name = self.cleaned_data["last_name"]
        self.user.username = self.cleaned_data["username"]
        self.user.email = self.cleaned_data["email"]
        self.user.phone = self.cleaned_data["phone"]
        self.user.profile.location = self.cleaned_data["location"]
        latitude = self.cleaned_data["latitude"]
        longitude = self.cleaned_data['longitude']
        latlng = Point(float(latitude), float(longitude))
        self.user.profile.latlng = latlng
        if self.user.profile.background_color == '#ffffff':
            self.user.profile.background_color = random_color()
        self.user.profile.save()
        if commit:
            self.user.save()
        return self.user


class BusinessInfoForm(forms.ModelForm):
    name = forms.CharField(required=False, widget=forms.TextInput(attrs={'placeholder': 'Legal Business Name'}))
    location = forms.CharField(required=False, widget=forms.TextInput(attrs={'placeholder': 'Business Location'}))
    phone = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Business Phone Number'}))
    website = forms.CharField(required=False, widget=forms.TextInput(attrs={'placeholder': 'Website'}))

    class Meta:
        model = BusinessInfo
        fields = [
            'name',
            'location',
            'phone',
            'description',
            'areas',
            'website'
        ]

    def __init__(self, user, *args, **kwargs):
        self.user = user
        super().__init__(*args, **kwargs)

    def save(self, commit=True):
        instance = super(BusinessInfoForm, self).save(commit=False)
        instance.user = self.user
        if not instance.name:
            instance.name = self.user.first_name + ' ' + self.user.last_name
        if commit:
            instance.save()
            instance.areas.clear()
            instance.areas.add(*self.cleaned_data['areas'])
        return instance
