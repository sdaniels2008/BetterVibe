import { useQuery } from "react-query";
import { useRouter } from 'next/router'
import Link from 'next/link'

import { fetchGenre } from "../../lib/fetch";
import SwiperList from "@/componenets/SwiperList";
import Header from "@/componenets/Header";

export default function Genre() {
  const router = useRouter()
  const { id } = router.query

  const { isLoading, isError, isSuccess, data } = useQuery(['genre', id], () => fetchGenre(id), {
    enabled: Boolean(id),
  })


  return (
    <div>
      <Header />
      {!isLoading && data && <List data={data.data} />}
    </div>
  );
}

function List({ data }) {
  return <>
    {Object.keys(data.shelf).map((category, index) => (
      <div key={index} className="p-4">
        <h2 className="text-lg font-bold text-gray-700 mb-3">{category}</h2>
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
        {data.shelf[category].map(playlist => (
          <Link key={playlist.id} href={`/playlist/${playlist.id}`} className="block">
            <img width="200" height="200" src={playlist.thumbnails[0].url} className="rounded" />
            <span className="text-gray-700 text-sm">{playlist.title}</span>
          </Link>
        ))}
        </SwiperList>
      </div>
    ))}
  </>
}
