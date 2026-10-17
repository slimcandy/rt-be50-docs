import Link from 'next/link'

import { PageHead } from '@/components/router'

export const a = Link
export { Field, Fields, HowToSearch, Item, K, K as kbd, Measure, Note, Path, Related, Sym, T } from '@/components/doc'
export { ButtonGen } from '@/components/router'

export function h1({ children }: { children: React.ReactNode }) {
  return <PageHead>{children}</PageHead>
}

// A section of a router page, drawn like the gradient header row of the
// router's form tables ("Wireless Basic Settings").
export function h2({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="mx-[5px] mt-5 scroll-mt-4 border border-b-0 border-cell-line [&:not(:has(+dl))]:border-b bg-thead py-[3px] pr-[3px] pl-2.5 text-xs leading-[21.6px] font-black text-emboss [&+:not(dl)]:mt-2.5"
    >
      {children}
    </h2>
  )
}

export function table({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-doc mx-[5px] mb-2.5 overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse border border-black text-xs [&_td]:border [&_td]:border-cell-line [&_td]:bg-td [&_td]:px-2.5 [&_td]:py-1.5 [&_th]:border [&_th]:border-cell-line [&_th]:bg-th [&_th]:px-2.5 [&_th]:py-1.5 [&_th]:text-left [&_th]:font-normal [&_thead_th]:bg-thead [&_thead_th]:font-bold">
        {children}
      </table>
    </div>
  )
}
