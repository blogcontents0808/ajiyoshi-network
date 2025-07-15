export default function Loading() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Noto Sans JP, sans-serif'
    }}>
      <div>
        <div style={{ 
          fontSize: '1.5rem', 
          marginBottom: '10px',
          color: '#E67E22'
        }}>
          Sanity Studio
        </div>
        <div style={{ color: '#666' }}>
          読み込み中...
        </div>
      </div>
    </div>
  )
}