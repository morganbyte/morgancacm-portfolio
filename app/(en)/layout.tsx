import RootShell, { siteMetadata } from "@/app/components/RootShell";

export const metadata = siteMetadata("en");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="en">{children}</RootShell>;
}
