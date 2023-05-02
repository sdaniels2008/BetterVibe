import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import logo from '@/static/logo-dark.png';

export default function Header() {
  const router = useRouter();
  return (
    <div className='flex justify-between p-4'>
      <Link href="/" className='flex items-center'>
          <Image src={logo} width={34} height={34} className="mr-4" alt="BetterVibe logo" />
          <h1 className='font-bold text-lg text-gray-900'>BetterVibe</h1>
      </Link>
      {router.pathname !== '/' && (
        <Link href="/">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </Link>
      )}
    </div>
  )
}
