// Get the form element, logger element, and username input element
const loginForm = document.getElementById("login-form");
const logger = document.getElementById("logger");
const usernameInput = document.getElementById("username-input");
const createAccBg = document.getElementById("create-acc-bg");

// Add event listener to the form submission
loginForm.addEventListener("submit", handleLogin);

// Define the handleLogin function
function handleLogin(event)
{
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(loginForm);
    const username = formData.get("username");

    // Make a POST request with the form data
    fetch('https://itsasign.000webhostapp.com/API/createUser.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data =>
        {
            // Handle the response data
            logger.textContent = JSON.stringify(data);

            // Save the response data to a static variable
            window.username = data;

            // Close the create-acc-bg modal
            createAccBg.style.display = "none";
        })
        .catch(error =>
        {
            // Handle any errors
            logger.textContent = 'Error: ' + error.message;
        });

    // Reset the form after submission
    loginForm.reset();
    usernameInput.focus();
}