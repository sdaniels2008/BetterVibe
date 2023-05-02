import Head from 'next/head'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { useState } from "react";
import { useQuery } from "react-query";

import { fetchSearch, fetchGenres } from "@/lib/fetch";
import Header from '@/components/Header';
import SwiperList from '@/components/SwiperList';
import Spinner from '@/components/Spinner';

import chill from '@/static/moods/chill.jpg';
import commute from '@/static/moods/commute.jpg';
import party from '@/static/moods/party.jpg';
import energy from '@/static/moods/energy.jpg';
import feelgood from '@/static/moods/feelgood.jpg';
import focus from '@/static/moods/focus.jpg';
import romance from '@/static/moods/romance.jpg';
import sleep from '@/static/moods/sleep.jpg';
import summer from '@/static/moods/summer.jpg';
import workout from '@/static/moods/workout.jpg';
import GenreListing from '@/components/GenreListing';

const inter = Inter({ subsets: ['latin'] })

const HIDDEN_MOODS = ['Black Lives Matter', 'Pride'];

export default function Home() {
  const [term, setTerm] = useState('')

  return (
    <>
      <Head>
        <title>BetterVibe</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <Search term={term} setTerm={setTerm} />

      { ! term && (
      <Genres />
      )}

      <GenreListing id="ggMPOg1uX2lRZUZiMnNrQnJW" />
      <GenreListing id="ggMPOg1uX1JOQWZFeDByc2Jm" />
    </>
  )
}

const moods = {
  Chill: {
    background: chill,
  },
  Commute: {
    background: commute,
  },
  'Energy Boosters': {
    background: energy,
  },
  'Feel Good': {
    background: feelgood,
  },
  Party: {
    background: party,
  },
  Focus: {
    background: focus,
  },
  Romance: {
    background: romance,
  },
  Summer: {
    background: summer,
  },
  Workout: {
    background: workout,
  },
  Sleep: {
    background: sleep,
  },
};

function Genres() {
  const { isLoading, isError, isSuccess, data } = useQuery('genres', () => fetchGenres())

  if(isLoading) {
    return <Spinner />;
  }

  return <>
    <div className='p-4'>
      <h2 className='font-bold text-lg mb-2 text-gray-700'>Vibes</h2>
      <SwiperList slidesPerView={2.3} spaceBetween={12} breakpoints={{
              640: {
                slidesPerView: 4.3,
                 spaceBetween: 12
              },
              1024: {
                slidesPerView: 10.3,
                 spaceBetween: 12
              },
        }}>
        {data.data.moods.filter(mood => ! HIDDEN_MOODS.includes(mood.title)).map(mood => (
          <Link key={mood.id} href={`/genre/${mood.id}`}>
            <div className="bg-blue-200 h-20 block rounded p-6" style={{ backgroundColor: moods[mood.title]?.color, backgroundImage: `url(${moods[mood.title]?.background.src})`, backgroundSize: 'cover', backgroundPosition: '100%' }}></div>
            <span className="text-gray-700 text-sm">{mood.title}</span>
          </Link>
        ))}
      </SwiperList>

      <hr className="my-4" />

      <h2 className='font-bold text-lg mb-2 text-gray-700'>Genres</h2>
      <SwiperList slidesPerView={2.3} spaceBetween={12} breakpoints={{
              640: {
                slidesPerView: 4.3,
                 spaceBetween: 12
              },
              1024: {
                slidesPerView: 10.3,
                 spaceBetween: 12
              },
        }}>
        {data.data.genres.map(genre => (
          <Link key={genre.id} href={`/genre/${genre.id}`} className="bg-gray-200 h-20 block rounded p-6">
            {genre.title}
          </Link>
        ))}
      </SwiperList>
    </div>
  </>
}


function Search({ term, setTerm }) {
  const { isLoading, isError, isSuccess, data } = useQuery(['search', term], () => fetchSearch(term), {
    enabled: Boolean(term),
  })

  return (
    <div className='p-4'>
      <form className="flex items-center">
          <label htmlFor="simple-search" className="sr-only">Search</label>
          <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
              </div>
              <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Album, Song or Artist..." required value={term} onChange={e => setTerm(e.target.value)} />
          </div>
          <button type="submit" className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <span className="sr-only">Search</span>
          </button>
      </form>

      {!isLoading && data && <SearchResult data={data.data} />}
    </div>
  );
}

function SearchResult({ data }) {
  if( ! data.items) {
    return 'no results :(';
  }

  return (
    <ul className='flex flex-wrap mt-10'>
      {data.items.map(item => <li className='w-1/3 mb-6' key={item.url}>
        <Link href={item.url.replace('?list=', '/')} className="mb-4">
          <img width="100" height="100" src={item.thumbnail} className="rounded bg-gray-200" />
          <div className="text-gray-700 truncate">{item.name}</div>
          <div className="text-gray-400 text-sm truncate">{item.uploaderName}</div>
        </Link>
        </li>)}
    </ul>
  )
}
