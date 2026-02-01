/* ʕ•́ᴥ•̀ʔっ */
import {sendPlugboardConnections} from './serverCommunication.js';

export const selectedConnections = [];
export const selectedSockets = new Set();
let firstSocket = null;
const canvas = document.getElementById("plugboard-canvas");
const ctx = canvas.getContext("2d");
const sockets = document.querySelectorAll(".plug-socket");

export function resizeCanvas() {
    const { offsetWidth, offsetHeight } = canvas.parentElement;
    const ratio = window.devicePixelRatio || 1;

    canvas.width = offsetWidth * ratio;
    canvas.height = offsetHeight * ratio;
    canvas.style.width = `${offsetWidth}px`;
    canvas.style.height = `${offsetHeight}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
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
    const cp1Y = startY - 45;
    const cp2X = (startX + endX) / 2;
    const cp2Y = endY + 45;
    const cableWidth = Math.max(4, start.width * 0.2);

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#2f2f2f";
    ctx.lineWidth = cableWidth;
    ctx.shadowBlur = 6;
    ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(200, 200, 200, 0.35)";
    ctx.lineWidth = Math.max(2, cableWidth * 0.45);
    ctx.shadowBlur = 0;
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.stroke();
}

function redrawConnections() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    selectedConnections.forEach(({ firstSocket, socket }) => {
        drawConnection(firstSocket, socket);
    });
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