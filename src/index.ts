export type QueryStringValue = string | null;
export type ArrayFormatEncoderInput = QueryStringValue | undefined;
export type QueryStringInputValue = ArrayFormatEncoderInput | number;
export interface IParseReturn {
  [key: string]: QueryStringValue | QueryStringValue[];
}
export interface IParseInput {
  [key: string]: QueryStringInputValue | QueryStringInputValue[];
}

export interface IStringifyOptions {
  /**
   * The name of the function used to determine the order of object keys.
   * If omitted, the keys are sorted in ascending, ASCII character order.
   * Pass `false` to disable sorting.
   */
  sort?: false | ((a: string, b: string) => number);
}

/**
 * Gets the unencoded version of an encoded URI component
 * Returns empty string if input is not valid.
 * @param {string} encodedURIComponent A value representing an encoded URI component.
 */
function decodeUriComponent(input: string) {
  try {
    return decodeURIComponent(input);
  } catch (e) {
    return "";
  }
}

/**
 * Encodes a text string as a valid component of a URI respecting RFC3986
 * @param {string} uriComponent A value representing an encoded URI component.
 */
export function encodeRFC3986ValueChars(str: string): string {
  return encodeURIComponent(str).replace(
    /[!'()*]/g,
    x =>
      `%${x
        .charCodeAt(0)
        .toString(16)
        .toUpperCase()}`
  );
}

export function arrayFormatEncoder(
  key: string,
  value: ArrayFormatEncoderInput
): string {
  const encodedKey = encodeRFC3986ValueChars(key);
  // Missing `=` should be `null`:
  // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
  switch (value) {
    case null:
      return encodedKey;
    case undefined:
      return `${encodedKey}=`;
    default:
      // string
      return `${encodedKey}=${encodeRFC3986ValueChars(value)}`;
  }
}

export function arrayFormatParser(
  key: string,
  value: string | null,
  ret: IParseReturn
): void {
  if (ret[key] === undefined) {
    ret[key] = value;
  } else if (Array.isArray(ret[key])) {
    (ret[key] as QueryStringValue[]).push(value);
  } else {
    ret[key] = [ret[key] as string, value];
  }
}

/**
 * Parse a URL query string into a collection of key and value pairs
 * @param {string} input URL query string
 */
export function parse(input: string): IParseReturn {
  const ret: IParseReturn = {};

  input = input.trim().replace(/^[?#&]/, "");

  if (!input) {
    return ret;
  }

  for (const param of input.split("&")) {
    const [key, value] = param.replace(/\+/g, " ").split("=");
    arrayFormatParser(
      decodeUriComponent(key),
      value === undefined ? null : decodeUriComponent(value),
      ret
    );
  }

  return ret;
}

/**
 * Produces a URL query string from a given obj
 * @param {IParseInput} obj the object to be stringified
 * @param {IStringifyOptions} [options] stringify options
 */
export function stringify(
  obj?: IParseInput,
  options: IStringifyOptions = {}
): string {
  if (!obj) {
    return "";
  }
  const keys = Object.keys(obj);
  if (options.sort !== false) {
    keys.sort(options.sort);
  }
  return keys
    .map(key => {
      const value = obj[key];

      if (value === undefined) {
        return "";
      }

      if (value === null) {
        return encodeRFC3986ValueChars(key);
      }

      if (Array.isArray(value)) {
        return value
          .filter(v => v !== undefined)
          .map(v => {
            if (typeof v === "number") {
              v = v.toString();
            }
            return arrayFormatEncoder(key, v);
          })
          .join("&");
      }

      return `${encodeRFC3986ValueChars(key)}=${encodeRFC3986ValueChars(
        value.toString()
      )}`;
    })
    .filter(x => x.length > 0)
    .join("&");
}
