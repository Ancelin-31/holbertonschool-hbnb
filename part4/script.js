/* 
  This is a SAMPLE FILE to get you started.
  Please, follow the project instructions to complete the tasks.
*/

document.addEventListener('DOMContentLoaded', async () => {
    const loginForm = document.getElementById('login-form');
    const token = checkAuthentication();
    const placeDetails = document.querySelector('.place-details');
    const placeList = document.querySelector('.place-list');
    const reviewForm = document.querySelector('.review-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            console.log(email, password);

            if (!email || !password) {
                displayError("Email and password are required.");
                return;
            }

            loginUser(email, password);
        }
    )};
    if (placeList) {
        const places = await fetchPlaces(token).then(
            data => { return data }
        );
        displayPlaces(places);
        document.getElementById('price-filter').addEventListener('change', (event) => {
            // Get the selected price value
            // Iterate over the places and show/hide them based on the selected price
            console.log(event.target.value);
            filterPlaces(Number(event.target.value));
        });
    }

    if (placeDetails) {
        const place = await fetchPlacesDetails(token).then(
            data => { return data }
    )
    console.log(place)
    displayPlaceDetails(place);
    displayReviews(place);
  }

    if (reviewForm) {
          reviewForm.addEventListener('submit', async (event) => {
              event.preventDefault();
              // Get review text and rating from form
            const reviewText = document.getElementById('review').value.trim();
            const rating = document.getElementById('rating').value;
            const place_id = getPlaceIDfromURL();
            const reviewData = {
                text: reviewText,
                rating: Number(rating),
                place_id: place_id
            };

              // Make AJAX request to submit review
            try {
                const response = await fetch('http://127.0.0.1:5000/api/v1/reviews/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(reviewData)
                });

                if (response.ok) {
                    alert('Review submitted successfully!');
                    reviewForm.reset();
                } else {
                    const errorData = await response.json();
                    displayError(errorData.message || "Failed to submit review.");
                }
            } catch (error) {
                displayError("Network error. Please try again later.");
                console.error('Review error:', error);
            }
        });
    }
});

async function loginUser(email, password) {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            document.cookie = `token=${data.access_token}; path=/; secure; samesite=strict`;

            window.location.href = 'index.html';
        } else {
            const errorData = await response.json();
            displayError(errorData.message || "Login failed. Please try again.");
        }
    } catch (error) {
        displayError("Network error. Please try again later.");
        console.error('Login error:', error);
    }
};

function checkAuthentication() {
      const token = getCookie('token');
      const loginLink = document.getElementById('login-link');

      if (!token) {
          loginLink.style.display = 'block';
      } else {
          loginLink.style.display = 'none';
          // Fetch places data if the user is authenticated
      }

      return token;
  }

function getCookie(name) {
      // Function to get a cookie value by its name
      let value = decodeURIComponent(document.cookie);
      value =  value.split('=')[1]
      return(value);
  }

function displayError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
    } else {
        alert(message); // fallback
    }
}

