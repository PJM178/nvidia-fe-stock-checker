// If the ulr doesn't have https protocol, append it to the url
// Useful when having an anchor element with href that doesn't
// necessarily have a protocol so the link redirects to localhost/site url 
export function makeAbsoluteUrl(url: string) {
  if (!url.match(/^https?:\/\//)) {
    return `https://${url}`;
  }

  return url;
};