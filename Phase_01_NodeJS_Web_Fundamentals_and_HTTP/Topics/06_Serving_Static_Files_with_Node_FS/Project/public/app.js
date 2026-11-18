console.log('[CLIENT JS] app.js successfully loaded and executed by the browser!');
const msgElem = document.getElementById('msg');
if (msgElem) {
  msgElem.textContent = 'Client JavaScript loaded successfully via static stream!';
}
