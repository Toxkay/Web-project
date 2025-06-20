from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User


SECURITY_QUESTIONS = [
    ("Who was your professor at elementary school?", "Who was your professor at elementary school?"),
    ("What is your mother's maiden name?", "What is your mother's maiden name?"),
    ("What was the name of your first pet?", "What was the name of your first pet?")
]


class CustomUserCreationForm(UserCreationForm):
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)
    email = forms.EmailField(required=True)
    security_question = forms.ChoiceField(choices=SECURITY_QUESTIONS, required=True)
    security_answer = forms.CharField(max_length=255, required=True, widget=forms.TextInput(attrs={'placeholder': 'Your Answer'}))

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'username',
                  'email', 'password1', 'password2', 'security_question', 'security_answer')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['first_name'].widget.attrs['placeholder'] = 'First Name'
        self.fields['last_name'].widget.attrs['placeholder'] = 'Last Name'
        self.fields['username'].widget.attrs['placeholder'] = 'Username'
        self.fields['email'].widget.attrs['placeholder'] = 'Email'
        self.fields['password1'].widget.attrs['placeholder'] = 'Password'
        self.fields['password2'].widget.attrs['placeholder'] = 'Confirm Password'
        self.fields['security_question'].widget.attrs['placeholder'] = 'Security Question'
        self.fields['security_answer'].widget.attrs['placeholder'] = 'Your Answer'

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        if commit:
            user.save()
            # Save UserProfile
            from .models import UserProfile
            UserProfile.objects.create(
                user=user,
                security_question=self.cleaned_data['security_question'],
                security_answer=self.cleaned_data['security_answer']
            )
        return user
