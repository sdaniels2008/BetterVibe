import { useQuery } from "react-query";
import Link from 'next/link'

import { fetchGenre } from "../lib/fetch";
import SwiperList from "@/components/SwiperList";
import Spinner from "@/components/Spinner";

export default function GenreListing({ id }) {
  const { isLoading, isError, isSuccess, data } = useQuery(['genre', id], () => fetchGenre(id), {
    enabled: Boolean(id),
  })

  return (
    <div>
      {isLoading && <Spinner />}
      {isSuccess && data?.data?.featured && <List playlists={data?.data?.featured} title="Featured" />}
      {isSuccess && data?.data?.shelf && <Shelf data={data.data} />}
    </div>
  );
}

function List({ playlists, title }) {
  if( ! playlists.length) {
    return null;
  }
  return <>
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-700 mb-3">{title}</h2>
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
        {playlists.map(playlist => (
          <Link key={playlist.id} href={`/playlist/${playlist.id}?th=${playlist.thumbnails[0].url}`} className="block">
            <img width="200" height="200" src={playlist.thumbnails[0].url} className="rounded bg-gray-200" />
            <span className="text-gray-700 text-sm">{playlist.title}</span>
          </Link>
        ))}
        </SwiperList>
      </div>
  </>
}

function Shelf({ data }) {
  return Object.keys(data.shelf)
    .map((category, index) => <List key={index} playlists={data.shelf[category]} title={category} />)
}
