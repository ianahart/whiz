from django.urls import path
from . import views
urlpatterns = [
    path('cards/', views.ListCreateAPIView.as_view()),
]