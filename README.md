# Platful - Your Recipe Collection

Welcome to Platful, a collaborative web project developed by our team to help users discover, collect, and manage their favorite recipes in a visually appealing and user-friendly way.

## Features

- **Recipe Collection**: Browse top recipes and add new favorites to your personal collection.
- **Interactive UI**: Enjoy smooth navigation with animated sliders and favorites management, powered by JavaScript.
- **User Authentication**: Register and log in securely with custom sign-up forms and security questions.
- **Favorites System**: Mark and manage your favorite recipes with interactive heart animations.
- **Responsive Design**: The project uses modern CSS for an aesthetically pleasing and mobile-friendly experience.

## Technologies Used

- **Backend**: Django (Python)
- **Frontend**: HTML5, CSS3 (custom styles), JavaScript (for UI interactivity)
- **Database**: Django ORM (default: SQLite, easily swappable)
- **Other**: Font Awesome for icons, Google Fonts for typography

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/Toxkay/Web-project.git
   cd Web-project
   ```

2. **Install dependencies**

   Make sure you have Python and pip installed.

   ```bash
   pip install -r requirements.txt
   ```

3. **Apply migrations**

   ```bash
   python manage.py migrate
   ```

4. **Run the server**

   ```bash
   python manage.py runserver
   ```

5. **Access the app**

   Open your browser and go to `http://127.0.0.1:8000/`

## Project Structure

- `manage.py` - Django management script
- `core/` - Main Django app (home and about pages)
- `accounts/` - Custom user authentication logic (registration forms, user profiles)
- `static/JS/` - Frontend JavaScript for UI interactivity (sliders, favorites)
- `static/CSS/` - CSS styles for theming and layout
- `templates/` - HTML templates for rendering pages

## Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes
4. Open a pull request

---
