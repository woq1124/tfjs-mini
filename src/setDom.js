import { getPredictFromImage } from './lib.js';

function appendPredictResult(predicted, resizedCanvas) {
  const div = document.createElement('div');
  const span = document.createElement('span');

  span.innerText = `Prediction: ${predicted}`;
  div.append(resizedCanvas);
  div.append(span);

  document.querySelector('#result').append(div);
}

export function setDom(model) {
  const canvas = document.querySelector('#myCanvas');
  const ctx = canvas.getContext('2d');
  ctx.lineWidth = 30;
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'black';

  let drawing = false;

  let x = null;
  let y = null;

  const draw = (e) => {
    if (!drawing) return;

    if (x === null) {
      x = e.offsetX;
    }
    if (y === null) {
      y = e.offsetY;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);

    x = e.offsetX;
    y = e.offsetY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  canvas.addEventListener('mousedown', () => {
    drawing = true;
  });
  canvas.addEventListener('mouseup', () => {
    x = null;
    y = null;
    drawing = false;
  });
  canvas.addEventListener('mousemove', draw);

  document.querySelector('#reset').addEventListener('click', (e) => {
    e.preventDefault();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  document.querySelector('#submit').addEventListener('click', async (e) => {
    e.preventDefault();

    const { predicted, resizedCanvas } = await getPredictFromImage(canvas, model);
    appendPredictResult(predicted, resizedCanvas);
  });

  document.querySelector('#imageFile').addEventListener('change', async (e) => {
    e.preventDefault();

    const blobURL = URL.createObjectURL(e.target.files[0]);
    const img = new Image();
    img.src = blobURL;
    img.onload = async function onload() {
      const { predicted, resizedCanvas } = await getPredictFromImage(img, model);
      appendPredictResult(predicted, resizedCanvas);
    };
  });
}
