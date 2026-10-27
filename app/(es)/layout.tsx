import RootShell, { siteMetadata } from "../components/RootShell";

export const metadata = siteMetadata("es");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="es">{children}</RootShell>;
}
