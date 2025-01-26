import {appendToEncryptedOutput} from './keyHandler.js';
import {advanceRotors} from './rotorHandler.js';

export function sendLetterToServer(letter) {
    const rotor1 = document.getElementById('rotor1').textContent;
    const rotor2 = document.getElementById('rotor2').textContent;
    const rotor3 = document.getElementById('rotor3').textContent;

    fetch('/log-key', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            letter: letter,
            rotor_positions: [rotor1, rotor2, rotor3]
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            const encryptedLetter = data.encrypted_letter;
            appendToEncryptedOutput(encryptedLetter);
        } else {
            console.error(`Error: ${data.message}`);
        }
    })
    .catch(error => console.error('Request failed:', error));

    advanceRotors();
}

export function sendPlugboardConnections(connections) {

    fetch('/update-plugboard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ connections: connections.join(' ') }),
    })
    .then(response => response.json())
    .then(data => {
        console.log("Response from server:", data);
        if (data.status === "success") {
            console.log("Plugboard updated successfully!");
        } else {
            console.error(`Error: ${data.message}`);
        }
    })
    .catch(error => console.error('Request failed:', error));
}