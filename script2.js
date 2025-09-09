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
    videoUrl: "https://www.youtube.com/embed/cQ54GDm1eL0", // Example: Obama Deepfake
    question: "Is this video of Barack Obama real or a deepfake?",
    answer: "fake",
    explanation: "This is a deepfake! Notice the slightly unnatural mouth movements that don't perfectly sync."
  },
  {
    videoUrl: "https://www.youtube.com/embed/t5-bDb_gH54", // Example: Real interview
    question: "Is this interview with Keanu Reeves real or a deepfake?",
    answer: "real",
    explanation: "This is a real video. The lighting, expressions, and audio are all consistent and natural."
  },
  {
    videoUrl: "https://www.youtube.com/embed/G40I6b5t4sM", // Example: Tom Cruise Deepfake
    question: "Is this video of Tom Cruise real or a deepfake?",
    answer: "fake",
    explanation: "This is a very convincing deepfake! The technology is getting dangerously good."
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
  
  document.getElementById('quiz-feedback').innerHTML = '';
  document.getElementById('quiz-content').innerHTML = `
    <p class="fs-5">${currentQuestion.question}</p>
    <iframe id="quiz-video" src="${currentQuestion.videoUrl}" frameborder="0" allowfullscreen></iframe>
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

function loadAlibiLog() {
  const alibis = JSON.parse(localStorage.getItem('alibiLog')) || [];
  const logElement = document.getElementById('alibi-log');
  
  logElement.innerHTML = ''; // Clear the current list
  
  if (alibis.length === 0) {
    logElement.innerHTML = '<li class="list-group-item">Your log is empty. Create your first alibi!</li>';
    return;
  }
  
  alibis.forEach(alibi => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.innerHTML = `
      <strong>Date:</strong> ${new Date(alibi.timestamp).toLocaleString()} <br>
      <strong>Location:</strong> ${alibi.lat.toFixed(4)}, ${alibi.lon.toFixed(4)} <br>
      <small class="text-muted"><strong>Proof Hash:</strong> ${alibi.hash.substring(0, 32)}...</small>
    `;
    logElement.appendChild(listItem);
  });
}
