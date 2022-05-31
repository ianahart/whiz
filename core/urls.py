from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(('authentication.urls', 'authentication'))),
    path('api/v1/', include(('account.urls', 'account'))),
    path('api/v1/', include(('space.urls', 'space'))),
    path('api/v1/', include(('list.urls', 'list'))),
    path('api/v1/', include(('card.urls', 'card'))),

]
