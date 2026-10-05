import { FC } from 'react';

const PATREON_URL = 'https://www.patreon.com/cw/natekaneofficial';
const PRIVATE_LESSONS_URL = 'https://www.natekaneofficial.com/lessons';

const ExternalLinkIcon: FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
);

const GuidedLessonsPage: FC = () => {
  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto space-y-10">
        <section className="space-y-3">
          <h1 className="text-2xl md:text-4xl font-bold text-amber-900 leading-tight">
            Ready to take your playing to the next level?
          </h1>
          <p className="text-lg md:text-xl text-amber-800 font-medium">
            Learn directly from Nate Kane; the creator of Map My Guitar.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <a
            href={PATREON_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-lg border border-amber-800/30 bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 shadow transition-colors hover:border-amber-700/50 cursor-pointer"
          >
            <h2 className="text-lg md:text-xl font-bold text-stone-50 border-b border-stone-50/30 pb-2 mb-3">
              Online guided lessons
            </h2>
            <p className="text-stone-300 text-sm md:text-base leading-relaxed flex-1">
              Map My Guitar&apos;s guided lesson path on Patreon — structured lessons that will take
              a lot of the guess work out your practice, and answer questions you didn't know you had.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-stone-50 group-hover:text-amber-100">
              Go to Patreon
              <ExternalLinkIcon />
            </span>
          </a>

          <a
            href={PRIVATE_LESSONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-lg border border-amber-800/30 bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 shadow transition-colors hover:border-amber-700/50 cursor-pointer"
          >
            <h2 className="text-lg md:text-xl font-bold text-stone-50 border-b border-stone-50/30 pb-2 mb-3">
              Private 1:1 lessons
            </h2>
            <p className="text-stone-300 text-sm md:text-base leading-relaxed flex-1">
              For fast results, deeper learning, and a personalized curriculum, Nate offers 1:1
              private lessons that'll quickly take your playing to the next level.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-stone-50 group-hover:text-amber-100">
              View private lessons
              <ExternalLinkIcon />
            </span>
          </a>
        </section>

        <section className="grid gap-6 md:grid-cols-[minmax(0,280px)_1fr] md:items-start md:gap-8">
          <div className="mx-auto w-full max-w-[280px] sm:max-w-[320px] md:mx-0 md:max-w-none overflow-hidden rounded-lg border border-amber-900/20 bg-zinc-900 shadow-sm">
            <video
              className="block w-full h-auto"
              controls
              autoPlay
              muted
              playsInline
              preload="metadata"
              aria-label="Learn to play like a pro with Nate Kane"
            >
              <source src="/videos/play_like.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="rounded-lg border border-amber-900/20 bg-stone-50 shadow-sm p-6 sm:p-8 space-y-4 h-full">
            <h2 className="text-xl md:text-2xl font-bold text-amber-900">Why learn from Nate?</h2>
            <p className="text-amber-900/90 leading-relaxed">
              Nate started playing guitar at 14 and hit a wall early — YouTube, books, and local
              teachers weren&apos;t enough. He went to Nashville, studied with working pros, and
              learned proven methods that made understanding and playing the guitar feel like
              second nature.
            </p>
            <p className="text-amber-900/90 leading-relaxed">
              He&apos;s been teaching since 2015. His goal is to make Nashville-level teaching
              more accessible. Being stuck isn&apos;t fun — Nate has the tools to help you keep
              progressing.
            </p>
          </div>
        </section>

        <section className="rounded-lg bg-amber-900 text-stone-50 p-6 sm:p-8 text-center space-y-4">
          <h2 className="text-xl md:text-2xl font-bold">Start today!</h2>
          <p className="text-stone-100/90 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Guided lessons will take your playing to the next level.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
            <a
              href={PATREON_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium border border-stone-50/40 h-10 px-5 text-stone-50 hover:bg-amber-800 cursor-pointer transition-colors"
            >
              Guided lessons on Patreon
              <ExternalLinkIcon className="h-4 w-4" />
            </a>
            <a
              href={PRIVATE_LESSONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium border border-stone-50/40 h-10 px-5 text-stone-50 hover:bg-amber-800 cursor-pointer transition-colors"
            >
              Private lessons
              <ExternalLinkIcon className="h-4 w-4" />
            </a>
          </div>
        </section>
      </div>
    </main>
  );
};

export default GuidedLessonsPage;
