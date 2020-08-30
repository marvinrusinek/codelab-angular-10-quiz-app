import { AbstractBinaryParser } from './abstract-parser';
import { BinaryReader, BinaryReaderResult } from '../readers/abstract-reader';
import { resolveFunctionOrvalue, resolveLengthOrdered } from '../utils';

export class BinaryArrayParser extends AbstractBinaryParser {
  type = 'array';

  constructor(private config) {
    super();
  }

  read(
    reader: BinaryReader,
    data: BinaryReaderResult = {}
  ): BinaryReaderResult {
    let len = resolveFunctionOrvalue(this.config.length, data) || Infinity;
    let raw = '';
    const value = [];

    while (len > 0 && reader.hasMore()) {
      const result = this.config.parser.read(reader, data);
      raw += result.raw;
      value.push(result.value);
      len--;
    }

    return { value, raw };
  }

  readOrdered(
    reader: BinaryReader,
    data: BinaryReaderResult = [],
    start = 0
  ): BinaryReaderResult {
    let numberOfElements = resolveLengthOrdered(this.config.length, data);
    if (numberOfElements === undefined) {
      numberOfElements = Infinity;
    }

    let rawValue = '';
    const value = [];

    let len = 0;
    let index = 0;

    while (numberOfElements > 0 && reader.hasMore()) {
      index++;
      const result = this.config.parser.readOrdered(reader, data, start + len);
      rawValue += result.rawValue;

      const length = result.rawValue.length;
      value.push({
        start: start + len,
        end: start + len + length,
        length,
        index,
        type: this.config.parser.type,
        value: result.value,
        rawValue: result.rawValue
      });
      len += length;
      numberOfElements--;
    }

    return {
      name: this.config.name,
      start,
      length: len,
      end: start + len,
      value,
      rawValue,
      type: this.type
    };
  }
}
