"use strict";

let localStream;

function e(tagName, attributes, childrens) {
  const element = document.createElement(tagName);

  if (typeof attributes === 'object') {
    Object.keys(attributes).forEach(i => {
      element.setAttribute(i, attributes[i])
    });
  }
  if (typeof childrens === 'string') {
    element.textContent = childrens;
  } else if (childrens instanceof Array) {
    childrens.forEach(child => element
      .appendChild(child));
  }
  return element;
}

function renderCanvasFor(type) {
  return e(
    'div', {class: 'draw ' + type}, [
      e('canvas', {width: 320, height: 320}),
      e('p', {}, 'DblClk to clear; "Enter" to send'),
      e('button', {id: 'send'}, (type === 'login') ? 'Login' : 'Send')
    ]
  );
}

function renderPhotoBooth() {
  return e(
    'div', {class: 'video'}, [
    e('video', {width: 320, height: 240}),
    e('p', {}, 'DblClk to clear; "Enter" to send'),
    e('button', {id: 'send'}, 'Send')
  ])
}

function renderFileInput() {
  return e(
    'div', {class: 'file'}, [
    e('label', {for: 'fileUpload', class: 'placeholder'}, 'DROP image here, or CLICK to select file'),
    e('input', {type: 'file', id: 'fileUpload', accept: 'image/*', hidden: true}),
    e('button', {id: 'send'}, 'Send')
  ])
}

function renderImage(src, size = {width: 300, height: 300}, id) {
  return e('img', {id: id, src: src, width: size.width, height: size.height})
}

function renderMessage(data, id) {
  return fetch(`/users/${data.userID}`)
    .then(data => data.json())
    .then(user => {
      return e('div', {class: (user.id === parseInt(id)) ? 'message-block left' : 'message-block right'}, [
        e('div', {class: 'userpic'}, [
          e('img', {src: user.userpic, width: 80, height: 80})
        ]),
        e('div', {class: 'message'}, [
          e('img', {src: data.pic})
        ])
      ])
    })
    .catch(err => console.log(err));
}

function renderChatUI() {
  return e('div', {class: 'chat'}, [
    e('div', {class: 'sidebar'}, [
      e('div', {class: 'users'}),
      e('div', {class: 'buttons'}, [
        e('button', {}, 'Draw'),
        e('button', {}, 'Photo'),
        e('button', {}, 'File')
      ]),
      e('div', {class: 'inputPlace'})
    ]),
    e('div', {class: 'messages'})
  ])
}

function videoInit() {
  const video = document.querySelector('video');
  navigator.mediaDevices
    .getUserMedia({video: true, audio: false})
    .then(stream => {
      localStream = stream;
      video.srcObject = stream;
      video.play();
    })
}

function onFileInput(event, container) {
  event.preventDefault();
  const reader = new FileReader();
  const imageTypeRegExp = /^image\//;
  const filesFrom = event.dataTransfer || event.target;
  const file = filesFrom.files[0];
  if (imageTypeRegExp.test(file.type)) {
    reader.addEventListener('load', event => {
      let img = new Image();
      img.src = event.target.result;
      img.className = 'fileInput';
      img.id = user.id;
      container.querySelector('.placeholder').innerHTML = '';
      container.querySelector('.placeholder').appendChild(img);
    });
    reader.readAsDataURL(file);
  }
}

const loginCanvas = renderCanvasFor('login');
document.querySelector('.login-block').appendChild(loginCanvas);