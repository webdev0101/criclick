import os
import re
import shutil
from datetime import datetime

from django import forms
from django.core.exceptions import ValidationError

from criclick import settings
from profiles.models import Post, PostFile


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
    description = forms.CharField()

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
            if button_link is None:
                raise ValidationError("This field cannot be empty.")
            regex = re.compile(r'^\+?1?\d{9,15}$')
        else:
            if button_link is None:
                raise ValidationError("This field cannot be empty.")
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
            src_dir = settings.MEDIA_ROOT + '/user_{0}/posts/tmp/updates/'.format(self.owner.id)
            dst_dir = settings.MEDIA_ROOT + '/user_{0}/posts/{1}'.format(self.owner.id, instance.id)
            directory = 'user_{0}/posts/{1}'.format(self.owner.id, instance.id)
            os.makedirs(src_dir, exist_ok=True)
            os.makedirs(dst_dir, exist_ok=True)
            src_files = os.listdir(src_dir)
            for f in src_files:
                shutil.move(src_dir + f, dst_dir)
                filepath = directory + '/' + f
                PostFile.objects.create(post=instance, file=filepath)
        return instance


class PostTempFileForm(forms.Form):
    file = forms.FileField()


class ProductForm(forms.ModelForm):  # service and sale
    POST_TYPE_CHOICES = (
        ('service', 'Services'),
        ('sale', 'For Sale'),
    )
    CATEGORY_CHOICES = (
        ("service", "Services"),
        ("sale", "For Sale"),
        ("event", "Events"),
        ("job", "Jobs"),
        ("offer", "Offers")
    )
    PRICE_TYPE_CHOICES = (
        ('fixed', 'Fixed Price'),
        ('range', 'Price Range')
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

    post_type = forms.ChoiceField(choices=POST_TYPE_CHOICES)
    title = forms.CharField()
    category = forms.ChoiceField(choices=CATEGORY_CHOICES, required=False)
    price_type = forms.ChoiceField(choices=PRICE_TYPE_CHOICES)
    price = forms.IntegerField(required=False)
    min_price = forms.IntegerField(required=False)
    max_price = forms.IntegerField(required=False)
    description = forms.CharField()
    button_type = forms.ChoiceField(choices=BUTTON_TYPE_CHOICES)

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

    def clean_price(self):
        price_type = self.cleaned_data['price_type']
        price = self.cleaned_data['price']
        if price_type == 'fixed':
            if price is None:
                raise ValidationError("This field cannot be empty")
            return price
        elif price_type == 'range':
            return None

    def clean_min_price(self):
        price_type = self.cleaned_data['price_type']
        min_price = self.cleaned_data['min_price']
        if price_type == 'range':
            if min_price is None:
                raise ValidationError("This field cannot be empty")
            else:
                return min_price
        elif price_type == 'fixed':
            return None

    def clean_max_price(self):
        price_type = self.cleaned_data['price_type']
        max_price = self.cleaned_data['max_price']
        if price_type == 'range':
            if max_price is None:
                raise ValidationError("This field cannot be empty.")
            else:
                return max_price
        elif price_type == 'fixed':
            return None

    def clean_button_link(self):
        button_link = self.cleaned_data['button_link']
        button_type = self.cleaned_data['button_type']
        if button_type == 'none':
            return button_link
        elif button_type == 'call_now':
            if button_link is None:
                raise ValidationError("This field cannot be empty.")
            regex = re.compile(r'^\+?1?\d{9,15}$')
        else:
            if button_link is None:
                raise ValidationError("This field cannot be empty.")
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

    def clean(self):
        cleaned_data = super().clean()
        price_type = cleaned_data.get('price_type')
        if price_type == 'range':
            min_price = cleaned_data.get('min_price')
            max_price = cleaned_data.get('max_price')
            if min_price is not None and max_price is not None and min_price > max_price:
                self.add_error('max_price', "Max price should be greater than min price.")
        return cleaned_data

    def save(self, commit=True):
        instance = super(ProductForm, self).save(commit=False)
        instance.owner = self.owner
        if commit:
            instance.save()
            if instance.post_type == 'service':
                src_dir = settings.MEDIA_ROOT + '/user_{0}/posts/tmp/services/'.format(self.owner.id)
            elif instance.post_type == 'sale':
                src_dir = settings.MEDIA_ROOT + '/user_{0}/posts/tmp/sales/'.format(self.owner.id)
            else:
                src_dir = settings.MEDIA_ROOT + '/user_{0}/posts/tmp/sales/'.format(self.owner.id)
            dst_dir = settings.MEDIA_ROOT + '/user_{0}/posts/{1}'.format(self.owner.id, instance.id)
            directory = 'user_{0}/posts/{1}'.format(self.owner.id, instance.id)
            os.makedirs(src_dir, exist_ok=True)
            os.makedirs(dst_dir, exist_ok=True)
            src_files = os.listdir(src_dir)
            for f in src_files:
                shutil.move(src_dir + f, dst_dir)
                filepath = directory + '/' + f
                PostFile.objects.create(post=instance, file=filepath)
        return instance


class OfferForm(forms.ModelForm):
    CATEGORY_CHOICES = (
        ("service", "Services"),
        ("sale", "For Sale"),
        ("event", "Events"),
        ("job", "Jobs"),
        ("offer", "Offers")
    )

    title = forms.CharField()
    category = forms.ChoiceField(choices=CATEGORY_CHOICES, required=False)
    description = forms.CharField()
    add_time = forms.BooleanField(required=False)
    start_date = forms.DateField(input_formats=['%d/%m/%Y'])
    start_time = forms.TimeField(required=False, input_formats=['%I:%M %p'])
    end_date = forms.DateField(input_formats=['%d/%m/%Y'])
    end_time = forms.TimeField(required=False, input_formats=['%I:%M %p'])

    class Meta:
        model = Post
        fields = [
            'title',
            'category',
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
        instance.post_type = 'offer'
        add_time = self.cleaned_data['add_time']
        if add_time:
            instance.start_date_time = datetime.combine(self.cleaned_data['start_date'],
                                                        self.cleaned_data['start_time'])
            instance.end_date_time = datetime.combine(self.cleaned_data['end_date'], self.cleaned_data['end_time'])
        else:
            instance.start_date_time = self.cleaned_data['start_date']
            instance.end_date_time = self.cleaned_data['end_date']
        if commit:
            instance.save()
            src_dir = settings.MEDIA_ROOT + '/user_{0}/posts/tmp/offers/'.format(self.owner.id)
            dst_dir = settings.MEDIA_ROOT + '/user_{0}/posts/{1}'.format(self.owner.id, instance.id)
            directory = 'user_{0}/posts/{1}'.format(self.owner.id, instance.id)
            os.makedirs(src_dir, exist_ok=True)
            os.makedirs(dst_dir, exist_ok=True)
            src_files = os.listdir(src_dir)
            for f in src_files:
                shutil.move(src_dir + f, dst_dir)
                filepath = directory + '/' + f
                PostFile.objects.create(post=instance, file=filepath)
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
    add_time = forms.BooleanField(required=False)
    start_date = forms.DateField(input_formats=['%d/%m/%Y'])
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
            if button_link is None:
                raise ValidationError("This field cannot be empty.")
            regex = re.compile(r'^\+?1?\d{9,15}$')
        else:
            if button_link is None:
                raise ValidationError("This field cannot be empty.")
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
            instance.start_date_time = datetime.combine(self.cleaned_data['start_date'],
                                                        self.cleaned_data['start_time'])
            instance.end_date_time = datetime.combine(self.cleaned_data['end_date'], self.cleaned_data['end_time'])
        else:
            instance.start_date_time = self.cleaned_data['start_date']
            instance.end_date_time = self.cleaned_data['end_date']
        if commit:
            instance.save()
            src_dir = settings.MEDIA_ROOT + '/user_{0}/posts/tmp/events/'.format(self.owner.id)
            dst_dir = settings.MEDIA_ROOT + '/user_{0}/posts/{1}'.format(self.owner.id, instance.id)
            directory = 'user_{0}/posts/{1}'.format(self.owner.id, instance.id)
            os.makedirs(src_dir, exist_ok=True)
            os.makedirs(dst_dir, exist_ok=True)
            src_files = os.listdir(src_dir)
            for f in src_files:
                shutil.move(src_dir + f, dst_dir)
                filepath = directory + '/' + f
                PostFile.objects.create(post=instance, file=filepath)
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
            src_dir = settings.MEDIA_ROOT + '/user_{0}/posts/tmp/jobs/'.format(self.owner.id)
            dst_dir = settings.MEDIA_ROOT + '/user_{0}/posts/{1}'.format(self.owner.id, instance.id)
            directory = 'user_{0}/posts/{1}'.format(self.owner.id, instance.id)
            os.makedirs(src_dir, exist_ok=True)
            os.makedirs(dst_dir, exist_ok=True)
            src_files = os.listdir(src_dir)
            for f in src_files:
                shutil.move(src_dir + f, dst_dir)
                filepath = directory + '/' + f
                PostFile.objects.create(post=instance, file=filepath)
        return instance
