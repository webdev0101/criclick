from django.db import models

from accounts.models import User


class Post(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    post_type = models.CharField(max_length=191)  # type of post, value = update, service, sale, offer, event, or job
    title = models.CharField(max_length=191, blank=True)  # for service, sale, offer, event, and job
    category = models.CharField(max_length=191, blank=True)  # for service, sale, offer, event, and job
    price_type = models.CharField(max_length=191, blank=True, null=True)  # for service and sale
    price = models.IntegerField(default=0)  # for service, sale, and offer
    min_price = models.IntegerField(default=0)  # for service, sale if price type is range
    max_price = models.IntegerField(default=0)  # for service, sale if price type is range
    start_date_time = models.DateTimeField(null=True)  # for offers, and event
    end_date_time = models.DateTimeField(null=True)  # for offers, and event
    employment_type = models.CharField(max_length=64, blank=True, null=True)  # for job
    compensation = models.IntegerField(default=0, null=True)  # for job
    description = models.TextField(blank=True, null=True)  # for updates, services, sales, offers, events, and jobs
    button_type = models.CharField(blank=True, null=True, max_length=191)  # for updates, services, sale, and events
    button_link = models.CharField(blank=True, null=True, max_length=191)  # for updates, services, sale, and events
    more_details = models.TextField(blank=True, null=True)  # for offers
    coupon_code = models.CharField(blank=True, null=True, max_length=191)  # for offers
    link_to_redeem = models.CharField(blank=True, null=True, max_length=191)  # for offers
    terms_and_condition = models.CharField(blank=True, null=True, max_length=191)  # for offers
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


def post_directory_path(instance, filename):
    return 'user_{0}/posts/{1}/{2}'.format(instance.post.owner.id, instance.post.id, filename)


class PostFile(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    file = models.FileField(upload_to=post_directory_path)
