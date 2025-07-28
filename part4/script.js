/* 
  This is a SAMPLE FILE to get you started.
  Please, follow the project instructions to complete the tasks.
*/

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    getCookie("h");

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
          fetchPlaces(token);
      }
  }

function getCookie(name) {
      // Function to get a cookie value by its name
      let value = document.cookie;
      console.log(value);
  }

function displayError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
    } else {
        alert(message); // fallback
    }
}