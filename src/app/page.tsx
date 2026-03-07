import { redirect } from 'next/navigation'

// Root → redirect to map (middleware handles auth gate)
export default function Home() {
  redirect('/map')
}
