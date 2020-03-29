import re
from datetime import datetime

from django import forms
from django.core.exceptions import ValidationError

from profiles.models import Post


class PostForm(forms.ModelForm):
    BUTTON_TYPE_CHOICES = (
        ('none', 'None'),
        ('book', 'Book'),
        ('order_online', 'Order online'),
        ('buy', 'Buy'),
        ('learn_more', 'Learn more'),
        ('sign_up', 'Sign up'),
        ('call_now', 'Call now')
    )
    button_type = forms.ChoiceField(choices=BUTTON_TYPE_CHOICES)

    class Meta:
        model = Post
        fields = [
            'description',
            'button_type',
            'button_link',
        ]

    def __init__(self, owner, *args, **kwargs):
        self.owner = owner
        super().__init__(*args, **kwargs)

    def clean_button_link(self):
        button_link = self.cleaned_data['button_link']
        button_type = self.cleaned_data['button_type']
        if button_type == 'none':
            return button_link
        elif button_type == 'call_now':
            regex = re.compile(r'^\+?1?\d{9,15}$')
        else:
            regex = re.compile(
                r'^(?:http)s?://'  # http:// or https://
                r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|'  # domain...
                r'localhost|'  # localhost...
                r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
                r'(?::\d+)?'  # optional port
                r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        if re.match(regex, button_link) is None:
            if button_type == 'call_now':
                raise ValidationError("Invalid phone number")
            else:
                raise ValidationError("Invalid link")
        return button_link

    def save(self, commit=True):
        instance = super(PostForm, self).save(commit=False)
        instance.owner = self.owner
        instance.post_type = 'update'
        if commit:
            instance.save()
        return instance


class ProductForm(forms.ModelForm):  # service and sale
    class Meta:
        model = Post
        fields = [
            'post_type',
            'title',
            'category',
            'price_type',
            'price',
            'min_price',
            'max_price',
            'description',
            'button_type',
            'button_link'
        ]

    def __init__(self, owner, *args, **kwargs):
        self.owner = owner
        super().__init__(*args, **kwargs)

    def save(self, commit=True):
        instance = super(ProductForm, self).save(commit=False)
        instance.owner = self.owner
        if commit:
            instance.save()
        return instance


class OfferForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = [
            'title',
            'category',
            'start_date_time',
            'end_date_time',
            'price',
            'description',
            'more_details',
            'coupon_code',
            'link_to_redeem',
            'terms_and_condition',
        ]

    def __init__(self, owner, *args, **kwargs):
        self.owner = owner
        super().__init__(*args, **kwargs)

    def save(self, commit=True):
        instance = super(OfferForm, self).save(commit=False)
        instance.owner = self.owner
        if commit:
            instance.save()
        return instance


class EventForm(forms.ModelForm):
    CATEGORY_CHOICES = (
        ("service", "Services"),
        ("sale", "For Sale"),
        ("event", "Events"),
        ("job", "Jobs"),
        ("offer", "Offers")
    )
    BUTTON_TYPE_CHOICES = (
        ('none', 'None'),
        ('book', 'Book'),
        ('order_online', 'Order online'),
        ('buy', 'Buy'),
        ('learn_more', 'Learn more'),
        ('sign_up', 'Sign up'),
        ('call_now', 'Call now')
    )

    title = forms.CharField()
    category = forms.ChoiceField(choices=CATEGORY_CHOICES, required=False)
    button_type = forms.ChoiceField(choices=BUTTON_TYPE_CHOICES)
    start_date = forms.DateField(input_formats=['%d/%m/%Y'])
    add_time = forms.BooleanField(required=False)
    start_time = forms.TimeField(required=False, input_formats=['%I:%M %p'])
    end_date = forms.DateField(input_formats=['%d/%m/%Y'])
    end_time = forms.TimeField(required=False, input_formats=['%I:%M %p'])

    class Meta:
        model = Post
        fields = [
            'title',
            'category',
            'button_type',
            'button_link',
            'description'
        ]

    def __init__(self, owner, *args, **kwargs):
        self.owner = owner
        super().__init__(*args, **kwargs)

    def clean_button_link(self):
        button_link = self.cleaned_data['button_link']
        button_type = self.cleaned_data['button_type']
        if button_type == 'none':
            return button_link
        elif button_type == 'call_now':
            regex = re.compile(r'^\+?1?\d{9,15}$')
        else:
            regex = re.compile(
                r'^(?:http)s?://'  # http:// or https://
                r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|'  # domain...
                r'localhost|'  # localhost...
                r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
                r'(?::\d+)?'  # optional port
                r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        if re.match(regex, button_link) is None:
            if button_type == 'call_now':
                raise ValidationError("Invalid phone number")
            else:
                raise ValidationError("Invalid link")
        return button_link

    def save(self, commit=True):
        instance = super(EventForm, self).save(commit=False)
        instance.owner = self.owner
        instance.post_type = 'event'
        add_time = self.cleaned_data['add_time']
        if add_time:
            instance.start_date_time = datetime.combine(self.cleaned_data['start_date'], self.cleaned_data['start_time'])
            instance.end_date_time = datetime.combine(self.cleaned_data['end_date'], self.cleaned_data['end_time'])
        else:
            instance.start_date_time = self.cleaned_data['start_date']
            instance.end_date_time = self.cleaned_data['end_date']
        if commit:
            instance.save()
        return instance


class JobForm(forms.ModelForm):
    EMPLOYMENT_TYPE_CHOICES = (
        ("full", "Full Time"),
        ("part", "Part Time"),
    )

    title = forms.CharField(required=True)
    compensation = forms.IntegerField(required=False)
    description = forms.CharField(required=True)
    employment_type = forms.ChoiceField(required=True, choices=EMPLOYMENT_TYPE_CHOICES)

    class Meta:
        model = Post
        fields = [
            'title',
            'category',
            'employment_type',
            'compensation',
            'description'
        ]

    def __init__(self, owner, *args, **kwargs):
        self.owner = owner
        super().__init__(*args, **kwargs)

    def save(self, commit=True):
        instance = super(JobForm, self).save(commit=False)
        instance.owner = self.owner
        instance.post_type = 'job'
        if commit:
            instance.save()
        return instance
