'use client'

// The frame of the router's web UI, rebuilt for the guide: banner, status bar,
// left menu, tab bar, form area and the Apply bar. Sizes and colours follow the
// router's index_style.css and form_style.css.

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useSearch } from '@/components/Search'
import {
  allTabs,
  formTitle,
  locate,
  menu,
  type IconName,
  type Location,
} from '@/data/menu'
import { MANUAL_URL, REPO_URL, ROUTER_URL, VERIFIED } from '@/data/site'

/* ---------- icons (stroke drawings in the spirit of the router's menu icons) ---------- */

const paths: Record<IconName, React.ReactNode> = {
  guide: (
    <>
      <path d="M4 4h10l6 6v10H4z" />
      <path d="M14 4v6h6" />
      <path d="M8 14l3 3 5-5" />
    </>
  ),
  map: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </>
  ),
  mesh: (
    <>
      <circle cx="12" cy="6" r="2.5" />
      <circle cx="5" cy="18" r="2.5" />
      <circle cx="19" cy="18" r="2.5" />
      <path d="M10.5 8l-4 7.5M13.5 8l4 7.5M7.5 18h9" />
    </>
  ),
  net: (
    <>
      <rect x="3" y="5" width="18" height="6" rx="1.5" />
      <rect x="3" y="13" width="18" height="6" rx="1.5" />
      <path d="M7 8h.01M7 16h.01" />
    </>
  ),
  pc: (
    <>
      <circle cx="9" cy="7" r="3" />
      <circle cx="17" cy="9" r="2" />
      <path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M14 20c0-2.2 1.3-4 3-4s3 1.8 3 4" />
    </>
  ),
  qos: (
    <>
      <path d="M4 18a8 8 0 0 1 16 0" />
      <path d="M12 18l4-6" />
      <circle cx="12" cy="18" r="1.5" />
    </>
  ),
  wifi: (
    <>
      <path d="M3 9a14 14 0 0 1 18 0M6.5 12.5a9 9 0 0 1 11 0M10 16a4 4 0 0 1 4 0" />
      <circle cx="12" cy="19" r="1" />
    </>
  ),
  lan: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 20h8M12 16v4M7 8h2M11 8h2M15 8h2" />
    </>
  ),
  wan: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  v6: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 15V9M11 9l2 6 2-6M17 9v6" />
    </>
  ),
  vpn: (
    <>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M8 21h8M12 17v4M9 11l2 2 4-4" />
    </>
  ),
  fw: (
    <path d="M12 3c3 3 6 6 6 10a6 6 0 0 1-12 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3 1-6 2-9z" />
  ),
  adm: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" />
    </>
  ),
  log: (
    <>
      <path d="M5 3h10l4 4v14H5z" />
      <path d="M15 3v4h4M8 11h8M8 15h8M8 19h5" />
    </>
  ),
  tools: (
    <>
      <path d="M14 6a4 4 0 0 0 5 5l-9 9a2 2 0 0 1-3-3l9-9z" />
      <path d="M15 9l-1-1" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </>
  ),
}

function MenuIcon({ name }: { name: IconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-[30px] fill-none stroke-soft stroke-[1.6] [stroke-linecap:round] [stroke-linejoin:round]"
    >
      {paths[name]}
    </svg>
  )
}

/* ---------- buttons ---------- */

// The router's .button_gen / .titlebtn: dark gradient, 8px radius, embossed text.
export function ButtonGen({
  href,
  onClick,
  children,
  className,
  external,
  title,
  wide = true,
  ...props
}: {
  wide?: boolean
  href?: string
  onClick?: () => void
  children: React.ReactNode
  className?: string
  external?: boolean
  title?: string
} & Omit<React.AriaAttributes, never>) {
  let cls = clsx(
    'inline-flex h-[33px] items-center justify-center gap-1.5 rounded-lg bg-btn px-3 font-menu text-xs font-bold text-white text-emboss hover:bg-btn-hover',
    wide && 'min-w-[122px]',
    className,
  )
  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener" title={title} className={cls} {...props}>
        {children}
      </a>
    )
  }
  if (href) {
    return (
      <Link href={href} title={title} className={cls} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <button type="button" onClick={onClick} title={title} className={cls} {...props}>
      {children}
    </button>
  )
}

/* ---------- left menu ---------- */

