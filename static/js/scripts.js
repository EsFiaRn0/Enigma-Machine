const keys = document.querySelectorAll('.key');

function pressKey(keyElement) {
    keyElement.classList.add('active'); 

    setTimeout(() => {
        keyElement.classList.remove('active');
    }, 200);
}

keys.forEach(key => {
    key.addEventListener('mousedown', () => pressKey(key));
});

document.addEventListener('keydown', (event) => {
    const key = Array.from(keys).find(k => k.textContent.trim() === event.key.toUpperCase());

    if (key) {
        pressKey(key);
    }
});