async function fetchPlaces(token) {
      // Make a GET request to fetch places data
      const places = document.getElementById('places')
      const response = await fetch('http://127.0.0.1:5000/api/v1/places/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        
        if (response.ok) {
            const data = await response.json();
            return data;

        } else {
            const errorData = await response.json();
            displayError(errorData.message || "Fetch failed. Please try again.");
        }
      // Include the token in the Authorization header
      // Handle the response and pass the data to displayPlaces function
  }

function displayPlaces(places) {
      // Clear the current content of the places list

      // Iterate over the places data
      let places_list = document.querySelector('.place-list');
      let last_element = places_list.lastElementChild;
      while (last_element) {
        places_list.removeChild(last_element);
        last_element = places_list.lastElementChild;
      }

      for (let place_index=0; place_index < places.length; place_index++){
        let div = document.createElement('div');
        div.className = 'place-card';
        div.setAttribute('price', places[place_index].price);

        let h2 = document.createElement('h2');
        h2.textContent = places[place_index].title;
        div.appendChild(h2);
        let p = document.createElement('p');
        p.textContent = `$${places[place_index].price}/night`;
        div.appendChild(p);
        let button = document.createElement('button');
        button.className = 'details-button';
        div.appendChild(button)
        let a = document.createElement('a');
        a.setAttribute('href', `place.html?id=${places[place_index].id}`);
        a.innerHTML = 'View Details';
        button.appendChild(a);


        places_list.appendChild(div);
      }
      // For each place, create a div element and set its content
      // Append the created element to the places list

  }

function filterPlaces(price) {
    let places_list = document.querySelectorAll('.place-card');
    for (i = 0; i < places_list.length; i++) {
        if (places_list[i].getAttribute('price') > price) {
            places_list[i].style.display='none';
        } else {
            places_list[i].style.display='block';
        }
    }
}

async function fetchPlacesDetails(token) {
      // Make a GET request to fetch places data
      const id = getPlaceIDfromURL();
      const places = document.getElementById('places')
      const response = await fetch(`http://127.0.0.1:5000/api/v1/places/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        
        if (response.ok) {
            const data = await response.json();
            return data;

        } else {
            const errorData = await response.json();
            displayError(errorData.message || "Fetch failed. Please try again.");
        }
      // Include the token in the Authorization header
      // Handle the response and pass the data to displayPlaces function
  }

function getPlaceIDfromURL() {
    let placeID = window.location.search;
    placeID = placeID.split('=')[1];
    return(placeID);
}

function displayPlaceDetails(place) {
      // Clear the current content of the places list
      // Iterate over the places data
      let place_details = document.querySelector('.place-details');
      let last_element = place_details.lastElementChild;
      
      while (last_element) {
        place_details.removeChild(last_element);
        last_element = place_details.lastElementChild;
      }

        // For each place, create a div element and set its content
        // Append the created element to the places list

        let h2 = document.createElement('h2');
        h2.textContent = place.title;
        h2.classList.add('place-info');
        place_details.appendChild(h2);
        
        let p1 = document.createElement('p');
        p1.textContent = place.description;
        p1.classList.add('place-info');
        place_details.appendChild(p1);

        let p2 = document.createElement('p');
        p2.textContent = `$${place.price}/night`;
        p2.classList.add('place-info');
        place_details.appendChild(p2);

        let p3 = document.createElement('p');
        p3.textContent = `Latitude: ${place.latitude}`;
        p3.classList.add('place-info');
        place_details.appendChild(p3);

        let p4 = document.createElement('p');
        p4.textContent = `Longitude: ${place.longitude}`;
        p4.classList.add('place-info');
        place_details.appendChild(p4);

        let amenities_list = document.createElement('ul');
        amenities_list.classList.add('place-info');

        for (i = 0; i < place.amenities.length; i++) {
            let li = document.createElement('li');
            li.textContent = place.amenities[i].name;
            amenities_list.appendChild(li);
        }
        place_details.appendChild(amenities_list);
  }

async function displayReviews(place) {
    const reviewsContainer = document.getElementById('reviews-container');
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/v1/places/${place_id}/reviews/`);
            if (response.ok) {
                const reviews = await response.json();
                reviewsContainer.innerHTML = '';
                if (reviews.length === 0) {
                    reviewsContainer.innerHTML = '<p>No reviews yet.</p>';
                } else {
                    reviews.forEach(review => {
                        const reviewDiv = document.createElement('div');
                        reviewDiv.className = 'review';
                        reviewDiv.innerHTML = `
                            <strong>Rating:</strong> ${review.rating} <br>
                            <strong>Review:</strong> ${review.text}
                        `;
                        reviewsContainer.appendChild(reviewDiv);
                    });
                }
            } else {
                reviewsContainer.innerHTML = '<p>Could not load reviews.</p>';
            }
        } catch (error) {
            reviewsContainer.innerHTML = '<p>Error loading reviews.</p>';
            console.error(error);
        }
    };
