import Script from "next/script"

const Adsense: React.FC<{ pid: string }> = ({ pid }: { pid: string }) => {
  if (process.env.NODE_ENV !== "production") return

  return (
    <Script 
      async 
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pid}`} 
      crossOrigin="anonymous"
      strategy="afterInteractive"  
    />
  )
}

export default Adsense