'use strict';

let user;
const connection = new WebSocket('wss://hj12-diplom-socket.herokuapp.com/');

function handleButtonClick(event) {
  let sendBtn;
  switch (event.currentTarget.innerText) {
    case 'Draw':
      document.querySelector('.inputPlace').innerHTML = null;
      document.querySelector('.inputPlace').appendChild(renderCanvasFor('message'));
      sendBtn = document.getElementById('send');
      sendBtn.addEventListener('click', sendData);
      drawInit(user.color);
      break;
    case 'Photo':
      document.querySelector('.inputPlace').innerHTML = null;
      document.querySelector('.inputPlace').appendChild(renderPhotoBooth());
      sendBtn = document.getElementById('send');
      sendBtn.addEventListener('click', sendData);
      videoInit();
      break;
    case 'File':
      document.querySelector('.inputPlace').innerHTML = null;
      const container = renderFileInput();
      container.addEventListener('drop', e => onFileInput(e, container));
      document.querySelector('.inputPlace').appendChild(container);
      container.addEventListener('dragover', event => event.preventDefault());
      document.getElementById('fileUpload').addEventListener('change', e => onFileInput(e, container));
      sendBtn = document.getElementById('send');
      sendBtn.addEventListener('click', sendData);
      break;
  }


}

function initButtons() {
  const buttons = document.querySelectorAll('.sidebar button');
  for (let button of buttons) {
    button.addEventListener('click', handleButtonClick);
  }
}

function sendData(event) {
  if ((event.code === 'Enter') || (event.type === 'click')) {
    const drawInput = document.querySelector('canvas');
    const videoInput = document.querySelector('video');
    const fileInput = document.querySelector('.fileInput');
    let data;

    if (drawInput) {
      const container = drawInput.parentElement;
      const type = container.classList[container.classList.length - 1];
      if (event.currentTarget.src) {
        data = JSON.stringify({pic: event.currentTarget.src, type: type, userID: event.currentTarget.id});
      } else {
        data = JSON.stringify({pic: drawInput.toDataURL(), type: type, userID: (user) ? user.id : null});
      }
      if (type === 'message') {
        fetch('/messages', {
          method: 'post',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: data
        })
      }
      connection.send(data);
      container.remove();
      let loginBlock = document.querySelector('.login-block');
      if (loginBlock) {
        loginBlock.remove();
        document.querySelector('main').appendChild(renderChatUI());
        fetch('/messages')
          .then(data => data.json())
          .then(messages => {
            const chat = document.querySelector('.chat .messages');
            for (let message of messages) {
              renderMessage(message, user.id)
                .then(el => chat.appendChild(el));
            }
            window.scrollTo(0,document.body.scrollHeight);
          })
      }
    } else if (videoInput) {
      const container = videoInput.parentElement;
      let tmp = document.createElement('canvas');
      tmp.width = videoInput.width;
      tmp.height = videoInput.height;
      tmp.getContext('2d').drawImage(videoInput, 0, 0, tmp.width, tmp.height);
      data = JSON.stringify({pic: tmp.toDataURL(), type: 'message', userID: (user) ? user.id : null});
      connection.send(data);
      container.remove();
      let track = localStream.getTracks()[0];
      track.stop();
    } else if (fileInput) {
      const container = fileInput.parentElement;
      data = JSON.stringify({pic: fileInput.src, type: 'message', userID: (user) ? user.id : null});
      fetch('/messages', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: data
      });
      connection.send(data);
      container.parentElement.remove();
    }
  }
}

function handleMessage(event) {
  const message = JSON.parse(event.data);
  const usersBlock = document.querySelector('.chat .users');
  const messages = document.querySelector('.chat .messages');
  if (message.type === 'user') {
    user = message;
    fetch('/users', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
      .then()
      .catch(err => console.log('Err',err));
  } else if (message.type === 'users') {
    if (usersBlock) {
      usersBlock.innerHTML = '';
      for (let user of message.data) {
        usersBlock.appendChild(renderImage(user.userpic, {width: 100, height: 100}, user.id));
      }
      initButtons();
    }
  } else if (message.type === 'message') {
    renderMessage(message.data, user.id)
      .then(el => {
        messages.appendChild(el);
        window.scrollTo(0,document.body.scrollHeight);
      });
  }
}

const sendBtn = document.getElementById('send');
sendBtn.addEventListener('click', sendData);
document.addEventListener('keydown', sendData);

connection.addEventListener('open', () => {
  fetch('/users')
    .then(data => data.json())
    .then(users => {
      let loginBlock = document.querySelector('.login-block');
      if (users.length > 0) {
        loginBlock.appendChild(e('h3', {class: 'center'}, 'Recent users'));
        for (let user of users) {
          loginBlock.appendChild(renderImage(user.userpic, {width: 100, height: 100}, user.id))
        }
        loginBlock.querySelectorAll('img').forEach(item => {
          item.addEventListener('click', sendData);
        });
      }
    });
});
connection.addEventListener('message', handleMessage);
//message.submit.addEventListener('click', (message) => console.log(message));
//message.input.addEventListener('keydown', (message) => console.log(message));
connection.addEventListener('close', () => {});

window.addEventListener('beforeunload', () => {
  connection.send(JSON.stringify({index: user.id, type: 'close'}));
  connection.close(1000, 'Соединение закрыто');
});