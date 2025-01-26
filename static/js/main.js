import { setupKeyEvents } from './keyHandler.js';
import { setupRotorEvents } from './rotorHandler.js';
import { setupPlugboardEvents, resizeCanvas } from './plugboardHandler.js';
import { setupSaveConfig } from './saveConfig.js';
import { initializeDeleteFunctionality } from './deleteLetter.js';

document.addEventListener('DOMContentLoaded', () => {
    setupKeyEvents();
    setupRotorEvents();
    setupPlugboardEvents();
    setupSaveConfig();

    initializeDeleteFunctionality({
        deleteButtonId: 'delete',         
        originalOutputId: 'original-output',
        encryptedOutputId: 'encrypted-output'
    });

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
});