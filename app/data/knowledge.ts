import { aboutCopy } from "../components/About";
import { profile } from "./profile";
import { projects } from "./projects";

/**
 * Extra facts the chat can use that don't appear on the site.
 * Write them as plain sentences. Only add what you're happy for anyone to read:
 * the assistant may quote them.
 */
export const extraFacts: string[] = [
  // "I've been programming since 2021.",
  // "I prefer async communication and can overlap 4+ hours with US time zones.",
  // "I'm learning Go to go deeper on backend systems.",
];

// Everything the assistant knows about Morgan, built from the site's own data
// so the chat never drifts from what the pages say.
export function buildKnowledge(): string {
  const about = aboutCopy;
  const lines: string[] = [
    `Name: ${profile.name} (handle: ${profile.handle})`,
    `Role: ${profile.role}`,
    `Pitch: ${profile.tagline}`,
    `Availability: ${profile.availability}`,
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

  if (extraFacts.length) lines.push("Other facts:", ...extraFacts.map((f) => `- ${f}`));
  return lines.join("\n");
}
