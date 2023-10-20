// Wait for the DOM content to load before running the script
document.addEventListener('DOMContentLoaded', function () {
  // Define the base URL for the server
  const baseUrl = 'http://localhost:3000';

  // Get the beer list and beer details elements from the DOM
  const beerList = document.getElementById('beer-list');
  // Remove placeholder list items
  beerList.innerHTML = ""
  const beerDetails = document.querySelector('.beer-details');

  // Initialize the current beer ID
  let currentBeerId = 1;

  // Function to fetch the list of beers from the server
  function fetchBeers() {
    fetch(`${baseUrl}/beers`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Display the list of beers in the sidebar
        displayBeers(data);
        // Fetch and display details of the default beer (ID: 1)
        fetchBeerDetails(currentBeerId);
      })
      .catch(error => console.error('Error:', error));
  }

  // Function to fetch details of a specific beer by ID from the server
  function fetchBeerDetails(id) {
    fetch(`${baseUrl}/beers/${id}`)
      .then(response => response.json())
      .then(data => displayBeerDetails(data))
      .catch(error => console.error('Error:', error));
  }

  // Function to display the list of beers in the sidebar
  function displayBeers(beers) {
    beers.forEach(beer => {
      const li = document.createElement('li');
      li.textContent = beer.name;
      // Add event listener to each beer item to fetch its details on click
      // <li>a</li> 1 
      // <li>b</li> 2
      // <li>c</li> 3
      // <li>d</li> 4
      // <li>e</li> 5
      // <li>f</li> 6
      // <li>g</li> 7
      // <li>h</li> 8
      // <li>i</li> 9
      // <li>j</li> 10
      li.addEventListener('click', () => {
        currentBeerId = beer.id;
        fetchBeerDetails(currentBeerId);
      });
      beerList.appendChild(li);
    });
  }

  // Function to display the details of a specific beer in the main section
  function displayBeerDetails(beer) {
    beerDetails.innerHTML = `
      <h2>${beer.name}</h2>
      <img src="${beer.image_url}" alt="${beer.name}" />
      <p><em>${beer.description}</em></p>

      <form id="description-form">
        <label for="description">Edited Description:</label>
        <textarea id="description"></textarea>
        <button type="submit">Update Beer</button>
      </form>

      <h3>Customer Reviews</h3>
      <ul id="review-list">
        ${beer.reviews.map((review, index) => `<li data-index="${index}">${review}</li>`).join('')}
      </ul>
      <form id="review-form">
        <label for="review">Your Review:</label>
        <textarea id="review"></textarea>
        <button type="submit">Add review</button>
      </form>
    `;

    // Handle the form submission for updating the beer description
    const descriptionForm = document.getElementById('description-form');
    descriptionForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const descriptionInput = document.getElementById('description');
      const newDescription = descriptionInput.value;
      beer.description = newDescription;
      updateBeerDescription(currentBeerId, newDescription);
      displayBeerDetails(beer);
      descriptionInput.value = '';
    });

    // Handle the form submission for adding a new review
    const reviewForm = document.getElementById('review-form');
    reviewForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const reviewInput = document.getElementById('review');
      const newReview = reviewInput.value;
      beer.reviews.push(newReview);
      updateBeerReviews(currentBeerId, beer.reviews);
      displayBeerDetails(beer);
      reviewInput.value = '';
    });

    // Handle the click event to remove a review
    const reviewList = document.getElementById('review-list');
    reviewList.addEventListener('click', function (event) {
      if (event.target.tagName === 'LI') {
        const index = event.target.getAttribute('data-index');
        beer.reviews.splice(index, 1);
        updateBeerReviews(currentBeerId, beer.reviews);
        displayBeerDetails(beer);
      }
    });
  }

  // Function to update the list of reviews for a specific beer on the server
  function updateBeerReviews(id, reviews) {
    fetch(`${baseUrl}/beers/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reviews: reviews })
    })
      .then(response => response.json())
      .then(data => console.log('Updated reviews:', data.reviews))
      .catch(error => console.error('Error:', error));
  }

  // Function to update the description of a specific beer on the server
  function updateBeerDescription(id, description) {
    fetch(`${baseUrl}/beers/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description: description })
    })
      .then(response => response.json())
      .then(data => console.log('Updated description:', data.description))
      .catch(error => console.error('Error:', error));
  }

  // Call the fetchBeers function to initiate the application
  fetchBeers();
});
