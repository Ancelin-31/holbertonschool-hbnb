/* 
  This is a SAMPLE FILE to get you started.
  Please, follow the project instructions to complete the tasks.
*/

document.addEventListener('DOMContentLoaded', () => {
const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            if (!email || !password) {
                displayError("Email and password are required.");
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:3000/part4/index.html', {
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
        });
    }
  });

  function displayError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
    } else {
        alert(message); // fallback
    }
}