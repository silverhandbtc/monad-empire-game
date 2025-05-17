import { ConnectWallet } from '@/components/connect-wallet';
import Image from 'next/image';

export default function Page() {
  return (
    <main className="flex min-h-[calc(100vh-72px)] flex-col items-center p-24 bg-monad-background text-white">
      <Image src="/logo.png" alt="Monad Empire Logo" width={400} height={400} />
      <ConnectWallet />
    </main>
  );
}
