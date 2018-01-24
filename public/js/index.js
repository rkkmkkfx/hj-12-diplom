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
  return e('div', {class: 'video'}, [
    e('video', {width: 320, height: 240}),
    e('p', {}, 'DblClk to clear; "Enter" to send'),
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
    });
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

const loginCanvas = renderCanvasFor('login');
document.querySelector('.login-block').appendChild(loginCanvas);