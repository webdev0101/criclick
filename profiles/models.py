from django.db import models

from accounts.models import User


class Post(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField()
    button_type = models.CharField(blank=True, null=True, max_length=191)
    button_link = models.CharField(blank=True, null=True, max_length=191)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


def post_directory_path(instance, filename):
    return 'user_{0}/posts/{1}/{2}'.format(instance.post.owner.id, instance.post.id, filename)


class PostFile(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    file = models.FileField(upload_to=post_directory_path)


class Product(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    product_type = models.CharField(max_length=191)
    name = models.CharField(max_length=191)
    category = models.CharField(max_length=191)
    price_type = models.CharField(max_length=191)
    price = models.IntegerField(default=0)
    min_price = models.IntegerField(default=0)
    max_price = models.IntegerField(default=0)
    description = models.TextField()
    button_type = models.CharField(blank=True, null=True, max_length=191)
    button_link = models.CharField(blank=True, null=True, max_length=191)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


def product_directory_path(instance, filename):
    return 'user_{0}/products/{1}/{2}'.format(instance.product.owner.id, instance.product.id, filename)


class ProductFile(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    file = models.FileField(upload_to=product_directory_path)


class Offer(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=191)
    category = models.CharField(max_length=191)
    start_date_time = models.DateTimeField()
    end_date_time = models.DateTimeField()
    price = models.IntegerField(default=0)
    description = models.TextField()
    more_details = models.TextField(blank=True, null=True)
    coupon_code = models.CharField(blank=True, null=True, max_length=191)
    link_to_redeem = models.CharField(blank=True, null=True, max_length=191)
    terms_and_condition = models.CharField(blank=True, null=True, max_length=191)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


def offer_directory_path(instance, filename):
    return 'user_{0}/offers/{1}/{2}'.format(instance.offer.owner.id, instance.offer.id, filename)


class OfferFile(models.Model):
    offer = models.ForeignKey(Offer, on_delete=models.CASCADE)
    file = models.FileField(upload_to=offer_directory_path)


class Event(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=191)
    category = models.CharField(max_length=191)
    start_date_time = models.DateTimeField()
    end_date_time = models.DateTimeField()
    details = models.TextField(blank=True, null=True)
    button_type = models.CharField(blank=True, null=True, max_length=191)
    button_link = models.CharField(blank=True, null=True, max_length=191)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


def event_directory_path(instance, filename):
    return 'user_{0}/events/{1}/{2}'.format(instance.event.owner.id, instance.event.id, filename)


class EventFile(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    file = models.FileField(upload_to=event_directory_path)


class Job(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=191)
    category = models.CharField(max_length=191)
    employment_type = models.CharField(max_length=64)
    compensation = models.IntegerField(default=0)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


def job_directory_path(instance, filename):
    return 'user_{0}/jobs/{1}/{2}'.format(instance.job.owner.id, instance.job.id, filename)


class JobFile(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    file = models.FileField(upload_to=job_directory_path)
