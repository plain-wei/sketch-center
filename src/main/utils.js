import Path from 'path';
import { format as formatUrl } from 'url';

export function formatPathAsUrl(...pathSegments) {
  return formatUrl({
    pathname : Path.join(...pathSegments),
    protocol : 'file',
    slashes  : true,
  });
}

export function now() {
  const time = process.hrtime();

  return time[0] * 1000 + time[1] / 1000000;
}
