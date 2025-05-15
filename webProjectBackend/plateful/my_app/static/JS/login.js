document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
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
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset error message
            loginError.style.display = 'none';
            
            // Get form values
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            
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
                showError('Please enter your password');
                return;
            }
            
            // Check if user exists
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email);
            
            if (!user) {
                showError('No account found with this email address');
                return;
            }
            
            // Check password
            if (user.password !== password) {
                showError('Incorrect password');
                return;
            }
            
            // Store current user session
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Redirect to home page
            window.location.href = 'Home.html';
        });
    }
    
    function showError(message) {
        loginError.textContent = message;
        loginError.style.display = 'block';
    }
});