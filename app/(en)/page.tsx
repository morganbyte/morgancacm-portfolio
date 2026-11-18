import { HomePage, homeMetadata } from "@/app/components/Pages";

export const metadata = homeMetadata("en");

export default function Page() {
  return <HomePage lang="en" />;
}
