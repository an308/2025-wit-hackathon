// This is the main function called by the "Analyze" button
function analyzeImage() {
  // Get the URL the user pasted into the input box
  const imageUrl = document.getElementById('imageUrlInput').value;
  const output = document.getElementById('output');
  const loading = document.getElementById('loading');

  // Basic check to see if the user entered anything
  if (imageUrl.trim() === "") {
    output.textContent = "⚠️ Please enter an image URL!";
    return;
  }

  // Show the loading spinner and clear previous results
  loading.style.display = 'block';
  output.textContent = '';

  // Create a new image element in memory (it won't be visible on the page)
  const image = new Image()
  
  // This is CRITICAL for fetching images from other websites (CORS policy)
  image.crossOrigin = "Anonymous";

  // This function will run AFTER the image has successfully loaded
  image.onload = function() {
    // Use the EXIF.js library to read the data from the image
    EXIF.getData(image, function() {
      // Hide the loading spinner
      loading.style.display = 'none';

      // Get all the metadata tags found by the library
      const allTags = EXIF.getAllTags(this);
      
      // Check if the 'allTags' object is empty or not
      if (Object.keys(allTags).length === 0) {
        // If it's empty, no metadata was found
        output.textContent = "Result: 🟡 Metadata Stripped / Not Found.";
      } else {
        // If it has data, metadata is intact!
        output.textContent = "Result: ✅ Metadata Intact.";
        console.log('Found EXIF data:', allTags); // Optional: view data in browser console
      }
    });
  };

  // This function will run if the image fails to load (e.g., bad URL)
  image.onerror = function() {
    loading.style.display = 'none';
    output.textContent = "❌ Error: Could not load the image. Check the URL.";
  };

  // Set the source of the image element to the user's URL, which starts the loading process
  image.src = imageUrl;
}


// --- Dark Mode Function (from your template) ---
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}