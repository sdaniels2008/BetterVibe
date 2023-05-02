import { useState } from "react";
import { useQuery } from "react-query";

import { fetchSearch } from "../../lib/fetch";

export default function Search() {
  const [term, setTerm] = useState('')
  const { isLoading, isError, isSuccess, data } = useQuery(['search', term], () => fetchSearch(term), {
    enabled: Boolean(term),
  })

  return (
    <div>
      Search
      <div>
      <input value={term} onChange={e => setTerm(e.target.value)} className="border rounded p-4" placeholder="Gloria..." />
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
        <a href={item.url.replace('?list=', '/')}>
        <img width="60" height="60" src={item.thumbnail} /> {item.name}
        </a>
        </li>)}
    </ul>
  )
}
