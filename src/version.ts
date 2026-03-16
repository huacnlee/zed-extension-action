import { basename } from "path";

export function parseVersionFromTag(tag: string): string {
  return tag.replace(/^.*?((\.?\d+){1,3}).*?$/, "$1");
}

const ghDownloadRE =
  /^https:\/\/github.com\/[^/]+\/[^/]+\/releases\/download\/(.+)\/[^/]+$/;

export function fromUrl(url: string): string {
  const downloadMatch = url.match(ghDownloadRE);
  if (downloadMatch) {
    return decodeURIComponent(downloadMatch[1]);
  }
  return basename(url).replace(/\.(tar\.gz|tgz|zip)$/, "");
}
