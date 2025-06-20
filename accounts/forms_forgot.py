from django import forms
from django.contrib.auth.models import User
from .models import UserProfile

class ForgotPasswordForm(forms.Form):
    username = forms.CharField(max_length=150, required=True)

class SecurityAnswerForm(forms.Form):
    answer = forms.CharField(max_length=255, required=True, widget=forms.TextInput(attrs={'placeholder': 'Your Answer'}))

class PasswordResetForm(forms.Form):
    new_password = forms.CharField(max_length=128, required=True, widget=forms.PasswordInput(attrs={'placeholder': 'New Password'}))
    confirm_password = forms.CharField(max_length=128, required=True, widget=forms.PasswordInput(attrs={'placeholder': 'Confirm New Password'}))

    def clean(self):
        cleaned_data = super().clean()
        new_password = cleaned_data.get('new_password')
        confirm_password = cleaned_data.get('confirm_password')
        if new_password and confirm_password and new_password != confirm_password:
            self.add_error('confirm_password', "Passwords do not match.")
        return cleaned_data
