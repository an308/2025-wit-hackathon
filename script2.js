// --- General Module Navigation ---

function showModule(moduleId) {
  // Hide all modules and the menu
  document.getElementById('menu').style.display = 'none';
  document.getElementById('learnModule').style.display = 'none';
  document.getElementById('protectModule').style.display = 'none';

  // Show the selected module
  document.getElementById(moduleId).style.display = 'block';

  // If we are showing the protect module, load the log
  if (moduleId === 'protectModule') {
    loadAlibiLog();
  }
}


// --- MODULE 1: Learn to Spot Fakes (The Quiz) ---

const quizData = [
  {
    mediaUrl: "images/trump_fake.png", // Example: Fake Image
    question: "Is this photo of Donald Trump real or a deepfake?",
    answer: "fake",
    explanation: "This is fake! Notice how blurry the faces in the foreground of the second image are, and the inconsistencies of facial features on the people displayed."
  },
  {
    mediaUrl: "images/pentagon_fake.png", // Example: Fake Image
    question: "Is this photo real or a deepfake?",
    answer: "fake",
    explanation: "This is fake! Notice the inconsistencies in the building frontage, and the blurry nature of the fence."
  },
  {
    mediaUrl: "images/real_image.png", // Example: Real Image
    question: "Is this photo real or a deepfake?",
    answer: "real",
    explanation: "This is a real image! Notice how all shapes are precise and proportional, and the foreground is not blurred."
  },
  {
    mediaUrl: "https://www.youtube.com/embed/cQ54GDm1eL0", // Example: Obama Deepfake
    question: "Is this video of Barack Obama real or a deepfake?",
    answer: "fake",
    explanation: "This is a deepfake! Notice the inconsistencies of the mouth movements and the lack of facial feature movement."
  },
  {
    mediaUrl: "https://www.youtube.com/embed/t17O2AKa2FU", // Example: Real interview
    question: "Is this interview with Scott Morrison real or a deepfake?",
    answer: "real",
    explanation: "This is a real video! Notice how movement and facial features look natural, and there is no foreground blurring."
  },
  {
    mediaUrl: "https://www.youtube.com/embed/oxXpB9pSETo", // Example: Morgan Freeman edited
    question: "Is this video of Morgan Freeman real or a deepfake?",
    answer: "fake",
    explanation: "This is fake! Notice how uncanny the deepfake Freeman looks, and the inconsistencies of the hair."
  },
  {
    mediaUrl: "https://www.youtube.com/embed/Ml2BWvQ0nGg", // Example: Joe Biden edited
    question: "Is this video of Joe Biden real or a deepfake?",
    answer: "fake",
    explanation: "This is a very convincing deepfake!"
  }
];

let currentQuestionIndex = 0;

function displayQuestion() {
  if (currentQuestionIndex >= quizData.length) {
    document.getElementById('quiz-content').innerHTML = `<h2>Quiz Complete!</h2><p>You've learned the basics of spotting deepfakes.</p>`;
    document.getElementById('quiz-feedback').innerHTML = '';
    return;
  }
  
  let currentQuestion = quizData[currentQuestionIndex];
  let mediaHtml = '';
  
  if (currentQuestion.mediaUrl.includes('youtube.com') || currentQuestion.mediaUrl.includes('youtu.be')) {
    mediaHtml = `<iframe id="quiz-media" src="${currentQuestion.mediaUrl}" frameborder="0" allowfullscreen class="w-100"></iframe>`;
  } else {
    mediaHtml = `<img id="quiz-media" src="${currentQuestion.mediaUrl}" alt="A photo for the deepfake quiz" class="img-fluid mb-3">`;
  }

  document.getElementById('quiz-feedback').innerHTML = '';
  document.getElementById('quiz-content').innerHTML = `
    <p class="fs-5">${currentQuestion.question}</p>
    ${mediaHtml}
    <div>
      <button class="btn btn-primary mx-2" onclick="checkAnswer('real')">Real</button>
      <button class="btn btn-danger mx-2" onclick="checkAnswer('fake')">Fake</button>
    </div>
  `;
}

function checkAnswer(userAnswer) {
  let correctAnswer = quizData[currentQuestionIndex].answer;
  let feedback = document.getElementById('quiz-feedback');
  
  if (userAnswer === correctAnswer) {
    feedback.innerHTML = `<p class="text-success">Correct! ${quizData[currentQuestionIndex].explanation}</p>`;
  } else {
    feedback.innerHTML = `<p class="text-danger">Incorrect. ${quizData[currentQuestionIndex].explanation}</p>`;
  }
  
  // Move to the next question after a short delay
  currentQuestionIndex++;
  setTimeout(displayQuestion, 4000); // Wait 4 seconds before next question
}

// Start the quiz when the page loads (or when the module is shown)
displayQuestion();


