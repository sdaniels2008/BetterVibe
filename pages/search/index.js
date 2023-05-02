import Image from 'next/image';
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

import { fetchSearch } from "../fetch/search";

export default function Search() {
  const [term, setTerm] = useState('')
  const { isLoading, isError, isSuccess, data } = useQuery(['search', term], () => term && fetchSearch(term))

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
      {data.items.map(item => <li key={item.url}><img width="120" height="120" src={item.thumbnail} /> {item.name}</li>)}
    </ul>
  )
}
