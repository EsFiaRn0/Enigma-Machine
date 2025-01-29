import { resetPlugboardState } from './plugboardHandler.js';

export function setupResetButton(resetButtonId) {
    const resetButton = document.getElementById(resetButtonId);
    
    if (!resetButton) {
        console.error(`No se encontró un botón con el ID "${resetButtonId}"`);
        return;
    }

    resetButton.addEventListener('click', () => {
        Swal.fire({
            title: '¿Qué deseas resetear?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Resetear Plugboard',
            denyButtonText: 'Resetear Rotores',
            cancelButtonText: 'Resetear Ambos',
            showDenyButton: true,
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                resetPlugboardState();
                Swal.fire('¡Plugboard reseteado!', '', 'success');
            } else if (result.isDenied) {
                resetRotors();
                Swal.fire('¡Rotores reseteados!', '', 'success');
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                resetPlugboardState();
                resetRotors();
                Swal.fire('¡Plugboard y rotores reseteados!', '', 'success');
            }
        });
    });
}

export function resetRotors() {
    const defaultRotorPosition = 'A';
    const rotorIds = ['rotor1', 'rotor2', 'rotor3'];

    rotorIds.forEach(rotorId => {
        const rotorElement = document.getElementById(rotorId);
        if (rotorElement) {
            rotorElement.textContent = defaultRotorPosition;
        }
    });

    console.log("Rotores reseteados");
}
