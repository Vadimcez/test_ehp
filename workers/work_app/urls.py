from django.conf.urls import url
from work_app import views

urlpatterns = [
    url(r'^$',views.Home.as_view(), name='index'),       
]