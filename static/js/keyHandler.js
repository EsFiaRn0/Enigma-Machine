import { sendLetterToServer } from './serverCommunication.js';

export function pressKey(keyElement) {
    keyElement.classList.add('active');
    setTimeout(() => keyElement.classList.remove('active'), 200);
}

export function appendToOriginalOutput(letter) {
    const outputOriginal = document.getElementById('original-output');
    if (outputOriginal) {
        outputOriginal.textContent += letter;
    } else {
        console.error("Original output element not found");
    }
}

export function appendToEncryptedOutput(encryptedLetter) {
    const outputEncrypted = document.getElementById('encrypted-output');
    if (outputEncrypted) {
        outputEncrypted.textContent += encryptedLetter;
    } else {
        console.error("Encrypted output element not found");
    }
}

export function setupKeyEvents() {
    const keys = document.querySelectorAll('.key');
    
    keys.forEach(key => {
        key.addEventListener('mousedown', () => {
            const letter = key.textContent.trim();
            pressKey(key); 
            appendToOriginalOutput(letter);
            sendLetterToServer(letter);
        });
    });

    document.addEventListener('keydown', (event) => {
        const key = Array.from(keys).find(k => k.textContent.trim() === event.key.toUpperCase());
        if (key) {
            const letter = event.key.toUpperCase(); 
            pressKey(key);
            appendToOriginalOutput(letter);
            sendLetterToServer(letter); 
        }
    });
}