/**
 *
 * @param url legal url with protocol
 *
 * @returns hostname
 *
 * @example
 * ```
 * returnHost('https://www.hello.com') => 'hello.com'
 * returnHost('www.hello.com') => error!❌
 * returnHost('hello.com') => error!❌
 * ```
 */
export const returnHost = (url: string) => {
  if (!url) return '';
  const { host } = new URL(url);
  const res = host.split('www.');
  if (res.length === 1) {
    return res[0];
  }
  return res[1];
};
