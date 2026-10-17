'use client'

import { usePathname } from 'next/navigation'

import {
  ApplyBar,
  Banner,
  BottomBar,
  MainMenu,
  StatusBar,
  TabMenu,
} from '@/components/router'
import { SearchProvider } from '@/components/Search'
import { locate } from '@/data/menu'

// The router's page: 998px wide, banner and status bar on top, a 202px menu on
// the left, the tab bar and the form area on the right. Below 1024px the menu
// moves into a drawer behind the "Меню" button.
export function Layout({ children }: { children: React.ReactNode }) {
  let here = locate(usePathname())

  return (
    <SearchProvider>
      <div className="mx-auto w-full max-w-[998px]">
        <Banner />
        <StatusBar />
        <div className="flex items-start">
          <aside className="-mt-[30px] hidden w-[202px] flex-none pl-[17px] lg:block">
            <MainMenu />
          </aside>
          <main className="min-w-0 flex-1 max-lg:mt-2">
            {here && <TabMenu here={here} />}
            <div className="min-h-[400px] rounded-b-[3px] border border-tab-active bg-form px-2.5 pt-2.5 pb-5 text-xs leading-[1.6] max-sm:px-1.5">
              <article className="doc">{children}</article>
              {here && <ApplyBar here={here} />}
            </div>
          </main>
        </div>
        <BottomBar />
      </div>
    </SearchProvider>
  )
}
