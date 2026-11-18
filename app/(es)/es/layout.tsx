import RootShell, { siteMetadata } from "@/app/components/RootShell";

export const metadata = siteMetadata("es");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="es">{children}</RootShell>;
}
