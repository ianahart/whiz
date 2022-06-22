from django.urls import path
from . import views
urlpatterns = [
    path('cards/', views.ListCreateAPIView.as_view()),
    path('cards/reorder/', views.ReorderAPIView.as_view()),
    path('cards/<int:pk>/', views.DetailAPIView.as_view()),
    path('cards/<int:pk>/move/', views.MoveCardAPIView.as_view()),
]
