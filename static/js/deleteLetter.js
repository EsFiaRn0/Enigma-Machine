import { advanceRotorsDown } from './rotorHandler.js';

function removeLastCharacterFromOutputs(originalOutputId, encryptedOutputId) {
    const originalOutput = document.getElementById(originalOutputId);
    const encryptedOutput = document.getElementById(encryptedOutputId);

    if (originalOutput && originalOutput.textContent ) {
        originalOutput.textContent = originalOutput.textContent.slice(0, -1);
    }

    if (encryptedOutput && encryptedOutput.textContent) {
        encryptedOutput.textContent = encryptedOutput.textContent.slice(0, -1);
        advanceRotorsDown();
    }
}

export function initializeDeleteFunctionality({ deleteButtonId, originalOutputId, encryptedOutputId }) {
    const deleteButton = document.getElementById(deleteButtonId);

    if (deleteButton) {
        deleteButton.addEventListener('click', () => {
            removeLastCharacterFromOutputs(originalOutputId, encryptedOutputId);
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace') {
            event.preventDefault();
            removeLastCharacterFromOutputs(originalOutputId, encryptedOutputId);
        }
    });
}