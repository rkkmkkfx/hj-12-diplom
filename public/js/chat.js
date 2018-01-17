'use strict'

const connection = new WebSocket('ws://127.0.0.1:1337');

function initApp() {

}

function sendData(event) {
  const drawInput = document.querySelector('canvas');
  const videoInput = document.querySelector('video');

  if (event.code === 'Enter') {
    event.preventDefault();
    if (drawInput) {
      const container = drawInput.parentElement;
      const type = container.classList[container.classList.length - 1];
      const data = JSON.stringify({message: drawInput.toDataURL(), type: type})
      connection.send(data);
      document.querySelector('main').appendChild(renderChatUI());
      document.querySelector('.login-block').style.display = 'none';
    }
  }
}

function handleMessage(event) {
  const message = JSON.parse(event.data);
  const usersBlock = document.querySelector('.chat .users');
  if (message.type === 'user') {
    usersBlock.innerHTML = '';
    for (let user of message.data) {
      usersBlock.appendChild(renderImage(user.userpic, {width: 100, header: 100}));
    }
  }
}

document.addEventListener('keydown', sendData);

connection.addEventListener('open', initApp);
connection.addEventListener('message', handleMessage);
//message.submit.addEventListener('click', (message) => console.log(message));
//message.input.addEventListener('keydown', (message) => console.log(message));
connection.addEventListener('close', (message) => console.log(message));

window.addEventListener('beforeunload', () => {
  connection.close(1000, 'Соединение закрыто');
});