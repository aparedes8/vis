import { useRouter } from 'next/router'
import useSWR from 'swr'
import { DateRangePicker } from 'rsuite';

const fetcher = async (url) => {
  const res = await fetch(url)
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
}

export default function Influx() {
  const { query } = useRouter()
  const { data, error } = useSWR(
    () => query.id && `/api/influx`,
    fetcher
  )

  if (error) return <div>{error.message}</div>
  if (!data) return <div>Loading...</div>

  return (
    <div>
    <table>
      <thead>
        
      </thead>
      <tbody>
        <tr>
          
        </tr>
      </tbody>
    </table>
    </div>
  )
}
