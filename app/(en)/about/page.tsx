import { AboutPage, aboutMetadata } from "@/app/components/Pages";

export const metadata = aboutMetadata("en");

export default function Page() {
  return <AboutPage lang="en" />;
}
