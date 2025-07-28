/* 
  This is a SAMPLE FILE to get you started.
  Please, follow the project instructions to complete the tasks.
*/

document.addEventListener('DOMContentLoaded', async () => {
    const loginForm = document.getElementById('login-form');
    const token = checkAuthentication();

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
        a.setAttribute('href', 'place.html');
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