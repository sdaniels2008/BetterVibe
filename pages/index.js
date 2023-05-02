import Head from 'next/head'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { useState } from "react";
import { useQuery } from "react-query";

import { fetchSearch, fetchGenres } from "../lib/fetch";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Muzik</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Search />

      <Genres />
    </>
  )
}

function Genres() {
  const { isLoading, isError, isSuccess, data } = useQuery('genres', () => fetchGenres())

  if(isLoading) {
    return 'loading...';
  }

  return <>
    <div>
      <div className="flex flex-wrap gap-2">
    {data.data.moods.filter(mood => mood.title !== 'Black Lives Matter').map(mood => (
      <Link href={`/genre/${mood.id}`} className="bg-blue-200 w-20 h-20">
        {mood.title}
      </Link>
    ))}
    </div>

    <hr className="my-4" />

      <div className="flex flex-wrap gap-2">
    {data.data.genres.map(genre => (
        <Link href={`/genre/${genre.id}`} className="bg-gray-200 w-20 h-20">
        {genre.title}
      </Link>
      ))}
      </div>
    </div>
  </>
}


function Search() {
  const [term, setTerm] = useState('')
  const { isLoading, isError, isSuccess, data } = useQuery(['search', term], () => fetchSearch(term), {
    enabled: Boolean(term),
  })

  return (
    <div>
      <div>
      <input value={term} onChange={e => setTerm(e.target.value)} className="border rounded p-4" placeholder="Album, Song or an Artist..." />
      </div>

      {!isLoading && data && <List data={data.data} />}
    </div>
  );
}

function List({ data }) {
  if( ! data.items) {
    return 'no results :(';
  }

  return (
    <ul>
      {data.items.map(item => <li key={item.url}>
        <Link href={item.url.replace('?list=', '/')}>
        <img width="60" height="60" src={item.thumbnail} /> {item.name}
        </Link>
        </li>)}
    </ul>
  )
}
