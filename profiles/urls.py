from django.urls import path

from profiles.views import ProfileView, ReviewView, ConnectionsView, AjaxPostCreateView, AjaxProductCreateView, \
    AjaxJobCreateView, AjaxEventCreateView, AjaxOfferCreateView, AjaxPostFileUploadView, AjaxPostFileRemoveView

urlpatterns = [
    path('<username>/', ProfileView.as_view()),
    path('<username>/reviews/', ReviewView.as_view()),
    path('<username>/connections/', ConnectionsView.as_view()),
    path('profiles/posts/create/', AjaxPostCreateView.as_view()),
    path('profiles/<post_type>/upload/', AjaxPostFileUploadView.as_view()),
    path('profiles/<post_type>/remove/', AjaxPostFileRemoveView.as_view()),
    path('profiles/products/create/', AjaxProductCreateView.as_view()),
    path('profiles/offers/create/', AjaxOfferCreateView.as_view()),
    path('profiles/events/create/', AjaxEventCreateView.as_view()),
    path('profiles/jobs/create/', AjaxJobCreateView.as_view()),
]
