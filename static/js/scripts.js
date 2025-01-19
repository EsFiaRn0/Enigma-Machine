// Select all virtual keyboard keys
const keys = document.querySelectorAll('.key');

// Add visual feedback when a key is pressed
function pressKey(keyElement) {
    keyElement.classList.add('active');
    setTimeout(() => keyElement.classList.remove('active'), 200);
}

// Add a letter to the output display (original text)
function appendToOriginalOutput(letter) {
    const outputOriginal = document.getElementById('original-output');
    if (outputOriginal) {
        outputOriginal.textContent += letter;
    } else {
        console.error("Original output element not found");
    }
}

// Add the encrypted letter to the output display (encrypted text)
function appendToEncryptedOutput(encryptedLetter) {
    const outputEncrypted = document.getElementById('encrypted-output');
    if (outputEncrypted) {
        outputEncrypted.textContent += encryptedLetter;
    } else {
        console.error("Encrypted output element not found");
    }
}

// Send the pressed letter to the server
function sendLetterToServer(letter) {
    fetch('/log-key', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ letter: letter }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            const encryptedLetter = data.encrypted_letter;
            console.log(`Encrypted letter: ${encryptedLetter}`);
            appendToEncryptedOutput(encryptedLetter);  
        } else {
            console.error(`Error: ${data.message}`);
        }
    })
    .catch(error => console.error('Request failed:', error));
}

// Handle clicks on virtual keys
keys.forEach(key => {
    key.addEventListener('mousedown', () => {
        const letter = key.textContent.trim();
        pressKey(key); 
        appendToOriginalOutput(letter);
        sendLetterToServer(letter);  
    });
});

// Handle physical keyboard input
document.addEventListener('keydown', (event) => {
    const key = Array.from(keys).find(k => k.textContent.trim() === event.key.toUpperCase());
    if (key) {
        const letter = event.key.toUpperCase(); 
        pressKey(key);
        appendToOriginalOutput(letter);
        sendLetterToServer(letter);  
    }
});

document.querySelectorAll('.rotor-button').forEach(button => {
    button.addEventListener('click', () => {
      const rotorId = button.getAttribute('data-rotor');
      const letterDiv = document.getElementById(`rotor${rotorId}`);
      const currentLetter = letterDiv.textContent;
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let newIndex;
  
      if (button.classList.contains('up')) {
        // Move up
        newIndex = (alphabet.indexOf(currentLetter) + 1) % alphabet.length;
      } else if (button.classList.contains('down')) {
        // Move down
        newIndex = (alphabet.indexOf(currentLetter) - 1 + alphabet.length) % alphabet.length;
      }
  
      letterDiv.textContent = alphabet[newIndex];
    });
  });  
