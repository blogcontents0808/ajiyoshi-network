import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // ルートアクセス時に /index.html へリダイレクト
    router.replace('/index.html')
  }, [router])

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'system-ui',
      color: '#666'
    }}>
      <p>味美ネットワークへリダイレクト中...</p>
    </div>
  )
}