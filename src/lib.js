export async function getPredictFromImage(image, model) {
  const resize = document.createElement('canvas');
  resize.width = 28;
  resize.height = 28;

  const resizeContext = resize.getContext('2d');

  resizeContext.drawImage(image, 0, 0, 28, 28);

  const imageData = resizeContext.getImageData(0, 0, 28, 28);

  const imageArray = imageData.data.reduce((acc, cur, i, array) => {
    if (!(i % 4)) {
      const red = cur;
      const green = array[i + 1];
      const blue = array[i + 2];
      const alpha = array[i + 3];

      const lightness = (red + green + blue) / (3 * 255);

      acc.push((1 - lightness) * (alpha / 255));
    }
    return acc;
  }, []);

  const darknessAverage = imageArray.reduce((acc, cur) => acc + cur, 0) / imageArray.length;

  // 표준편차 구해서 그 오차 미만인 데이터는 제거하도록?
  const refined = imageArray.map(
    (value) => (
      Math.abs(value - darknessAverage) >= 0.1
        ? value * (1 + darknessAverage) * (1 + darknessAverage)
        : value * (1 - darknessAverage) * (1 - darknessAverage)),
  );

  console.log('imageArray', refined.reduce((acc, cur, index) => {
    if (index % 28) {
      return `${acc}${cur ? cur.toFixed(2) : '    '} `;
    }
    return `${acc}${'\r\n'}${cur ? cur.toFixed(2) : '    '} `;
  }, ''));

  const batchImagesArray = new Float32Array(784);
  batchImagesArray.set(refined);

  const testData = tf.tensor2d(batchImagesArray, [1, 784]);
  const testxs = testData.reshape([1, 28, 28, 1]);

  const preds = model.predict(testxs).argMax(-1);
  const predictData = await preds.data();

  testxs.dispose();
  preds.dispose();

  return { predicted: predictData[0], resizedCanvas: resize };
}
