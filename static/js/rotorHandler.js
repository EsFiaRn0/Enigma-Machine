export function advanceRotors() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let rotor3 = document.getElementById('rotor3');
    let currentIndex3 = alphabet.indexOf(rotor3.textContent);
    let newIndex3 = (currentIndex3 + 1) % alphabet.length;
    rotor3.textContent = alphabet[newIndex3];

    if (newIndex3 === 0) {
        let rotor2 = document.getElementById('rotor2');
        let currentIndex2 = alphabet.indexOf(rotor2.textContent);
        let newIndex2 = (currentIndex2 + 1) % alphabet.length;
        rotor2.textContent = alphabet[newIndex2];

        if (newIndex2 === 0) {
            let rotor1 = document.getElementById('rotor1');
            let currentIndex1 = alphabet.indexOf(rotor1.textContent);
            let newIndex1 = (currentIndex1 + 1) % alphabet.length;
            rotor1.textContent = alphabet[newIndex1];
        }
    }
}

export function advanceRotorsDown() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let rotor3 = document.getElementById('rotor3');
    let currentIndex3 = alphabet.indexOf(rotor3.textContent);
    let newIndex3 = (currentIndex3 - 1 + alphabet.length) % alphabet.length;
    rotor3.textContent = alphabet[newIndex3];

    if (currentIndex3 === 0) {
        let rotor2 = document.getElementById('rotor2');
        let currentIndex2 = alphabet.indexOf(rotor2.textContent);
        let newIndex2 = (currentIndex2 - 1 + alphabet.length) % alphabet.length;
        rotor2.textContent = alphabet[newIndex2];

        if (currentIndex2 === 0) {
            let rotor1 = document.getElementById('rotor1');
            let currentIndex1 = alphabet.indexOf(rotor1.textContent);
            let newIndex1 = (currentIndex1 - 1 + alphabet.length) % alphabet.length;
            rotor1.textContent = alphabet[newIndex1];
        }
    }
}

export function setupRotorEvents() {
    document.querySelectorAll('.rotor-button').forEach(button => {
        button.addEventListener('click', () => {
            const rotorId = button.getAttribute('data-rotor');
            const letterDiv = document.getElementById(`rotor${rotorId}`);
            const currentLetter = letterDiv.textContent;
            const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            let newIndex;

            if (button.classList.contains('up')) {
                newIndex = (alphabet.indexOf(currentLetter) + 1) % alphabet.length;
            } else if (button.classList.contains('down')) {
                newIndex = (alphabet.indexOf(currentLetter) - 1 + alphabet.length) % alphabet.length;
            }

            letterDiv.textContent = alphabet[newIndex];
        });
    });
}