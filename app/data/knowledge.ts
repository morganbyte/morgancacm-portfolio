import { about } from "./about";
import { notes } from "./notes";
import { profile } from "./profile";
import { projects } from "./projects";

// Everything ditta knows about Morgan, built from the site's own data so the
// chat never drifts from what the pages say. To teach ditta something new:
//   - who Morgan is, how Morgan works → app/data/about.ts
//   - contact, links, stack           → app/data/profile.ts
//   - projects and case studies       → app/data/projects.ts (also the /work/<slug> pages)
//   - anything else                   → app/data/notes.ts
export function buildKnowledge(): string {
  const lines: string[] = [
    `Name: ${profile.name} (handle: ${profile.handle})`,
    `Role: ${profile.role}`,
    `Pitch: ${profile.tagline}`,
    `Availability: ${profile.availability}`,
    `Looking for: ${about.contact}`,
    `Contact: email ${profile.email}, LinkedIn ${profile.links.linkedin}, GitHub ${profile.links.github}, X ${profile.links.x}`,
    `Stack: ${profile.stack.join(", ")}`,
    "",
    "About:",
    ...about.bio,
    "",
    `How ${profile.name} works:`,
    ...about.how.map((h) => `- ${h.title}: ${h.body}`),
    "",
    "Projects:",
  ];

  for (const p of projects) {
    lines.push(`## ${p.title}${p.year ? ` (${p.year})` : ""}`);
    lines.push(p.summary);
    lines.push(`Detail page on this site: /work/${p.slug}`);
    if (p.live) lines.push(`Live: ${p.live}`);
    if (p.repo) lines.push(`Code: ${p.repo}`);
    if (p.stack.length) lines.push(`Stack: ${p.stack.join(", ")}`);
    const cs = p.caseStudy;
    if (cs.problem) lines.push(`Problem: ${cs.problem}`);
    if (cs.architecture?.length) {
      lines.push(`Architecture: ${cs.architecture.map((a) => `${a.name} (${a.detail})`).join(" → ")}`);
    }
    for (const d of cs.decisions ?? []) lines.push(`Decision: ${d.title}. ${d.body}`);
    for (const r of cs.results ?? []) lines.push(`Result: ${r.value} ${r.label}`);
    if (cs.lessons) lines.push(`Lessons: ${cs.lessons}`);
    lines.push("");
  }

  const extra = notes.trim();
  if (extra) lines.push("Other facts:", extra);
  return lines.join("\n");
}
