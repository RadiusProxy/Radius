import Script from "next/script"

type Props = {
  pid: string;
}

const Adsense: React.FC<Props> = ({ pid }) => {
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