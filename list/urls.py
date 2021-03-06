from django.urls import path
from . import views
urlpatterns = [
    path('lists/', views.ListCreateAPIView.as_view()),
    path('lists/reorder/', views.ReorderAPIView.as_view()),
    path('lists/<int:pk>/cards/', views.ListCardsAPIView.as_view()),
    path('lists/<int:pk>/coords/', views.CoordsAPIView.as_view()),
    path('lists/<int:pk>/', views.DetailAPIView.as_view())
]
