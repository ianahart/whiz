from django.urls import path
from account import views
urlpatterns = [
    path('account/', views.RetreiveUserAPIView.as_view()),
    path('account/<int:pk>/', views.DetailAPIView.as_view()),
]