export function MainMenu({ onNavigate }: { onNavigate?: () => void }) {
  let here = locate(usePathname())

  return (
    <nav aria-label="Разделы роутера">
      {menu.map((group, gi) => (
        <div key={gi}>
          {group.split && (
            <div className="mt-2.5 min-h-[30px] w-[185px] max-lg:w-full rounded-t-[5px] border border-menu-line bg-menu-split text-center font-menu text-[13px] leading-[28px]">
              {group.split}
            </div>
          )}
          <ul role="list">
            {group.items.map((item) => {
              let active = here?.item === item
              return (
                <li key={item.title}>
                  <Link
                    href={item.tabs[0].href}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    className={clsx(
                      '-mt-0.5 flex w-[185px] items-center gap-1 border border-menu-line pl-1 font-menu text-xs font-bold text-white text-emboss max-lg:w-full',
                      item.lead ? 'h-[53px] rounded-[5px]' : 'h-[48px]',
                      active ? 'bg-selected' : 'bg-menu hover:bg-menu-hover',
                    )}
                  >
                    <span className="grid size-9 flex-none place-items-center">
                      <MenuIcon name={item.icon} />
                    </span>
                    <span className="leading-tight">{item.title}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

/* ---------- tab bar ---------- */

export function TabMenu({ here }: { here: Location }) {
  if (here.item.tabs.length < 2) return null
  return (
    <nav aria-label={`Вкладки ${here.item.title}`}>
      <ul role="list" className="flex flex-wrap gap-y-0.5 pl-[3px]">
        {here.item.tabs.map((tab) => {
          let active = tab === here.tab
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? 'page' : undefined}
                className={clsx(
                  '-ml-[3px] mr-0.5 flex min-h-[35px] items-center rounded-t-[5px] px-2 pt-[5px] pb-2 text-center font-menu text-xs text-white',
                  active ? 'bg-tab-active' : 'bg-tab hover:bg-tab-active',
                )}
              >
                {tab.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/* ---------- page head: breadcrumbs, router title, link to the real page ---------- */

// Rendered for the page's `# Title` in MDX. The title is written in the MDX
// exactly as the router prints it ("Wireless - General"), so it is also what
// the search index shows.
export function PageHead({ children }: { children: React.ReactNode }) {
  let here = locate(usePathname())
  if (!here) {
    return (
      <h1 className="mx-[5px] mt-2 mb-2.5 text-base leading-[21.6px] font-bold text-emboss">
        {children}
      </h1>
    )
  }
  let crumbs = [here.group.split, here.item.title, here.item.tabs.length > 1 ? here.tab.title : null].filter(
    (x): x is string => Boolean(x),
  )

  return (
    <header className="not-doc">
      {here.tab.asp && (
        <nav aria-label="Путь в меню роутера" className="mx-[5px] mb-1 font-menu text-[11px] text-muted">
          <ol className="flex flex-wrap items-center gap-x-1.5">
            {crumbs.map((c, i) => (
              <li key={c} className="flex items-center gap-x-1.5">
                {i > 0 && <span aria-hidden="true">›</span>}
                <span aria-current={i === crumbs.length - 1 ? 'location' : undefined}>{c}</span>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h1 className="mx-[5px] mt-2 mb-2.5 text-base leading-[21.6px] font-bold text-emboss">
          {children}
        </h1>
        {here.tab.asp && (
          <ButtonGen
            href={`${ROUTER_URL}${here.tab.asp}`}
            external
            title="Откроется эта же страница на вашем роутере. Работает из домашней сети, после входа в роутер."
            className="mr-[5px]"
          >
            Открыть в роутере <span aria-hidden="true">↗</span>
          </ButtonGen>
        )}
      </div>
      <div className="mx-[5px] my-2.5 h-0.5 bg-split" />
    </header>
  )
}

/* ---------- Apply bar with previous / next ---------- */

export function ApplyBar({ here }: { here: Location }) {
  let i = allTabs.indexOf(here)
  let prev = allTabs[i - 1]
  let next = allTabs[i + 1]
  return (
    <nav
      aria-label="Соседние страницы"
      className="not-doc mt-6 flex flex-wrap items-center justify-center gap-2.5 bg-tab-active p-2"
    >
      {prev && (
        <ButtonGen href={prev.tab.href} aria-label={`Назад: ${formTitle(prev)}`}>
          <span aria-hidden="true">‹</span> {formTitle(prev)}
        </ButtonGen>
      )}
      {next && (
        <ButtonGen href={next.tab.href} aria-label={`Дальше: ${formTitle(next)}`}>
          {formTitle(next)} <span aria-hidden="true">›</span>
        </ButtonGen>
      )}
    </nav>
  )
}

/* ---------- banner and status bar ---------- */

function MobileMenu() {
  let [open, setOpen] = useState(false)
  let pathname = usePathname()
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false)
  }, [pathname])

  return (
    <>
      <ButtonGen onClick={() => setOpen(true)} wide={false} className="lg:hidden" aria-label="Меню разделов">
        <span aria-hidden="true">☰</span> Меню
      </ButtonGen>
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50 lg:hidden">
        <DialogBackdrop className="fixed inset-0 bg-black/60" />
        <DialogPanel className="fixed inset-y-0 left-0 w-[min(20rem,100%-3rem)] overflow-y-auto bg-page px-3 pt-[max(12px,env(safe-area-inset-top))] pb-6">
          <div className="mb-2 flex justify-end">
            <ButtonGen onClick={() => setOpen(false)} wide={false} aria-label="Закрыть меню">
              ✕
            </ButtonGen>
          </div>
          <MainMenu onNavigate={() => setOpen(false)} />
        </DialogPanel>
      </Dialog>
    </>
  )
}

export function Banner() {
  let { open, modifierKey } = useSearch()
  return (
    <header className="relative flex min-h-[54px] items-center gap-x-4 sm:gap-x-6 gap-y-2 rounded-t-md bg-banner px-3.5 py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-tab">
      <MobileMenu />
      <Link href="/" className="flex items-baseline gap-3.5 text-emboss">
        <span className="text-[22px] leading-none font-bold tracking-[0.08em] text-soft italic max-sm:text-lg">
          RT-BE50
        </span>
        <span className="text-lg leading-none font-bold max-sm:hidden">Справочник</span>
      </Link>
      <div className="ml-auto flex items-center gap-2.5">
        <ButtonGen onClick={open} wide={false} aria-label="Поиск по справочнику">
          <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 fill-none stroke-current stroke-2 [stroke-linecap:round]">
            <circle cx="8.5" cy="8.5" r="5.5" />
            <path d="M12.5 12.5L17 17" />
          </svg>
          <span className="max-sm:hidden">Поиск</span>
          {modifierKey && (
            <kbd className="ml-1 font-menu text-[11px] font-normal text-muted max-sm:hidden">
              {modifierKey}K
            </kbd>
          )}
        </ButtonGen>
        <ButtonGen
          href={ROUTER_URL}
          external
          title="Веб-интерфейс вашего роутера. Работает из домашней сети."
          className="max-md:hidden"
        >
          Открыть роутер <span aria-hidden="true">↗</span>
        </ButtonGen>
      </div>
    </header>
  )
}

function U({ children }: { children: React.ReactNode }) {
  return <span className="underline underline-offset-2">{children}</span>
}

export function StatusBar() {
  return (
    <p className="bg-status py-2.5 pr-3 font-menu text-xs leading-[19px] lg:pl-[230px] max-lg:pl-3">
      <span className="mr-4 inline-block">
        Проверено на: <U>{VERIFIED.model}</U>
      </span>
      <span className="mr-4 inline-block">
        Firmware Version: <U>{VERIFIED.firmware}</U>
      </span>
      <span className="inline-block text-muted">{VERIFIED.date}</span>
    </p>
  )
}

/* ---------- bottom bar ---------- */

export function BottomBar() {
  let { open } = useSearch()
  return (
    <footer className="mt-3.5 space-y-3 px-5 pb-6 text-xs text-soft">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <a href={MANUAL_URL} target="_blank" rel="noopener" className="underline underline-offset-2">
          Manual (PDF) <span aria-hidden="true">↗</span>
        </a>
        <a href="https://www.asus.com/ru/support/" target="_blank" rel="noopener" className="underline underline-offset-2">
          Поддержка ASUS <span aria-hidden="true">↗</span>
        </a>
        <a href={REPO_URL} target="_blank" rel="noopener" className="underline underline-offset-2">
          Исходники <span aria-hidden="true">↗</span>
        </a>
        <button
          type="button"
          onClick={open}
          className="ml-auto flex h-6 w-56 max-w-full items-center gap-2 border border-input-line bg-input px-2 text-left text-xs text-soft"
        >
          <span className="font-menu font-bold">FAQ</span>
          <span className="text-muted">Найти в справочнике…</span>
        </button>
      </div>
      <p className="text-faint">
        Неофициальный справочник, с ASUS не связан. ASUS, ASUSWRT и RT-BE50 —
        товарные знаки ASUSTeK Computer Inc. Оформление повторяет интерфейс
        роутера, чтобы по нему было легче ориентироваться. © 2026 Aleksei Volkov.
        Все права защищены.
      </p>
    </footer>
  )
}
