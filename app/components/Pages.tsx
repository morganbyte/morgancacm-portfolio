import { profile } from "../data/profile";
import AboutChat from "./AboutChat";
import AsciiPortrait from "./AsciiPortrait";
import PortraitFooter from "./PortraitFooter";

const copy = {
  portrait: "Portrait of Morgan drawn with characters",
};

// The whole portfolio is this one screen: the portrait and ditta. Everything
// else (projects, case studies) is reached through links in the chat.
export function HomePage() {
  return (
    <div className="mx-auto grid min-h-dvh max-w-6xl grid-cols-1 content-center items-center gap-8 px-6 py-10 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
      {/* No visible text by design; screen readers and search engines still get a heading. */}
      <h1 className="sr-only">
        {profile.name}: {profile.role}
      </h1>
      {/* Width is capped so the portrait's height always fits the viewport. */}
      <div className="mx-auto w-full" style={{ maxWidth: "calc((100dvh - 7rem) * 1.12)" }}>
        <AsciiPortrait label={copy.portrait} />
        <div className="mt-3">
          <PortraitFooter />
        </div>
      </div>
      <div className="h-[min(560px,75dvh)] w-full lg:h-[min(640px,calc(100dvh-5rem))]">
        <AboutChat />
      </div>
    </div>
  );
}
