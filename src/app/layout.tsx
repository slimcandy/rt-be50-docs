import { type Metadata, type Viewport } from 'next'

import { Layout } from '@/components/Layout'
import { SITE_NAME, SITE_URL } from '@/data/site'

import '@/styles/tailwind.css'

const description =
  'Неофициальный справочник по каждой странице и полю веб-интерфейса роутера ASUS RT-BE50: что это значит простыми словами, как это называют и где читать подробнее.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s — ${SITE_NAME}`,
    default: 'RT-BE50: справочник по настройкам',
  },
  description,
  authors: [{ name: 'Aleksei Volkov' }],
  alternates: { canonical: './' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'ru_RU',
    description,
    images: [
      {
        url: '/share-card.jpg?v=2',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Справочник по настройкам роутера ASUS RT-BE50 в оформлении, как у самого роутера: меню слева, таблица полей справа',
      },
    ],
  },
  twitter: { card: 'summary_large_image' },
  icons: { apple: '/apple-touch-icon.png', icon: '/apple-touch-icon.png' },
}

export const viewport: Viewport = {
  themeColor: '#21333e',
  colorScheme: 'dark',
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-full pr-[max(16px,env(safe-area-inset-right))] pl-[max(16px,env(safe-area-inset-left))] py-2.5 antialiased">
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
