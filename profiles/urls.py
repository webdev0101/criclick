from django.urls import path

from profiles.views import IndexView

urlpatterns = [
    path('', IndexView.as_view())
]
