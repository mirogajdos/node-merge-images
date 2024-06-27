const fs = require('fs');
const sizeOf = require('image-size');
const merge = require('../dist/build.common');

const INPUT_DIR = `${__dirname}/input`;
const OUTPUT_DIR = `${__dirname}/output`;

/**
 * Calculate input image dimensions.
 * @param {string[]} filePaths Image path list.
 * @param {number|undefined} options.offsetY Vertical offset.
 * @param {number|undefined} options.offsetX Horizontal offset.
 * @return {{totalWidth: number, totalHeight: number, maxWidth: number, maxHeight: number}} Calculation result of image dimensions.
 */
const sum = (filePaths, options = {}) => {
  options = Object.assign({
    offsetY: 0,
    offsetX: 0,
  }, options);
  const result = filePaths.reduce((result, filePath) => {
    const {width, height} = getDimensions(filePath);
    result.totalWidth += width;
    result.totalHeight += height;
    if (width > result.maxWidth)
      result.maxWidth = width;
    if (height > result.maxHeight)
      result.maxHeight = height;
    return result;
  }, {
    totalWidth: 0,
    totalHeight: 0,
    maxWidth: 0,
    maxHeight: 0,
  });
  if (options.offsetY > 0)
    result.totalHeight += (filePaths.length - 1) * options.offsetY;
  if (options.offsetX > 0)
    result.totalWidth += (filePaths.length - 1) * options.offsetX;
  return result;
}

/**
  * Get the dimensions (pixels) of the image.
  * @param {string} filePath Image file path.
  * @return {{width: number, height: number }|null} Width and height (in pixels) of the image.
  */
const getDimensions = filePath => {
  const {width, height} = sizeOf(filePath);
  if (width == null || height == null)
    return null;
  return {width, height};
}


beforeAll(() => {
  if (fs.existsSync(OUTPUT_DIR))
    fs.rmSync(OUTPUT_DIR, {recursive: true, force: true});
});

describe('Merge images', () => {
  test('Should be merged vertically.', async () => {
    const filePaths = [`${INPUT_DIR}/1.jpg`, `${INPUT_DIR}/2.jpg`, `${INPUT_DIR}/3.jpg`,];
    const outputPath = `${OUTPUT_DIR}/1.jpg`;
    await merge(filePaths, outputPath);
    const {height, width} = getDimensions(outputPath);
    const {totalHeight, maxWidth} = sum(filePaths);
    expect(fs.existsSync(outputPath) && height === totalHeight && width === maxWidth).toBe(true);
  });

  test('If the direction option is "vertical", the merge should be vertical.', async () => {
    const filePaths = [`${INPUT_DIR}/1.jpg`, `${INPUT_DIR}/2.jpg`, `${INPUT_DIR}/3.jpg`,];
    const outputPath = `${OUTPUT_DIR}/2.jpg`;
    await merge(filePaths, outputPath, {direction: 'vertical'});
    const {height, width} = getDimensions(outputPath);
    const {totalHeight, maxWidth} = sum(filePaths);
    expect(fs.existsSync(outputPath) && height === totalHeight && width === maxWidth).toBe(true);
  });

  test('Should merge horizontally.', async () => {
    const filePaths = [`${INPUT_DIR}/1.jpg`, `${INPUT_DIR}/2.jpg`, `${INPUT_DIR}/3.jpg`,];
    const outputPath = `${OUTPUT_DIR}/3.jpg`;
    await merge(filePaths, outputPath, {direction: 'horizontal'});
    const {height, width} = getDimensions(outputPath);
    const {maxHeight, totalWidth} = sum(filePaths);
    expect(fs.existsSync(outputPath) && height === maxHeight && width === totalWidth).toBe(true);
  });

  test('Should merge vertically with 30px spacing.', async () => {
    const filePaths = [`${INPUT_DIR}/1.jpg`, `${INPUT_DIR}/2.jpg`, `${INPUT_DIR}/3.jpg`,];
    const outputPath = `${OUTPUT_DIR}/4.jpg`;
    const offset = 30;
    await merge(filePaths, outputPath, {offset, background: '#000'});
    const {height, width} = getDimensions(outputPath);
    const {totalHeight, maxWidth} = sum(filePaths, {offsetY: offset});
    expect(fs.existsSync(outputPath) && height === totalHeight && width === maxWidth).toBe(true);
  });

  test('Should merge horizontally with 30px spacing.', async () => {
    const filePaths = [`${INPUT_DIR}/1.jpg`, `${INPUT_DIR}/2.jpg`, `${INPUT_DIR}/3.jpg`,];
    const outputPath = `${OUTPUT_DIR}/5.jpg`;
    const offset = 30;
    await merge(filePaths, outputPath, {direction: 'horizontal', offset, background: '#000'});
    const {height, width} = getDimensions(outputPath);
    const {maxHeight, totalWidth} = sum(filePaths, {offsetX: offset});
    expect(fs.existsSync(outputPath) && height === maxHeight && width === totalWidth).toBe(true);
  });

  test('When vertically merging images of different sizes, the width should be adjusted to the image with the largest width.', async () => {
    const filePaths = [`${INPUT_DIR}/1.jpg`, `${INPUT_DIR}/2.jpg`, `${INPUT_DIR}/6.jpg`,];
    const outputPath = `${OUTPUT_DIR}/6.jpg`;
    await merge(filePaths, outputPath, {background: '#000'});
    const {height, width} = getDimensions(outputPath);
    const {totalHeight, maxWidth} = sum(filePaths);
    expect(fs.existsSync(outputPath) && height === totalHeight && width === maxWidth).toBe(true);
  });

  test('When horizontally merging images of different sizes, the height should be adjusted to the image with the largest height.', async () => {
    const filePaths = [`${INPUT_DIR}/1.jpg`, `${INPUT_DIR}/2.jpg`, `${INPUT_DIR}/5.jpg`,];
    const outputPath = `${OUTPUT_DIR}/7.jpg`;
    await merge(filePaths, outputPath, {direction: 'horizontal', background: '#000'});
    const {height, width} = getDimensions(outputPath);
    const {maxHeight, totalWidth} = sum(filePaths);
    expect(fs.existsSync(outputPath) && height === maxHeight && width === totalWidth).toBe(true);
  });
});