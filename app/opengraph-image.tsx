import { ogAlt, ogImage, ogSize } from "@/app/components/OgImage";

export const size = ogSize;
export const contentType = "image/png";
export const alt = ogAlt;

export default function OpengraphImage() {
  return ogImage();
}
