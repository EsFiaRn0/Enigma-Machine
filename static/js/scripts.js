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
            // Mostrar la letra cifrada en el área de salida
            const encryptedLetter = data.encrypted_letter;
            console.log(`Encrypted letter: ${encryptedLetter}`);
            appendToEncryptedOutput(encryptedLetter);  // Mostrar la letra cifrada
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
        appendToOriginalOutput(letter);  // Mostrar la letra presionada (texto original)
        sendLetterToServer(letter);  // Enviar la letra al servidor para cifrarla
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
