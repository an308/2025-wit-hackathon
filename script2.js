// --- General Module Navigation ---
function showModule(moduleId) {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('learnModule').style.display = 'none';
    document.getElementById('protectModule').style.display = 'none';

    document.getElementById(moduleId).style.display = 'block';

    if (moduleId === 'protectModule') {
        loadAlibiLog();
    }
}

// --- MODULE 1: Deefake Detectives ---
const quizData = [
    {
        mediaUrl: "images/trump_fake.png",
        question: "Is this photo real or a deepfake?",
        answer: "fake",
        explanation: "This is fake! Notice how blurry the faces in the foreground of the second image are, and the inconsistencies of facial features on the people displayed.",
        customClass: "image-1"
    },
    {
        mediaUrl: "images/pentagon_fake.png",
        question: "Is this photo real or a deepfake?",
        answer: "fake",
        explanation: "This is fake! Notice the inconsistencies in the building frontage, and the blurry nature of the fence.",
        customClass: "image-2"
    },
    {
        mediaUrl: "images/real_image.png",
        question: "Is this photo real or a deepfake?",
        answer: "real",
        explanation: "This is a real image! Notice how all shapes are precise and proportional, and the foreground is not blurred.",
        customClass: "image-3"
    },
    {
        mediaUrl: "https://www.youtube.com/embed/cQ54GDm1eL0",
        question: "Is this video of Barack Obama real or a deepfake?",
        answer: "fake",
        explanation: "This is a deepfake! Notice the inconsistencies of the mouth movements and the lack of facial feature movement."
    },
    {
        mediaUrl: "https://www.youtube.com/embed/t17O2AKa2FU",
        question: "Is this interview with Scott Morrison real or a deepfake?",
        answer: "real",
        explanation: "This is a real video! Notice how movement and facial features look natural, and there is no foreground blurring."
    },
    {
        mediaUrl: "https://www.youtube.com/embed/oxXpB9pSETo",
        question: "Is this video of Morgan Freeman real or a deepfake?",
        answer: "fake",
        explanation: "This is fake! Notice how uncanny the deepfake Freeman looks, and the inconsistencies of the hair."
    },
    {
        mediaUrl: "https://www.youtube.com/embed/Ml2BWvQ0nGg",
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

    // Get the custom class for the image, or use an empty string if it's not defined
    const customClass = currentQuestion.customClass || '';

    if (currentQuestion.mediaUrl.includes('youtube.com') || currentQuestion.mediaUrl.includes('youtu.be')) {
    // VIDEOS get wrapped in the video-container
    mediaHtml = `
        <div class="video-container">
        <iframe src="${currentQuestion.mediaUrl}" frameborder="0" allowfullscreen></iframe>
        </div>
    `;
    } else {
    // IMAGES get the id="quiz-media"
    mediaHtml = `<img id="quiz-media" src="${currentQuestion.mediaUrl}" alt="Quiz media" class="${customClass}">`;
    }
    
      // Disable buttons if at the start or end of the quiz
      const isFirstQuestion = currentQuestionIndex === 0;
      const isLastQuestion = currentQuestionIndex === quizData.length - 1;
    
      document.getElementById('quiz-feedback').innerHTML = '';
      document.getElementById('quiz-content').innerHTML = `
        <p class="fs-5">${currentQuestion.question}</p>
        
        <div class="quiz-media-container">
          <button class="nav-button" onclick="previousQuestion()" ${isFirstQuestion ? 'disabled' : ''}>&#8249;</button>
          <div class="media-wrapper">
            ${mediaHtml}
          </div>
          <button class="nav-button" onclick="nextQuestion()" ${isLastQuestion ? 'disabled' : ''}>&#8250;</button>
        </div>
    
        <div class="answer-buttons">
          <button class="btn btn-real mx-2" onclick="checkAnswer('real')">Real</button>
          <button class="btn btn-fake mx-2" onclick="checkAnswer('fake')">Fake</button>
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
}

// Start the quiz when the page loads (or when the module is shown)
displayQuestion();

// --- MODULE 2: Alibi Generator ---

// Helper function to convert the hash buffer to a hex string
function bufferToHex(buffer) {
    return [...new Uint8Array(buffer)]
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Function to save the alibi to local storage
function saveAlibi(timestamp, lat, lon, proofHash, imageHash, imageId, metadata) {
    const alibis = JSON.parse(localStorage.getItem('alibiLog')) || [];
    alibis.unshift({ timestamp, lat, lon, proofHash, imageHash, imageId, metadata });
    localStorage.setItem('alibiLog', JSON.stringify(alibis));
}

// Function to save an image to IndexedDB
function saveImageToDb(imageFile) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("AlibiDB", 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore("images", { keyPath: "id" });
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["images"], "readwrite");
            const store = transaction.objectStore("images");
            
            const imageId = `image-${Date.now()}`;
            const addRequest = store.add({ id: imageId, data: imageFile });

            addRequest.onsuccess = () => resolve(imageId);
            addRequest.onerror = (e) => reject(`Error saving image to DB: ${e.target.error}`);
        };

        request.onerror = (e) => reject(`Error opening IndexedDB: ${e.target.error}`);
    });
}

// Function to retrieve an image from IndexedDB
function getImageFromDb(imageId) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("AlibiDB", 1);

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["images"]);
            const store = transaction.objectStore("images");
            const getRequest = store.get(imageId);

            getRequest.onsuccess = () => {
                if (getRequest.result) {
                    const fileReader = new FileReader();
                    fileReader.onload = () => resolve(fileReader.result);
                    fileReader.readAsDataURL(getRequest.result.data);
                } else {
                    resolve(null);
                }
            };
            getRequest.onerror = (e) => reject(`Error retrieving image from DB: ${e.target.error}`);
        };

        request.onerror = (e) => reject(`Error opening IndexedDB: ${e.target.error}`);
    });
}

// Function to verify the integrity of an alibi entry
async function verifyAlibi(alibi) {
    if (alibi.proofHash === null) {
        return {
            isVerified: false,
            reason: "Origin Unverified"
        };
    }

    const metadataString = JSON.stringify(alibi.metadata);
    const dataToHash = `ImageHash: ${alibi.imageHash}, Timestamp: ${alibi.timestamp}, Location: ${alibi.lat}, ${alibi.lon}, Metadata: ${metadataString}`;

    const encoder = new TextEncoder();
    const data = encoder.encode(dataToHash);
    const proofHashBuffer = await crypto.subtle.digest('SHA-256', data);
    const rehashedProofHash = bufferToHex(proofHashBuffer);

    const isVerified = (rehashedProofHash === alibi.proofHash);

    let reason = isVerified ? "Image is Valid" : "Data Tampered";

    return {
        isVerified: isVerified,
        reason: reason
    };
}

function copyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Make the textarea non-visible but accessible to the user's browser
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            console.log("copied to clipboard!");
        } else {
            console.error('Copying text command was unsuccessful.');
        }
    } catch (err) {
        console.error('copy failed: ', err);
    }
    
    document.body.removeChild(textArea);
}

// Function to load and display the alibi log
async function loadAlibiLog() {
    const alibis = JSON.parse(localStorage.getItem('alibiLog')) || [];
    const logElement = document.getElementById('alibi-log');
    logElement.innerHTML = '';

    if (alibis.length === 0) {
        logElement.innerHTML = '<li class="list-group-item">Your log is empty. Create your first alibi!</li>';
        return;
    }

    for (const alibi of alibis) {
        const verification = await verifyAlibi(alibi);
    
        const icon = verification.isVerified ? '✅' : '❌';
        const statusClass = verification.isVerified ? 'verified' : 'unverified';

        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'p-0');
        
        const imageUrl = await getImageFromDb(alibi.imageId) || "https://via.placeholder.com/150";
        
        let detailsContent;
        if (verification.isVerified) {
            // Updated code to build the full HTML string for the details section
            const proofHashDisplay = alibi.proofHash ? `
                <div class="proof-hash-container">
                    <p class="proof-hash"><strong>Key:</strong> ${alibi.proofHash.substring(0, 16)}...</p>
                    <button class="copy-button">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            ` : '';

            detailsContent = `
                <div class="alibi-details-content">
                    <p><strong>Date:</strong> ${new Date(alibi.timestamp).toLocaleString()}</p>
                    <p><strong>Location:</strong> ${alibi.lat.toFixed(4)}, ${alibi.lon.toFixed(4)}</p>
                    ${proofHashDisplay}
                </div>
            `;
        } else {
            detailsContent = `<p class="text-danger">Authentication Failed: No Metadata Found</p>`;
        }

        listItem.innerHTML = `
            <div class="alibi-entry">
                <img src="${imageUrl}" alt="User Photo" class="alibi-photo">
                
                <div class="alibi-details">
                    ${detailsContent}
                </div>
                
                <div class="alibi-status">
                    <div class="status-icon ${statusClass}">${icon}</div>
                    <div class="reason-text">${verification.reason}</div>
                </div>
            </div>
        `;
    
        logElement.appendChild(listItem);

        // Find the copy button within the newly added list item and attach the event listener
        const copyButton = listItem.querySelector('.copy-button');
        if (copyButton) {
            copyButton.addEventListener('click', () => {
                copyToClipboard(alibi.proofHash);
            });
        }
    }
}

// Main function to create the alibi
async function createAlibi(imageFile) {
    const alibiButton = document.getElementById('alibi-button');
    alibiButton.disabled = true;
    alibiButton.textContent = 'Generating...';

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        alibiButton.disabled = false;
        alibiButton.textContent = 'Authenticate File';
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const timestamp = new Date().toISOString();

        try {
            const [imageId, imageHashBuffer, metadata] = await Promise.all([
                saveImageToDb(imageFile),
                crypto.subtle.digest('SHA-256', await imageFile.arrayBuffer()),
                new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const img = new Image();
                        img.src = event.target.result;
                        img.onload = () => EXIF.getData(img, () => resolve(EXIF.getAllTags(img)));
                        img.onerror = () => resolve({});
                    };
                    reader.onerror = () => resolve({});
                    reader.readAsDataURL(imageFile);
                })
            ]);
            
            const imageHashHex = bufferToHex(imageHashBuffer);
            
            let proofHashHex;
            
            if (!metadata || Object.keys(metadata).length === 0) {
                alert("No metadata found. This file cannot be authenticated and will be logged as unverified.");
                proofHashHex = null;
            } else {
                const metadataString = JSON.stringify(metadata);
                const dataToHash = `ImageHash: ${imageHashHex}, Timestamp: ${timestamp}, Location: ${lat}, ${lon}, Metadata: ${metadataString}`;

                const encoder = new TextEncoder();
                const data = encoder.encode(dataToHash);
                const proofHashBuffer = await crypto.subtle.digest('SHA-256', data);
                proofHashHex = bufferToHex(proofHashBuffer);
            }

            saveAlibi(timestamp, lat, lon, proofHashHex, imageHashHex, imageId, metadata);

            loadAlibiLog();

        } catch (error) {
            console.error("Error creating authenticated capture:", error);
            alert("An error occurred during the process.");
        } finally {
            alibiButton.disabled = false;
            alibiButton.textContent = 'Authenticate File';
        }

    }, () => {
        alert("Unable to retrieve your location. Please enable location services.");
        alibiButton.disabled = false;
        alibiButton.textContent = 'Authenticate File';
    });
}

// A global variable to hold the selected file temporarily
let selectedFile = null;

// --- Event Listeners and Initializers (Bottom of file) ---

// Attach a 'change' listener to the file input to get the selected file
document.getElementById('image-upload').addEventListener('change', (e) => {
    // Get the file from the event
    selectedFile = e.target.files[0];
    
    // You can provide visual feedback here, e.g., enable the button
    const authButton = document.getElementById('alibi-button');
    if (selectedFile) {
        authButton.textContent = `Authenticate File`;
        authButton.disabled = false;
    } else {
        authButton.textContent = 'Authenticate File';
        authButton.disabled = true;
    }
});

// Attach a 'click' listener to the Authenticate button
document.getElementById('alibi-button').addEventListener('click', () => {
    if (selectedFile) {
        // Start the verification process with the selected file
        createAlibi(selectedFile);
    } else {
        alert('Please select a file first.');
    }
});

// for the navigation of the quiz questions
function nextQuestion() {
  // Go to the next question if we're not at the end of the quiz
  if (currentQuestionIndex < quizData.length - 1) {
    currentQuestionIndex++;
    displayQuestion();
  }
}

function previousQuestion() {
  // Go to the previous question if we're not at the beginning
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion();
  }
}