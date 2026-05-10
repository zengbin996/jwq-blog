import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { hasLocale, getDictionary } from '@/lib/i18n';

const AVATAR_URL =
  'https://images-1258070316.cos.ap-nanjing.myqcloud.com/e0ccb01552a72097b844d8a64efda0dd_120b260d2b.jpg' +
  '?imageMogr2/thumbnail/200x200/gravity/center/crop/200x200/format/webp/quality/85';

export async function generateMetadata({ params }: PageProps<'/[lang]/about'>): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.about.title };
}

export default async function AboutPage({ params }: PageProps<'/[lang]/about'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <div className="container py-16 max-w-4xl">
      {/* Profile */}
      <section className="flex flex-col sm:flex-row items-start gap-8 mb-14">
        <div className="shrink-0 w-20 h-20 rounded-full overflow-hidden">
          <Image src={AVATAR_URL} alt="avatar" width={80} height={80} className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-1">JWQ</h1>
          <p className="text-zinc-400 dark:text-zinc-500 text-sm mb-2">
            {dict.about.location} · {dict.about.role}
          </p>
          <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm mb-3">{dict.about.desc}</p>
          <p className="text-zinc-400 dark:text-zinc-500 text-sm leading-relaxed">
            {dict.about.hobbies_label}：{dict.about.hobbies}
          </p>
        </div>
      </section>

      {/* Letter */}
      {/* <section className="border-t border-zinc-200 dark:border-zinc-800 pt-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-8">{dict.about.letter_to}</p>
        <div className="space-y-5 text-zinc-600 dark:text-zinc-400 leading-8 text-[15px]">
          <p>{dict.about.letter_p1}</p>
          <p>{dict.about.letter_p2}</p>
          <p>{dict.about.letter_p3}</p>
          <p>{dict.about.letter_p4}</p>
          <p className="text-zinc-800 dark:text-zinc-200">{dict.about.letter_thanks}</p>
        </div>
        <p className="mt-10 text-sm text-zinc-400 dark:text-zinc-500 italic tracking-wider">{dict.about.letter_poem}</p>
        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400 text-right">{dict.about.letter_sign}</p>
      </section> */}
    </div>
  );
}
