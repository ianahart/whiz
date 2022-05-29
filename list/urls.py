from django.urls import path
from . import views
urlpatterns = [
    path('lists/', views.ListCreateAPIView.as_view()),
    path('lists/<int:pk>/', views.DetailAPIView.as_view())
]
