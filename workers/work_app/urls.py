from django.conf.urls import url
from work_app import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'home/',views.Home.as_view(), name='home'),    
    #url(r'home/', views.get, name='get'),
    #url(r'home/', views.tab, name='ajax_tab'),
    
]