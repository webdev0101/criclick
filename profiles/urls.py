from django.urls import path

from profiles.views import ProfileView, ReviewView, ConnectionsView, AjaxPostCreateView, AjaxServiceCreateView, \
    AjaxJobCreateView, AjaxEventCreateView

urlpatterns = [
    path('<username>/', ProfileView.as_view()),
    path('<username>/reviews/', ReviewView.as_view()),
    path('<username>/connections/', ConnectionsView.as_view()),
    path('profiles/posts/create/', AjaxPostCreateView.as_view()),
    path('profiles/services/create/', AjaxServiceCreateView.as_view()),
    path('profiles/events/create/', AjaxEventCreateView.as_view()),
    path('profiles/jobs/create/', AjaxJobCreateView.as_view()),
]
