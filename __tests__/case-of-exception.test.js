const merge = require('../dist/build.common');

const INPUT_DIR = `${__dirname}/input`;
const OUTPUT_DIR = `${__dirname}/output`;

describe('Case of exception', () => {
  test('Should throw an error if the input path is not an Array.', async () => {
    const inputPaths = null;
    const outputPath = `${OUTPUT_DIR}/0.jpg`;
    await expect(merge(inputPaths, outputPath)).rejects.toThrow();
  });

  test('Should throw an error if the input path is an empty array.', async () => {
    const inputPaths = [];
    const outputPath = `${OUTPUT_DIR}/0.jpg`;
    await expect(merge(inputPaths, outputPath)).rejects.toThrow();
  });

  test('Should throw an error if the output path is empty.', async () => {
    const inputPaths = [`${INPUT_DIR}/1.jpg`, `${INPUT_DIR}/2.jpg`, `${INPUT_DIR}/3.jpg`,];
    const outputPath = null;
    await expect(merge(inputPaths, outputPath)).rejects.toThrow();
  });

  test('Should throw an error if the direction option is not "vertical" or "horizontal".', async () => {
    const inputPaths = [`${INPUT_DIR}/1.jpg`, `${INPUT_DIR}/2.jpg`, `${INPUT_DIR}/3.jpg`,];
    const outputPath = `${OUTPUT_DIR}/0.jpg`;
    const direction = 'hoge';
    await expect(merge(inputPaths, outputPath, {direction})).rejects.toThrow();
  });

  test('Should throw an error if the offset option is not a number greater than or equal to 0.', async () => {
    const inputPaths = [`${INPUT_DIR}/1.jpg`, `${INPUT_DIR}/2.jpg`, `${INPUT_DIR}/3.jpg`,];
    const outputPath = `${OUTPUT_DIR}/0.jpg`;
    const offset = -1;
    await expect(merge(inputPaths, outputPath, {offset})).rejects.toThrow();
  });
});