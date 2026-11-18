import {
  CaseStudyPage,
  caseStudyMetadata,
  caseStudyParams,
} from "@/app/components/CaseStudy";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = caseStudyParams;

export async function generateMetadata({ params }: Props) {
  return caseStudyMetadata("es", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <CaseStudyPage lang="es" slug={(await params).slug} />;
}
