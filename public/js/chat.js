'use strict'

const connection = new WebSocket('ws://127.0.0.1:1337');

function sendData(event) {
  const drawInput = document.querySelector('canvas');
  const videoInput = document.querySelector('video');

  if (event.code === 'Enter') {
    event.preventDefault();
    if (drawInput) {
      const container = drawInput.parentElement;
      const type = container.classList[container.classList.length - 1];
      const data = JSON.stringify({message: drawInput.toDataURL(), type: type});
      connection.send(data);
      container.remove();
      const loginBlock = document.querySelector('.login-block');
      if (loginBlock) {
        loginBlock.remove();
        document.querySelector('main').appendChild(renderChatUI());
      }
    }
  }
}

HTMLCanvasElement.prototype.renderImage = function(blob){

  let ctx = this.getContext('2d');
  let img = new Image();

  img.onload = function(){
    ctx.drawImage(img, 0, 0)
  }

  img.src = URL.createObjectURL(blob);
  return img;
};

function handleMessage(event) {
  if (event.data instanceof Blob) {
    const tmp_canvas = document.createElement('canvas');
    const img = tmp_canvas.renderImage(event.data);
    console.log(img);
    document.querySelector('.chat .messages').appendChild(img);
  } else {
    const message = JSON.parse(event.data);
    const usersBlock = document.querySelector('.chat .users');
    const messages = document.querySelector('.chat .messages');
    if (message.type === 'user') {
      if (usersBlock) {
        usersBlock.innerHTML = '';
        for (let user of message.data) {
          usersBlock.appendChild(renderImage(user.userpic, {width: 100, height: 100}));
        }
        initButtons();
      }
    } else if (message.type === 'message') {
      messages.innerHTML = '';
      for (let item of message.data) {
        messages.appendChild(renderImage(item));
      }
    }
  }
}

document.addEventListener('keydown', sendData);

connection.addEventListener('open', () => console.log('Connect'));
connection.addEventListener('message', handleMessage);
//message.submit.addEventListener('click', (message) => console.log(message));
//message.input.addEventListener('keydown', (message) => console.log(message));
connection.addEventListener('close', (message) => console.log(message));

window.addEventListener('beforeunload', () => {
  connection.close(1000, 'Соединение закрыто');
});