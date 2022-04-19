export async function getPredictFromImage(image, model) {
  const resize = document.createElement('canvas');
  resize.width = 28;
  resize.height = 28;

  const resizeContext = resize.getContext('2d');

  resizeContext.drawImage(image, 0, 0, 28, 28);

  const imageData = resizeContext.getImageData(0, 0, 28, 28);

  const imageArray = imageData.data.reduce((acc, cur, i, array) => {
    if (!((i + 1) % 4)) {
      const red = array[i - 3] / 255;
      const green = array[i - 2] / 255;
      const blue = array[i - 1] / 255;
      const alpha = cur / 255;

      const revision = (1 - red) * (1 - blue) * (1 - green);

      if (revision > 0.07) {
        acc.push(alpha);
      } else {
        acc.push(0);
      }
    }
    return acc;
  }, []);

  console.log('imageArray', imageArray.reduce((acc, cur, index) => {
    if (index % 28) {
      return `${acc}${cur ? cur.toFixed(2) : '    '} `;
    }
    return `${acc}${'\r\n'}${cur ? cur.toFixed(2) : '    '} `;
  }, ''));

  const batchImagesArray = new Float32Array(784);
  batchImagesArray.set(imageArray);

  const testData = tf.tensor2d(batchImagesArray, [1, 784]);
  const testxs = testData.reshape([1, 28, 28, 1]);

  const preds = model.predict(testxs).argMax(-1);
  const predictData = await preds.data();

  testxs.dispose();
  preds.dispose();

  return { predicted: predictData[0], resizedCanvas: resize };
}
