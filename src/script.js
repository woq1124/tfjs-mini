import { MnistData } from './data.js';
import {
  showExamples, getModel, train, showAccuracy, showConfusion,
} from './ml.js';
import { setDom } from './setDom.js';

console.log('Hello TensorFlow');

async function run() {
  const data = new MnistData();
  await data.load();
  await showExamples(data);

  const model = getModel();
  tfvis.show.modelSummary({ name: 'Model Architecture', tab: 'Model' }, model);

  setDom(model);

  await train(model, data);

  await showAccuracy(model, data);
  await showConfusion(model, data);
}

document.addEventListener('DOMContentLoaded', run);
