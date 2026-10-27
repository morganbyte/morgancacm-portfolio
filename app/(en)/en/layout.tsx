import RootShell, { siteMetadata } from "../../components/RootShell";

export const metadata = siteMetadata("en");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="en">{children}</RootShell>;
}
