"use strict";

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
      e('input', {id: 'draw', type: 'text', hidden: true}),
      e('canvas', {width: 300, height: 300}),
      e('p', {}, 'DblClk to clear; "Enter" to send')
    ]
  );
}

function renderPhotoBooth() {
  return e(video)
}

function renderImage(src, size = {width: 300, height: 300}) {
  return e('img', {src: src, width: size.width, height: size.height})
}

function renderChatUI() {
  return e('div', {class: 'chat'}, [
    e('div', {class: 'sidebar'}, [
      e('div', {class: 'users'}),
      e('div', {class: 'buttons'}, [
        e('button', {}, 'Draw'),
        e('button', {}, 'Video'),
        e('button', {}, 'File')
      ]),
      e('div', {class: 'inputPlace'})
    ]),
    e('div', {class: 'messages'})
  ])
}

function ab2str(buf) {
  return String.fromCodePoint.apply(null, new Uint8Array(buf));
}

const loginCanvas = renderCanvasFor('login');
document.querySelector('.login-block').appendChild(loginCanvas);

function handleButtonClick(event) {
  switch (event.currentTarget.innerText) {
    case 'Draw':
      document.querySelector('.inputPlace').appendChild(renderCanvasFor('message'));
      drawInit();
  }


}

function initButtons() {
  const buttons = document.querySelectorAll('.sidebar button');
  for (let button of buttons) {
    button.addEventListener('click', handleButtonClick);
  }
}