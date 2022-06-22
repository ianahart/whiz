from django.urls import path
from space import views
urlpatterns = [
    path('spaces/background/', views.RetreiveBackgroundAPIView.as_view()),
    path('spaces/', views.ListCreateAPIView.as_view()),
    path('spaces/search/', views.SearchAPIView.as_view()),
    path('spaces/<int:pk>/', views.DetailAPIView.as_view())
]
