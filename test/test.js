let hamming = require('../index.js').hamming;
const huffman = require('../index.js').huffman;

let assert = require('chai').assert;

describe('Hamming code testing', function() {
  it('should correctly encode 4 bits to 7-bit hamming code', function() {
    let input = [1, 0, 1, 1];
    let encoded = hamming.encode(input);
    assert.deepEqual(encoded, [0, 1, 1, 0, 0, 1, 1]);
  });

  it('should correctly decode a valid 7-bit hamming code', function() {
    let encoded = [0, 1, 1, 0, 0, 1, 1];
    let decoded = hamming.decode(encoded);
    assert.deepEqual(decoded, [1, 0, 1, 1]);
  });

  it('should detect no error in a valid code (isValid = true)', function() {
    let encoded = [0, 1, 1, 0, 0, 1, 1];
    let valid = hamming.isValid(encoded);
    assert.isTrue(valid);
  });

  it('should fix a 1-bit error and still decode correctly', function() {
    let input = [1, 0, 1, 1];
    let encoded = hamming.encode(input);
    let corrupted = hamming.injectError(encoded, 3); // introduce error at position 3
    let decoded = hamming.decode(corrupted);
    assert.deepEqual(decoded, input);
  });
});

describe('Huffman Encoding Test', function () {
  it('should correctly encode data', function () {
      const data = "abcd";
      const frequencyTable = huffman.buildFrequencyTable(data);
      const huffmanTree = huffman.buildHuffmanTree(frequencyTable);
      const codeTable = huffman.buildCodeTable(huffmanTree);
      
      // Очікуваний результат кодування для "abcd"
      const expectedCodeTable = {
          'a': '00',
          'b': '01',
          'c': '10',
          'd': '11'
      };

      const encodedData = huffman.compressData(data, codeTable);
      const expectedEncodedData = '00011011'; // відповідний код для "abcd"

      assert.equal(encodedData, expectedEncodedData, `Encoding failed: expected ${expectedEncodedData}, got ${encodedData}`);
  });
  it('should correctly decode data', function () {
    const data = "abcd";
    const frequencyTable = huffman.buildFrequencyTable(data);
    const huffmanTree = huffman.buildHuffmanTree(frequencyTable);
    const codeTable = huffman.buildCodeTable(huffmanTree);

    const encodedData = '00011011'; // це заздалегідь закодовані дані для "abcd"
    const decodedData = huffman.decompressData(encodedData, huffmanTree);

    assert.equal(decodedData, data, `Decoding failed: expected ${data}, got ${decodedData}`);
});
 it('should fail if decompressed data has incomplete bits', function () {
        const data = "aab";
        const frequencyTable = huffman.buildFrequencyTable(data);
        const huffmanTree = huffman.buildHuffmanTree(frequencyTable);
        const codeTable = huffman.buildCodeTable(huffmanTree);

        const encodedData = huffman.compressData(data, codeTable);

        // Модифікуємо кодування для тесту: зробимо його некоректним
        const incorrectEncodedData = encodedData.slice(0, -1);  // Відрізаємо один біт, щоб він був неповним

        // Функція декодування має повертати помилку або неправильний результат
        let decodedData;
        try {
            decodedData = huffman.decompressData(incorrectEncodedData, huffmanTree);
        } catch (e) {
            decodedData = null;  // Очікуємо помилку при декодуванні
        }

        // Очікуємо, що декодування поверне помилку або некоректні дані
        assert.isNull(decodedData, 'Decompression should fail if data has incomplete bits');
    });
});

