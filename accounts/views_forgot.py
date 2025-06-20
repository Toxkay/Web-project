from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth import login
from .models import UserProfile
from .forms_forgot import ForgotPasswordForm, SecurityAnswerForm, PasswordResetForm
from django.contrib import messages

def forgot_password(request):
    if request.method == 'POST':
        form = ForgotPasswordForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            try:
                user = User.objects.get(username=username)
                profile = UserProfile.objects.get(user=user)
                request.session['reset_user_id'] = user.id
                return redirect('security_question')
            except (User.DoesNotExist, UserProfile.DoesNotExist):
                messages.error(request, 'User not found.')
    else:
        form = ForgotPasswordForm()
    return render(request, 'forgot_password.html', {'form': form})

def security_question(request):
    user_id = request.session.get('reset_user_id')
    if not user_id:
        return redirect('forgot_password')
    user = get_object_or_404(User, id=user_id)
    profile = get_object_or_404(UserProfile, user=user)
    question = profile.security_question
    if request.method == 'POST':
        form = SecurityAnswerForm(request.POST)
        if form.is_valid():
            answer = form.cleaned_data['answer']
            if answer.strip().lower() == profile.security_answer.strip().lower():
                request.session['allow_password_reset'] = True
                return redirect('reset_password')
            else:
                messages.error(request, 'Incorrect answer.')
    else:
        form = SecurityAnswerForm()
    return render(request, 'security_question.html', {'form': form, 'question': question})

def reset_password(request):
    user_id = request.session.get('reset_user_id')
    allow_reset = request.session.get('allow_password_reset')
    if not user_id or not allow_reset:
        return redirect('forgot_password')
    user = get_object_or_404(User, id=user_id)
    if request.method == 'POST':
        form = PasswordResetForm(request.POST)
        if form.is_valid():
            new_password = form.cleaned_data['new_password']
            user.set_password(new_password)
            user.save()
            # Clean up session
            request.session.pop('reset_user_id', None)
            request.session.pop('allow_password_reset', None)
            messages.success(request, 'Password reset successful. You can now log in.')
            return redirect('login')
    else:
        form = PasswordResetForm()
    return render(request, 'reset_password.html', {'form': form})
