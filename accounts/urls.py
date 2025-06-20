from django.urls import path
from . import views
from . import views_forgot

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('forgot-password/', views_forgot.forgot_password, name='forgot_password'),
    path('security-question/', views_forgot.security_question, name='security_question'),
    path('reset-password/', views_forgot.reset_password, name='reset_password'),
]
