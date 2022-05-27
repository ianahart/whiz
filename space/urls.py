from django.urls import path
from space import views
urlpatterns = [
    path('background/', views.RetreiveBackgroundAPIView.as_view())
]
