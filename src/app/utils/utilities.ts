// If the ulr doesn't have https protocol, append it to the url
// Useful when having an anchor element with href that doesn't
// necessarily have a protocol so the link redirects to localhost/site url 
export function makeAbsoluteUrl(url: string) {
  if (!url.match(/^https?:\/\//)) {
    return `https://${url}`;
  }

  return url;
};

// Returns true if scroll height is larger than the client height, indicating that there
// is a scrollbar
export function checkIfScrollbar() {
  if (document.documentElement.scrollHeight > document.documentElement.clientHeight) {
    return true;
  }

  return false;
}

// Checks if the device used to visit the app is mobile
export function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
}