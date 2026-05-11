import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getFootprints, getFeaturedPhotos, mediaUrl } from '@/lib/api';
import { hasLocale, getDictionary, t, type Locale } from '@/lib/i18n';
import FootprintMapLoader from '@/components/FootprintMapLoader';
import JustifiedGrid from '@/components/JustifiedGrid';

async function FootprintSection({ lang, dict }: { lang: Locale; dict: Awaited<ReturnType<typeof getDictionary>> }) {
  const footprints = await getFootprints();
  return (
    <section className="container py-16">
      <h2 className="text-3xl font-bold mb-2">{dict.home.footprint_title}</h2>
      <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8">
        {t(dict.home.footprint_desc, { count: footprints.length })}
      </p>
      <FootprintMapLoader footprints={footprints} />
      {footprints.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {footprints.slice(0, 12).map((fp) => (
            <li
              key={fp.id}
              className="px-3 py-1 rounded-full text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
            >
              {fp.city ?? fp.name}
            </li>
          ))}
          {footprints.length > 12 && (
            <li className="px-3 py-1 rounded-full text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500">
              +{footprints.length - 12}
            </li>
          )}
        </ul>
      )}
    </section>
  );
}

const MOTTO_ICONS = [
  <svg
    key="globe"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="w-10 h-10 text-blue-500"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
    />
  </svg>,
  <svg
    key="sun"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="w-10 h-10 text-blue-500"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
    />
  </svg>,
  <svg
    key="smile"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="w-10 h-10 text-blue-500"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
    />
  </svg>,
  <svg
    key="clock"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="w-10 h-10 text-blue-500"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>,
];

async function FeaturedPhotos({ lang, dict }: { lang: Locale; dict: Awaited<ReturnType<typeof getDictionary>> }) {
  const photos = await getFeaturedPhotos();
  const display = photos.filter((p) => p.image && p.image.width && p.image.height);
  if (display.length === 0) return null;

  const items = display.map((photo) => ({
    id: photo.id,
    url: mediaUrl(photo.image),
    alt: photo.image?.alternativeText ?? '',
    width: photo.image!.width,
    height: photo.image!.height,
  }));

  return (
    <section className="container pt-16 pb-8">
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="text-3xl font-bold">{dict.home.photos_title}</h2>
        <Link
          href={`/${lang}/photos`}
          className="text-sm text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
        >
          {dict.home.photos_all}
        </Link>
      </div>
      <JustifiedGrid items={items} targetHeight={420} gap={8} />
    </section>
  );
}

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  const mottos = [
    { title: dict.home.motto_1_title, desc: dict.home.motto_1_desc },
    { title: dict.home.motto_2_title, desc: dict.home.motto_2_desc },
    { title: dict.home.motto_3_title, desc: dict.home.motto_3_desc },
    { title: dict.home.motto_4_title, desc: dict.home.motto_4_desc },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-[55vh] text-center px-6 py-20">
        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-black dark:text-white mb-5">
          {dict.home.hero_title}
        </h1>
        <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
          {dict.home.hero_desc}
        </p>
        <div className="flex gap-4 mt-10">
          <Link
            href={`/${lang}/articles`}
            className="px-7 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-80 transition-opacity"
          >
            {dict.home.read_articles}
          </Link>
          <Link
            href={`/${lang}/photos`}
            className="px-7 py-3 rounded-full border border-black/20 dark:border-white/20 text-sm font-medium hover:bg-black/4 dark:hover:bg-white/6 transition-colors"
          >
            {dict.home.view_photos}
          </Link>
        </div>
      </section>
      {/* Map */}
      <FootprintSection lang={lang} dict={dict} />
      {/* Motto */}
      <section className="bg-zinc-50 dark:bg-zinc-950 py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-3">{dict.home.motto_title}</h2>
          <p className="text-center text-zinc-500 dark:text-zinc-400 mb-12">{dict.home.motto_subtitle}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {mottos.map((m, i) => (
              <div
                key={m.title}
                className="flex flex-col gap-4 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-black/6 dark:border-white/6"
              >
                {MOTTO_ICONS[i]}
                <h3 className="text-lg font-semibold">{m.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Photos */}
      <FeaturedPhotos lang={lang} dict={dict} />
    </div>
  );
}
