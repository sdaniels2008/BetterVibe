import { useRouter } from 'next/router'

import Header from "@/components/Header";
import GenreListing from "@/components/GenreListing";

export default function Genre() {
  const router = useRouter()
  const { id } = router.query

  return (
    <div>
      <Header />
      <GenreListing id={id} />
    </div>
  );
}
