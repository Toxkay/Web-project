// Run this script ONCE to initialize localStorage with sample recipes
(function() {
  const sampleRecipes = [
    {
      id: 'rec_lasagna',
      name: 'Lasagna',
      course: 'Main Course',
      image: '/images/Lasagna.jpg',
      duration: '45 mins',
      ingredients: [
        { id: 'ing1', name: 'Lasagna noodles', quantity: '12' },
        { id: 'ing2', name: 'Ground beef', quantity: '500g' },
        { id: 'ing3', name: 'Tomato sauce', quantity: '2 cups' },
        { id: 'ing4', name: 'Ricotta cheese', quantity: '1.5 cups' },
        { id: 'ing5', name: 'Mozzarella cheese', quantity: '2 cups' },
        { id: 'ing6', name: 'Parmesan cheese', quantity: '0.5 cup' }
      ],
      description: 'Classic Italian lasagna with layers of pasta, cheese, and meat sauce.'
    },
    {
      id: 'rec_chocolate_cake',
      name: 'Chocolate Cake',
      course: 'Dessert',
      image: '/images/ChocolateCake.jpg',
      duration: '65 mins',
      ingredients: [
        { id: 'ing1', name: 'Flour', quantity: '1 3/4 cups' },
        { id: 'ing2', name: 'Cocoa powder', quantity: '3/4 cup' },
        { id: 'ing3', name: 'Sugar', quantity: '2 cups' },
        { id: 'ing4', name: 'Eggs', quantity: '2' },
        { id: 'ing5', name: 'Milk', quantity: '1 cup' }
      ],
      description: 'Rich and moist chocolate cake topped with creamy chocolate frosting.'
    },
    {
      id: 'rec_carbonara',
      name: 'Carbonara',
      course: 'Main Course',
      image: '/images/carbonara.jpg',
      duration: '45 mins',
      ingredients: [
        { id: 'ing1', name: 'Spaghetti', quantity: '200g' },
        { id: 'ing2', name: 'Pancetta', quantity: '100g' },
        { id: 'ing3', name: 'Eggs', quantity: '2' },
        { id: 'ing4', name: 'Parmesan cheese', quantity: '1/2 cup' }
      ],
      description: 'Creamy Italian pasta with pancetta, eggs, and parmesan.'
    },
    {
      id: 'rec_chicken_soup',
      name: 'Chicken Cream Soup',
      course: 'Appetizer',
      image: '/images/ChickenCreamSoup.jpeg',
      duration: '25 mins',
      ingredients: [
        { id: 'ing1', name: 'Chicken breast', quantity: '1 pound' },
        { id: 'ing2', name: 'Onion', quantity: '1' },
        { id: 'ing3', name: 'Carrots', quantity: '2' },
        { id: 'ing4', name: 'Celery', quantity: '2 stalks' },
        { id: 'ing5', name: 'Heavy cream', quantity: '1 cup' }
      ],
      description: 'Smooth and creamy chicken soup, perfect for a starter.'
    },
    {
      id: 'rec_cheesecake',
      name: 'Cheesecake',
      course: 'Dessert',
      image: '/images/Cheesecake.jpg',
      duration: '45 mins',
      ingredients: [
        { id: 'ing1', name: 'Cream cheese', quantity: '16 oz' },
        { id: 'ing2', name: 'Sugar', quantity: '3/4 cup' },
        { id: 'ing3', name: 'Eggs', quantity: '2' },
        { id: 'ing4', name: 'Graham cracker crumbs', quantity: '1.5 cups' }
      ],
      description: 'Classic baked cheesecake with a buttery biscuit base.'
    },
    {
      id: 'rec_bechamel',
      name: 'Bechamel',
      course: 'Main Course',
      image: '/images/bechamel.jpg',
      duration: '60 min',
      ingredients: [
        { id: 'ing1', name: 'Butter', quantity: '2 tbsp' },
        { id: 'ing2', name: 'Flour', quantity: '2 tbsp' },
        { id: 'ing3', name: 'Milk', quantity: '2 cups' }
      ],
      description: 'Creamy bechamel pasta bake with ground beef and cheese.'
    },
    {
      id: 'rec_tomato_soup',
      name: 'Tomato Soup',
      course: 'Appetizer',
      image: '/images/tomato.jpeg',
      duration: '15 mins',
      ingredients: [
        { id: 'ing1', name: 'Tomatoes', quantity: '800g' },
        { id: 'ing2', name: 'Onion', quantity: '1' },
        { id: 'ing3', name: 'Garlic', quantity: '2 cloves' },
        { id: 'ing4', name: 'Vegetable broth', quantity: '2 cups' }
      ],
      description: 'Fresh tomato soup with herbs and a touch of cream.'
    },
    {
      id: 'rec_fresh_salad',
      name: 'Fresh Salad',
      course: 'Appetizer',
      image: '/images/fresh-salad.jpeg',
      duration: '10 mins',
      ingredients: [
        { id: 'ing1', name: 'Mixed greens', quantity: '2 cups' },
        { id: 'ing2', name: 'Cucumber', quantity: '1' },
        { id: 'ing3', name: 'Cherry tomatoes', quantity: '1 cup' },
        { id: 'ing4', name: 'Olive oil', quantity: '2 tbsp' }
      ],
      description: 'A crisp and refreshing salad with seasonal vegetables.'
    }
  ];
  localStorage.setItem('recipes', JSON.stringify(sampleRecipes));
  // Optionally, remove this script after running once
})();
