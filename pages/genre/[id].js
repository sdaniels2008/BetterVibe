import { useQuery } from "react-query";
import { useRouter } from 'next/router'
import Link from 'next/link'

import { fetchGenre } from "../../lib/fetch";

export default function Genre() {
  const router = useRouter()
  const { id } = router.query

  const { isLoading, isError, isSuccess, data } = useQuery(['genre', id], () => fetchGenre(id), {
    enabled: Boolean(id),
  })


  return (
    <div>
      mood

      {!isLoading && data && <List data={data.data} />}
    </div>
  );
}

function List({ data }) {
  return <>
    {Object.keys(data.shelf).map(category => (
      <div className="p-4">
        <h2 class="text-lg font-bold">{category}</h2>
        <ul>
        {data.shelf[category].map(playlist => (
          <li key={playlist.id}><Link href={`/playlist/${playlist.id}`}>
            <img width="60" height="60" src={playlist.thumbnails[0].url} />
            {playlist.title}
          </Link></li>
        ))}
        </ul>
      </div>
    ))}
  </>
}
