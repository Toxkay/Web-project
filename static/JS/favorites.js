document.addEventListener('DOMContentLoaded', function () {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');

    favoriteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const recipeId = this.dataset.recipeId;
            const isFavorited = this.innerHTML.includes('❤️');
            const url = isFavorited ? `/favorites/remove/${recipeId}/` : `/favorites/add/${recipeId}/`;
            const action = isFavorited ? 'remove' : 'add';

            // Create a temporary heart for animation
            const heartIcon = document.createElement('span');
            heartIcon.className = 'heart-animation';
            heartIcon.innerHTML = isFavorited ? '💔' : '❤️'; // Broken heart for remove, full for add
            
            // Position it over the button
            const buttonRect = this.getBoundingClientRect();
            document.body.appendChild(heartIcon);
            heartIcon.style.position = 'fixed'; // Use fixed to position relative to viewport
            heartIcon.style.left = `${buttonRect.left + buttonRect.width / 2 - heartIcon.offsetWidth / 2}px`;
            heartIcon.style.top = `${buttonRect.top + buttonRect.height / 2 - heartIcon.offsetHeight / 2}px`;
            heartIcon.style.zIndex = '1001'; // Ensure it's above other elements

            fetch(url, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'recipe_id': recipeId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'added' || data.status === 'removed') {
                    // Start animation
                    heartIcon.classList.add('animate', action === 'add' ? 'heart-add' : 'heart-remove');

                    // Update button state after animation starts
                    if (data.status === 'added') {
                        this.innerHTML = '❤️';
                        this.title = 'Remove from favorites';
                    } else {
                        this.innerHTML = '🤍';
                        this.title = 'Add to favorites';
                    }

                    // Remove the heart icon after animation
                    heartIcon.addEventListener('animationend', () => {
                        heartIcon.remove();
                    });

                    // If on favorites page and item is removed, remove the card
                    if (data.status === 'removed' && window.location.pathname.includes('/favorites/')) {
                        const card = this.closest('.recipe-card');
                        if (card) {
                            card.style.transition = 'opacity 0.5s ease';
                            card.style.opacity = '0';
                            setTimeout(() => {
                                card.remove();
                                // Check if no favorites are left
                                const favoritesContainer = document.querySelector('.recipe-container');
                                if (favoritesContainer && favoritesContainer.children.length === 0) {
                                    const noFavoritesMessage = document.querySelector('.container p');
                                    if (noFavoritesMessage && noFavoritesMessage.textContent.includes("You haven't added any recipes")) {
                                        // Already present
                                    } else {
                                        const p = document.createElement('p');
                                        p.textContent = "You haven't added any recipes to your favorites yet.";
                                        p.className = 'no-favorites-message';
                                        document.querySelector('.container').appendChild(p);
                                    }
                                }
                            }, 500);
                        }
                    }
                } else {
                    // Handle errors or other statuses if necessary
                    console.error('Favorite action failed:', data);
                    heartIcon.remove();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                heartIcon.remove();
            });
        });
    });
});
