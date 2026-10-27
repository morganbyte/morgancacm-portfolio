import { ogAlt, ogImage, ogSize } from "../../components/OgImage";

export const size = ogSize;
export const contentType = "image/png";
export const alt = ogAlt("en");

export default function OpengraphImage() {
  return ogImage("en");
}
