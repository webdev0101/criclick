from django.urls import path

from home.views import HomeView, IndexView, ReviewView, ProfileView

urlpatterns = [
    path('', IndexView.as_view()),
    path('home/', HomeView.as_view()),
    path('<username>/', ProfileView.as_view()),
    path('<username>/reviews/', ReviewView.as_view()),
]
