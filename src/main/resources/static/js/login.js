document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const hasError = urlParams.has('error');
    const errorMessageElement = document.getElementById('errorMessage');
    if (hasError) {
        errorMessageElement.style.display = 'block';
    } else {
        errorMessageElement.style.display = 'none';
    }
})
