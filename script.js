const apiUrl = 'https://fdhi090gwc.execute-api.eu-north-1.amazonaws.com/v1';

// Get references to HTML elements
const imageInput = document.getElementById('imageInput');
const uploadButton = document.getElementById('uploadButton');
const statusMessage = document.getElementById('statusMessage');

// Add a click event listener to the button
uploadButton.addEventListener('click', () => {
    // Check if an image is selected
    if (imageInput.files.length > 0) {
        // Get the selected image file
        const imageFile = imageInput.files[0];

        // Create a FormData object to send the image as binary data
        const formData = new FormData();
        formData.append('image', imageFile);

        // Make a PUT request to the API endpoint
        axios.put(apiUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((response) => {
                statusMessage.textContent = 'Image upload successful!';
                console.log('Response:', response.data);
            })
            .catch((error) => {
                statusMessage.textContent = 'Image upload failed';
                console.error('Image upload failed:', error);
            });
    } else {
        statusMessage.textContent = 'Please select an image to upload.';
    }
});
