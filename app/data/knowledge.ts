import { readFileSync } from "node:fs";
import path from "node:path";
import { about } from "./about";
import { notes } from "./notes";
import { profile } from "./profile";
import { projects } from "./projects";

// Everything ditta knows about Morgan, built from the site's own data so the
// chat never drifts from what the pages say. To teach ditta something new:
//   - who Morgan is, how Morgan works → app/data/about.ts
//   - contact, links, stack           → app/data/profile.ts
//   - projects and case studies       → app/data/projects.ts (also the /work/<slug> pages)
//   - a project's public docs          → its GitHub repo (Project.docs), read on the fly
//   - everything about one project    → content/projects/<slug>.md (Morgan writes it, in Spanish)
//   - anything else                   → app/data/notes.ts

// content/projects/<slug>.md without its <!-- notes --> and empty sections.
// Returns "" when the file doesn't exist or has nothing filled in yet.
function projectNotes(slug: string): string {
  let md: string;
  try {
    md = readFileSync(path.join(process.cwd(), "content/projects", `${slug}.md`), "utf8");
  } catch {
    return "";
  }
  const sections = md
    .replace(/<!--[\s\S]*?-->/g, "")
    .split(/^(?=#{1,6} )/m)
    .map((s) => s.trim())
    .filter((s) => s && s.includes("\n")); // heading + at least one line of content
  return sections.join("\n\n");
}

// The public docs repo of a project (README, ARCHITECTURE, CHANGELOG).
// Cached for an hour, so a push to the docs repo reaches ditta within the hour
// without redeploying. Returns "" if GitHub can't be reached: ditta then falls
// back to the notes and site data below.
const DOC_FILES = ["README.md", "ARCHITECTURE.md", "CHANGELOG.md"];

async function projectDocs(repo: string): Promise<string> {
  const files = await Promise.all(
    DOC_FILES.map(async (file) => {
      try {
        const res = await fetch(`https://raw.githubusercontent.com/${repo}/HEAD/${file}`, {
          next: { revalidate: 3600 },
          signal: AbortSignal.timeout(4000),
        });
        if (!res.ok) return "";
        return `### ${file}\n${cleanMarkdown(await res.text())}`;
      } catch {
        return "";
      }
    }),
  );
  return files.filter(Boolean).join("\n\n");
}

// Drop what costs tokens and tells the model nothing: HTML, images, badges.
function cleanMarkdown(md: string): string {
  return md
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images
    .replace(/<\/?(?:p|picture|source|img|table|tr|td|sub|br)\b[^>]*>/gi, "")
    .replace(/<a\s+href="([^"]+)"[^>]*>([^<]*)<\/a>/gi, "$2 ($1)")
    .replace(/<\/?strong>/gi, "**")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function buildKnowledge(): Promise<string> {
  const lines: string[] = [
    `Name: ${profile.name} (handle: ${profile.handle}). Full name: ${profile.fullName}. "${profile.fullName}" and "${profile.name}" are the same person: docs that mention ${profile.fullName} are about ${profile.name}.`,
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
    lines.push(`Detail page on this site: /work/${p.slug}`);
    if (p.live) lines.push(`Live: ${p.live}`);
    if (p.repo) lines.push(`Code: ${p.repo}`);

    // The docs repo and Morgan's notes replace the older lines in projects.ts:
    // mixing old and new makes the model pick wrong.
    const docs = p.docs ? await projectDocs(p.docs) : "";
    const notesMd = projectNotes(p.slug);
    if (docs) lines.push(`Public docs (github.com/${p.docs}):`, docs, "");
    if (notesMd) lines.push(`Written by ${profile.name} (in Spanish):`, notesMd, "");
    if (docs || notesMd) continue;

    lines.push(p.summary);
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
