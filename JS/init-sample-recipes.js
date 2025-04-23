// Run this script ONCE to initialize localStorage with sample recipes
(function() {
  const sampleRecipes = [
    {
      id: 'rec_lasagna',
      name: 'Lasagna',
      course: 'Main Course',
      image: '/images/Lasagna.jpg',
      duration: '45 mins',
      ingredients: [],
      description: 'Classic Italian lasagna with layers of pasta, cheese, and meat sauce.'
    },
    {
      id: 'rec_chocolate_cake',
      name: 'Chocolate Cake',
      course: 'Dessert',
      image: '/images/ChocolateCake.jpg',
      duration: '65 mins',
      ingredients: [],
      description: 'Rich and moist chocolate cake topped with creamy chocolate frosting.'
    },
    {
      id: 'rec_carbonara',
      name: 'Carbonara',
      course: 'Main Course',
      image: '/images/carbonara.jpg',
      duration: '45 mins',
      ingredients: [],
      description: 'Creamy Italian pasta with pancetta, eggs, and parmesan.'
    },
    {
      id: 'rec_chicken_soup',
      name: 'Chicken Cream Soup',
      course: 'Appetizer',
      image: '/images/ChickenCreamSoup.jpeg',
      duration: '25 mins',
      ingredients: [],
      description: 'Smooth and creamy chicken soup, perfect for a starter.'
    },
    {
      id: 'rec_cheesecake',
      name: 'Cheesecake',
      course: 'Dessert',
      image: '/images/Cheesecake.jpg',
      duration: '45 mins',
      ingredients: [],
      description: 'Classic baked cheesecake with a buttery biscuit base.'
    },
    {
      id: 'rec_bechamel',
      name: 'Bechamel',
      course: 'Main Course',
      image: '/images/bechamel.jpg',
      duration: '60 min',
      ingredients: [],
      description: 'Creamy bechamel pasta bake with ground beef and cheese.'
    },
    {
      id: 'rec_tomato_soup',
      name: 'Tomato Soup',
      course: 'Appetizer',
      image: '/images/tomato.jpeg',
      duration: '15 mins',
      ingredients: [],
      description: 'Fresh tomato soup with herbs and a touch of cream.'
    },
    {
      id: 'rec_fresh_salad',
      name: 'Fresh Salad',
      course: 'Appetizer',
      image: '/images/fresh-salad.jpeg',
      duration: '10 mins',
      ingredients: [],
      description: 'A crisp and refreshing salad with seasonal vegetables.'
    }
  ];
  localStorage.setItem('recipes', JSON.stringify(sampleRecipes));
  // Optionally, remove this script after running once
})();
