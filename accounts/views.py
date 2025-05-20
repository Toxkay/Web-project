from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, logout

def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        form.fields['password1'].help_text = "Password must be at least 8 characters and not entirely numeric."
        form.fields['password2'].help_text = "Enter the same password as before, for verification."
        form.fields['username'].widget.attrs['placeholder'] = 'Username'
        form.fields['password1'].widget.attrs['placeholder'] = 'Password'
        form.fields['password2'].widget.attrs['placeholder'] = 'Confirm Password'
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = UserCreationForm()
        form.fields['password1'].help_text = "Password must be at least 8 characters and not entirely numeric."
        form.fields['password2'].help_text = "Enter the same password as before, for verification."
        form.fields['username'].widget.attrs['placeholder'] = 'Username'
        form.fields['password1'].widget.attrs['placeholder'] = 'Password'
        form.fields['password2'].widget.attrs['placeholder'] = 'Confirm Password'
    return render(request, 'signup.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')
    else:
        form = AuthenticationForm()
        form.fields['username'].widget.attrs['placeholder'] = 'Username'
        form.fields['password'].widget.attrs['placeholder'] = 'Password'
    return render(request, 'login.html', {'form': form})

def logout_view(request):
    if request.method == 'POST':
        logout(request)
        return redirect('home')
