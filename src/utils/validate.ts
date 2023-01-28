/**
 *
 * @param url url string
 *
 * @returns {boolean} if the url is legal
 *
 * @example
 * ```
 * validateHttpUrl('https://www.hello.com') => true
 * validateHttpUrl('https://www.hello.org') => true
 * validateHttpUrl('https://www.hello.') => false
 * validateHttpUrl('hello.com') => false
 * ```
 */
export const validateHttpUrl = (url: string) => {
  const reg = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;
  return reg.test(url);
};

/**
 *
 * @param url url string
 *
 * @returns {boolean} if the url is legal without protocol
 *
 * @example
 * ```
 * validateNonHttpUrl('https://www.hello.com') => false
 * validateNonHttpUrl('https://www.hello.org') => false
 * validateNonHttpUrl('www.hello') => true
 * validateNonHttpUrl('hello.com') => true
 * ```
 */
export const validateNonHttpUrl = (url: string) => {
  const reg = /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
  return reg.test(url);
};

export const validateUrl = (url: string) => validateHttpUrl(url) || validateNonHttpUrl(url);
