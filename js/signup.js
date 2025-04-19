document.addEventListener("DOMContentLoaded", function() {
    const signupForm = document.getElementById('signupForm');
    const signupError = document.getElementById('signupError');
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    // Toggle password visibility
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    // Form submission
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset error message
            signupError.style.display = 'none';
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const terms = document.getElementById('terms').checked;
            
            // Validate name
            if (!name) {
                showError('Please enter your full name');
                return;
            }
            
            // Validate email
            if (!email) {
                showError('Please enter your email address');
                return;
            }
            
            if (!/^\S+@\S+\.\S+$/.test(email)) {
                showError('Please enter a valid email address');
                return;
            }
            
            // Validate password
            if (!password) {
                showError('Please create a password');
                return;
            }
            
            if (password.length < 8) {
                showError('Password must be at least 8 characters long');
                return;
            }
            
            // Validate terms
            if (!terms) {
                showError('You must agree to the terms and conditions');
                return;
            }
            
            // Check if email already exists
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const emailExists = users.some(user => user.email === email);
            
            if (emailExists) {
                showError('An account with this email already exists');
                return;
            }
            
            // Create new user
            const newUser = {
                name,
                email,
                password,
                createdAt: new Date().toISOString()
            };
            
            // Save user
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Store current user session
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            // Redirect to home page
            window.location.href = 'Home.html';
        });
    }
    
    function showError(message) {
        signupError.textContent = message;
        signupError.style.display = 'block';
        
        // Hide error after 5 seconds
        setTimeout(() => {
            signupError.style.display = 'none';
        }, 5000);
    }
});