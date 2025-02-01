/* ʕ•́ᴥ•̀ʔっ */
import {sendPlugboardConnections} from './serverCommunication.js';

export const selectedConnections = [];
export const selectedSockets = new Set();
let firstSocket = null;
const canvas = document.getElementById("plugboard-canvas");
const ctx = canvas.getContext("2d");
const sockets = document.querySelectorAll(".plug-socket");

export function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    redrawConnections(); 
}

export function drawConnection(startSocket, endSocket) {
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

function redrawConnections() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    selectedConnections.forEach(({ firstSocket, socket }) => {
        drawConnection(firstSocket, socket);
    });
}

export function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export function setupPlugboardEvents() {
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
                const connection = `${firstSocket.dataset.letter}${socket.dataset.letter}`;
                drawConnection(firstSocket, socket, connection);
                selectedSockets.add(firstSocket);
                selectedSockets.add(socket);

                console.log("Connection created:", connection);
                selectedConnections.push({ connection, firstSocket, socket });

                sendPlugboardConnections(selectedConnections.map(c => c.connection));

                resetSocket(firstSocket);
                resetSocket(socket);
                firstSocket = null;
            }
        });
    });
}

export function resetSocket(socket) {
    socket.classList.remove("selected-first");
    socket.style.backgroundColor = "";
}

export function resetPlugboardState() {
    selectedConnections.length = 0;
    selectedSockets.clear();
    firstSocket = null; 

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sockets.forEach(socket => {
        resetSocket(socket);
    });

    sendPlugboardConnections([]); 

    console.log("Plugboard completamente reseteado.");
}