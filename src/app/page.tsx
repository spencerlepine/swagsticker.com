import Image from 'next/image';
import PingBtn from '@/components/PingBtn';

export default function LandingPage() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image className="dark:invert" src="https://nextjs.org/icons/next.svg" alt="Next.js logo" width={180} height={38} priority />

        <PingBtn endpoint="/api/ping" title="Ping" />
        <PingBtn endpoint="/api/ping-protected" title="Ping [protected]" />
        <p>secret: {process.env.MY_SECRET_VALUE}</p>
      </main>
    </div>
  );
}
