from django.urls import path
from . import views
urlpatterns = [
    path('lists/', views.ListCreateAPIView.as_view())
]
