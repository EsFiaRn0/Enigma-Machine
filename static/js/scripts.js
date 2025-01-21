const keys = document.querySelectorAll('.key');

function pressKey(keyElement) {
    keyElement.classList.add('active');
    setTimeout(() => keyElement.classList.remove('active'), 200);
}

function appendToOriginalOutput(letter) {
    const outputOriginal = document.getElementById('original-output');
    if (outputOriginal) {
        outputOriginal.textContent += letter;
    } else {
        console.error("Original output element not found");
    }
}

function appendToEncryptedOutput(encryptedLetter) {
    const outputEncrypted = document.getElementById('encrypted-output');
    if (outputEncrypted) {
        outputEncrypted.textContent += encryptedLetter;
    } else {
        console.error("Encrypted output element not found");
    }
}

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
  
  function advanceRotors() {
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

function sendLetterToServer(letter) {
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

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("plugboard-canvas");
    const ctx = canvas.getContext("2d");
    const sockets = document.querySelectorAll(".plug-socket");
    const selectedConnections = []; 
    const selectedSockets = new Set();
    let firstSocket = null;

    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;

    sockets.forEach(socket => {
        socket.addEventListener("click", () => {

            if (firstSocket !== null && firstSocket === socket) {
                socket.classList.add("selected-second");
                setTimeout(() => {
                    socket.classList.remove("selected-second");
                }, 500);
                return;
            }

            if (selectedSockets.has(socket)) {
                socket.classList.add("selected-second");
                setTimeout(() => {
                    socket.classList.remove("selected-second");
                }, 500);
                return;
            }

            if (firstSocket === null) {
                firstSocket = socket;
                socket.classList.add("selected-first");
            } else {
                drawConnection(firstSocket, socket);
                selectedSockets.add(firstSocket);
                selectedSockets.add(socket);

                const connection = `${firstSocket.dataset.letter}${socket.dataset.letter}`;
                console.log("Connection created:", connection);
                selectedConnections.push(connection);

                sendPlugboardConnections(selectedConnections);

                resetSocket(firstSocket);
                resetSocket(socket);
                firstSocket = null;
            }
        });

        socket.addEventListener("mouseenter", () => {
            if (!firstSocket || socket !== firstSocket) {
                socket.style.backgroundColor = "#3e8e3e";
            }
        });

        socket.addEventListener("mouseleave", () => {
            if (socket !== firstSocket) {
                socket.style.backgroundColor = "";
            }
        });
    });

    function drawConnection(startSocket, endSocket) {
        const rect = canvas.getBoundingClientRect();
        const start = startSocket.getBoundingClientRect();
        const end = endSocket.getBoundingClientRect();

        const startX = start.left + start.width / 2 - rect.left;
        const startY = start.top + start.height / 2 - rect.top;
        const endX = end.left + end.width / 2 - rect.left;
        const endY = end.top + end.height / 2 - rect.top;

        const cp1X = (startX + endX) / 2;
        const cp1Y = startY - 50;
        const cp2X = (startX + endX) / 2;
        const cp2Y = endY + 50;

        const randomColor1 = getRandomColor();
        const randomColor2 = getRandomColor();
        const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
        gradient.addColorStop(0, randomColor1);
        gradient.addColorStop(1, randomColor2);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 4;
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.stroke();
    }

    function resetSocket(socket) {
        socket.classList.remove("selected-first");
        socket.style.backgroundColor = "";
    }

    function getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function sendPlugboardConnections(connections) {
        console.log("Sending connections to server:", connections);

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
});