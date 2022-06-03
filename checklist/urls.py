from django.urls import path
from . import views
urlpatterns = [
    path('checklists/', views.ListCreateAPIView.as_view()),
    path('checklists/items/', views.ListCreateListItemAPIView.as_view()),
    path('checklists/items/<int:pk>/', views.DetailListItemItemAPIView.as_view())
]