// --- MODULE 2: Protect Your Truth (The AI Alibi) ---

// Helper function to convert the hash buffer to a hex string
function bufferToHex(buffer) {
  return [...new Uint8Array(buffer)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function createAlibi() {
  const alibiButton = document.getElementById('alibi-button');
  alibiButton.disabled = true;
  alibiButton.textContent = 'Generating...';

  // 1. Get Geolocation
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    alibiButton.disabled = false;
    alibiButton.textContent = 'Create My Alibi';
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    
    // 2. Get Timestamp
    const timestamp = new Date().toISOString();
    
    // 3. Combine the data
    const dataToHash = `Timestamp: ${timestamp}, Location: ${lat}, ${lon}`;
    
    // 4. Hash the data using the browser's crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(dataToHash);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashHex = bufferToHex(hashBuffer);
    
    // 5. Save the alibi to Local Storage
    saveAlibi(timestamp, lat, lon, hashHex);
    
    // 6. Reload the log to show the new entry
    loadAlibiLog();

    alibiButton.disabled = false;
    alibiButton.textContent = 'Create My Alibi';

  }, () => {
    alert("Unable to retrieve your location. Please enable location services.");
    alibiButton.disabled = false;
    alibiButton.textContent = 'Create My Alibi';
  });
}

function saveAlibi(timestamp, lat, lon, hash) {
  // Get existing alibis from local storage, or create a new array
  const alibis = JSON.parse(localStorage.getItem('alibiLog')) || [];
  
  // Add the new alibi to the start of the array
  alibis.unshift({ timestamp, lat, lon, hash });
  
  // Save the updated array back to local storage
  localStorage.setItem('alibiLog', JSON.stringify(alibis));
}

/**
 * Re-calculates the hash of an alibi's data to verify its integrity.
 * @param {object} alibi - The alibi object with timestamp, lat, lon, and original hash.
 * @returns {Promise<object>} - A promise that resolves to an object { isVerified: boolean, reason: string }.
 */
async function verifyAlibi(alibi) {
  try {
    // 1. Recreate the exact original data string
    const dataToHash = `Timestamp: ${alibi.timestamp}, Location: ${alibi.lat}, ${alibi.lon}`;

    // 2. Re-hash it using the same SHA-256 algorithm
    const encoder = new TextEncoder();
    const data = encoder.encode(dataToHash);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const currentHash = bufferToHex(hashBuffer); // Assumes you have the bufferToHex function

    // 3. Compare the new hash with the one stored in the log
    if (currentHash === alibi.hash) {
      return { isVerified: true, reason: 'Data is authentic' };
    } else {
      return { isVerified: false, reason: 'Data mismatch. Hash does not verify.' };
    }
  } catch (error) {
    console.error('Error verifying hash:', error);
    return { isVerified: false, reason: 'Verification failed' };
  }
}


// --- Replace your OLD loadAlibiLog function with this NEW one ---

async function loadAlibiLog() {
  const alibis = JSON.parse(localStorage.getItem('alibiLog')) || [];
  const logElement = document.getElementById('alibi-log');
  
  logElement.innerHTML = ''; // Clear the current list
  
  if (alibis.length === 0) {
    logElement.innerHTML = '<li class="list-group-item">Your log is empty. Create your first alibi!</li>';
    return;
  }
  
  // NOTE: You would get this from a user profile. For now, we'll use a placeholder.
  const userPhotoUrl = "https://via.placeholder.com/150"; // A generic placeholder image

  // Use a for...of loop to handle the async verification for each item
  for (const alibi of alibis) {
    // 1. Verify the integrity of each alibi entry
    const verification = await verifyAlibi(alibi);
    
    // 2. Set up the icon and class based on verification status
    const icon = verification.isVerified ? '✅' : '❌';
    const statusClass = verification.isVerified ? 'verified' : 'unverified';

    // 3. Create the new list item element
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'p-0'); // Bootstrap classes for clean slate
    
    // 4. Populate the list item with the new, more complex HTML structure
    listItem.innerHTML = `
      <div class="alibi-entry">
        <img src="${userPhotoUrl}" alt="User Photo" class="alibi-photo">
        
        <div class="alibi-details">
          <p><strong>Date:</strong> ${new Date(alibi.timestamp).toLocaleString()}</p>
          <p><strong>Location:</strong> ${alibi.lat.toFixed(4)}, ${alibi.lon.toFixed(4)}</p>
          <p class="proof-hash"><strong>Proof:</strong> ${alibi.hash.substring(0, 32)}...</p>
        </div>
        
        <div class="alibi-status">
          <div class="status-icon ${statusClass}">${icon}</div>
          <div class="reason-text">${verification.reason}</div>
        </div>
      </div>
    `;
    
    // 5. Append the new card to the log
    logElement.appendChild(listItem);
  }
}