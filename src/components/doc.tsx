// Building blocks for guide pages, drawn like the router's own form tables so
// that a field in the guide looks like the same field on the router.

import slugify from '@sindresorhus/slugify'
import clsx from 'clsx'
import Link from 'next/link'
import { Fragment } from 'react'

import { glossary } from '@/data/glossary'

/* ---------- inline ---------- */

// A button, menu item or value as labelled in the router: <K>Apply</K>.
export function K({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="mx-px rounded-[4px] border border-black/60 bg-btn px-1.5 py-px font-menu text-[11px] leading-[18px] font-bold text-white text-emboss [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
      {children}
    </kbd>
  )
}

// An abbreviation with its expansion from the glossary: <T>SSID</T>.
export function T({ children }: { children: string }) {
  let entry = glossary[children]
  if (!entry) return <>{children}</>
  return (
    <abbr
      title={`${children} — ${entry.full}: ${entry.plain}`}
      className="cursor-help underline decoration-muted decoration-dotted underline-offset-[3px]"
    >
      {children}
    </abbr>
  )
}

// A symbol instead of a word; the word stays for screen readers and tooltips.
export function Sym({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span role="img" aria-label={label} title={label}>
      {children}
    </span>
  )
}

// A path through the router's menu: <Path items={['Wireless', 'General']} />.
export function Path({ items }: { items: Array<string> }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-1 gap-y-1 align-middle">
      {items.map((item, i) => (
        <Fragment key={item}>
          {i > 0 && (
            <span aria-hidden="true" className="text-muted">
              ›
            </span>
          )}
          <K>{item}</K>
        </Fragment>
      ))}
    </span>
  )
}

/* ---------- notes ---------- */

const tones = {
  warn: { sym: '⚠︎', label: 'Внимание', border: 'border-l-hint' },
  ok: { sym: '✓', label: 'Хорошо', border: 'border-l-ok' },
  bad: { sym: '✕', label: 'Опасно', border: 'border-l-bad' },
  info: { sym: 'ⓘ', label: 'Заметка', border: 'border-l-menu-hover' },
}

export function Note({
  tone = 'warn',
  children,
}: {
  tone?: keyof typeof tones
  children: React.ReactNode
}) {
  let t = tones[tone]
  return (
    <div
      className={clsx(
        'not-doc mx-[5px] my-2.5 flex gap-2.5 border border-l-4 border-tab-active bg-well px-3 py-2 text-[12.5px] leading-[1.55]',
        t.border,
      )}
    >
      <Sym label={t.label}>
        <span aria-hidden="true" className="font-bold">
          {t.sym}
        </span>
      </Sym>
      <div className="[&_a]:text-link [&_a]:underline [&_p+p]:mt-1.5">{children}</div>
    </div>
  )
}

/* ---------- field table ---------- */

// The router's .FormTable: th 26%, control 24%, explanation in the rest.
export function Fields({ children }: { children: React.ReactNode }) {
  return (
    <dl className="not-doc mx-[5px] mb-2.5 border-t border-l border-cell-line text-xs">
      {children}
    </dl>
  )
}

type Kind = 'select' | 'radio' | 'switch' | 'check' | 'text' | 'info'

function inferKind(options?: Array<string>): Kind | undefined {
  if (!options) return undefined
  let set = options.join('|').toLowerCase()
  if (set === 'on|off' || set === 'off|on') return 'switch'
  if (set === 'yes|no' || set === 'no|yes') return 'radio'
  return 'select'
}

function Recommended() {
  return (
    <Sym label="рекомендуется">
      <span aria-hidden="true"> ✓</span>
    </Sym>
  )
}

function Control({
  kind,
  options = [],
  recommended,
  example,
}: {
  kind: Kind
  options?: Array<string>
  recommended?: string
  example?: string
}) {
  if (kind === 'switch') {
    let on = recommended?.toUpperCase() === 'ON'
    let known = recommended !== undefined
    return (
      <span className="inline-flex items-center gap-2">
        <span
          aria-hidden="true"
          className={clsx(
            'relative inline-block h-[18px] w-[38px] rounded-full border border-black/50',
            on ? 'bg-sel-e' : 'bg-input',
          )}
        >
          <span
            className={clsx(
              'absolute top-px size-[14px] rounded-full bg-white shadow',
              on ? 'right-px' : 'left-px',
            )}
          />
        </span>
        <span className={clsx('font-mono', known && 'text-hint')}>
          {known ? recommended : 'ON / OFF'}
          {known && <Recommended />}
        </span>
      </span>
    )
  }

  if (kind === 'radio' || kind === 'check') {
    return (
      <span className="flex flex-wrap gap-x-3 gap-y-1">
        {options.map((o) => {
          let on = o === recommended
          return (
            <span key={o} className={clsx('inline-flex items-center gap-1', on && 'text-hint')}>
              <span
                aria-hidden="true"
                className={clsx(
                  'inline-block size-3 border',
                  kind === 'radio' ? 'rounded-full' : 'rounded-[2px]',
                  on ? 'border-sel-e bg-white shadow-[inset_0_0_0_3px_var(--color-sel-e)]' : 'border-soft bg-white',
                )}
              />
              {o}
              {on && <Recommended />}
            </span>
          )
        })}
      </span>
    )
  }

  if (kind === 'text' || kind === 'info') {
    return (
      <span
        className={clsx(
          'inline-block min-w-[90px] max-w-full truncate font-mono text-[12px] leading-[23px]',
          kind === 'text' ? 'h-[25px] border border-input-line bg-input px-1.5 text-soft' : 'text-hint',
        )}
      >
        {example ?? ''}
      </span>
    )
  }

  // select
  let shown = recommended ?? options[0]
  return (
    <span className="block">
      <span
        className={clsx(
          'relative inline-flex h-[25px] max-w-full items-center border-y border-input-line bg-input pr-5 pl-1.5 font-mono text-[13px]',
          recommended ? 'text-hint' : 'text-white',
        )}
      >
        <span className="truncate">{shown}</span>
        <span aria-hidden="true" className="absolute top-[9px] right-1.5 border-4 border-transparent border-t-white" />
      </span>
      {options.length > 1 && (
        <span className="mt-1 block text-[11px] leading-[1.35] text-soft">
          <span className="text-muted">варианты: </span>
          {options.map((o, i) => (
            <Fragment key={o}>
              {i > 0 && <span className="text-muted"> · </span>}
              <span className={clsx('font-mono whitespace-nowrap', o === recommended && 'font-bold text-hint')}>
                {o}
                {o === recommended && <Recommended />}
              </span>
            </Fragment>
          ))}
        </span>
      )}
    </span>
  )
}

// One setting of a router page. `name` is exactly the label the router shows,
// so ⌘K finds it; `aka` is what the same thing is called elsewhere.
export function Field({
  name,
  aka,
  kind,
  options,
  recommended,
  example,
  id,
  children,
}: {
  name: string
  aka?: string
  kind?: Kind
  options?: Array<string>
  recommended?: string
  example?: string
  id?: string
  children: React.ReactNode
}) {
  let anchor = id ?? slugify(name)
  let k = kind ?? inferKind(options)
  let cell = 'border-r border-b border-cell-line'

  return (
    <div id={anchor} className="group scroll-mt-4 target:outline-2 target:outline-hint sm:grid sm:grid-cols-[26%_24%_1fr]">
      <dt className={clsx(cell, 'bg-th py-1.5 pr-1 pl-2.5 leading-[15px] sm:flex sm:min-h-[30px] sm:flex-col sm:justify-center')}>
        <a href={`#${anchor}`} className="hover:underline">
          {name}
        </a>
        {aka && <span className="mt-0.5 block text-[11px] text-muted">также: {aka}</span>}
      </dt>
      {k && (
        <dd className={clsx(cell, 'bg-td px-2.5 py-1.5 sm:flex sm:items-center')}>
          <span className="sr-only">Значения: </span>
          <Control kind={k} options={options} recommended={recommended} example={example} />
        </dd>
      )}
      <dd
        className={clsx(
          cell,
          'bg-td px-2.5 py-1.5 leading-[1.5] [&_p+p]:mt-1.5 [&_a]:text-link [&_a]:underline [&_a]:underline-offset-[3px] [&_ul]:list-disc [&_ul]:pl-4',
          !k && 'sm:col-span-2',
          k && 'max-sm:border-t-0 max-sm:pt-0',
        )}
      >
        {children}
      </dd>
    </div>
  )
}

/* ---------- a plain table in the router's style, for reference blocks ---------- */

function Table({
  title,
  id,
  children,
}: {
  title: string
  id: string
  children: React.ReactNode
}) {
  return (
    <section aria-labelledby={id} className="not-doc mx-[5px] mt-5 mb-2.5 text-xs">
      <h2 id={id} className="border border-cell-line bg-thead py-[3px] pr-[3px] pl-2.5 leading-[21.6px] font-black text-emboss">
        {title}
      </h2>
      <dl className="border-l border-cell-line">{children}</dl>
    </section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="sm:grid sm:grid-cols-[26%_1fr]">
      <dt className="border-r border-b border-cell-line bg-th py-1.5 pr-1 pl-2.5 leading-[15px] sm:flex sm:items-center">
        {label}
      </dt>
      <dd className="border-r border-b border-cell-line bg-td px-2.5 py-2 leading-[1.5] [&_a:not(.ref)]:text-link [&_a:not(.ref)]:underline [&_a:not(.ref)]:underline-offset-[3px] [&_p+p]:mt-1.5 [&_ul]:list-disc [&_ul]:space-y-0.5 [&_ul]:pl-4">
        {children}
      </dd>
    </div>
  )
}

/* ---------- guide-to-the-guides blocks ---------- */

type Ref = { href: string; title: string; note?: string }

function hostOf(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

function LinkList({ items }: { items: Array<Ref> }) {
  return (
    <ul role="list" className="list-none! space-y-1.5 pl-0!">
      {items.map((item) => {
        let external = /^https?:/.test(item.href)
        let content = (
          <>
            <span className="text-white underline decoration-white/40 underline-offset-[3px] group-hover:decoration-white">
              {item.title}
            </span>
            {external && <span aria-hidden="true"> ↗</span>}
            <span className="ml-1.5 text-[11px] text-muted">{item.note ?? (external ? hostOf(item.href) : '')}</span>
          </>
        )
        return (
          <li key={item.href} className="leading-[1.45]">
            {external ? (
              <a href={item.href} target="_blank" rel="noopener" className="ref group">
                {content}
              </a>
            ) : (
              <Link href={item.href} className="ref group">
                {content}
              </Link>
            )}
          </li>
        )
      })}
    </ul>
  )
}

// "Read on": official ASUS articles, explanations of the idea, pages nearby.
export function Related({
  official = [],
  learn = [],
  here = [],
}: {
  official?: Array<Ref>
  learn?: Array<Ref>
  here?: Array<Ref>
}) {
  return (
    <Table title="Читать дальше" id="related">
      {official.length > 0 && (
        <Row label="Официально у ASUS">
          <LinkList items={official} />
        </Row>
      )}
      {learn.length > 0 && (
        <Row label="Понять глубже">
          <LinkList items={learn} />
        </Row>
      )}
      {here.length > 0 && (
        <Row label="Рядом в справочнике">
          <LinkList items={here} />
        </Row>
      )}
    </Table>
  )
}

// One item of a checklist: a router-style table with where the setting lives,
// what it does, its pros and cons, and sources. Rows are <Item label="…">.
export function Measure({
  title,
  path,
  refs = [],
  id,
  children,
}: {
  title: string
  path?: Array<string>
  refs?: Array<Ref>
  id?: string
  children: React.ReactNode
}) {
  let anchor = id ?? slugify(title)
  return (
    <section id={anchor} aria-labelledby={`${anchor}-title`} className="not-doc mx-[5px] mt-4 mb-2.5 scroll-mt-4 text-xs">
      <h3
        id={`${anchor}-title`}
        className="flex items-baseline gap-2 border border-cell-line bg-thead py-[3px] pr-[3px] pl-2.5 leading-[21.6px] font-black text-emboss"
      >
        <span aria-hidden="true" className="font-normal">
          ☐
        </span>
        <a href={`#${anchor}`}>{title}</a>
      </h3>
      <dl className="border-l border-cell-line">
        {path && (
          <Row label="Где в роутере">
            <Path items={path} />
          </Row>
        )}
        {children}
        {refs.length > 0 && (
          <Row label="Источники">
            <LinkList items={refs} />
          </Row>
        )}
      </dl>
    </section>
  )
}

export function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return <Row label={label}>{children}</Row>
}

// "How to google it": what the thing is called in the interface, what else it
// is called, and ready-made queries.
export function HowToSearch({
  queries,
  children,
}: {
  queries: Array<string>
  children?: React.ReactNode
}) {
  return (
    <Table title="Как это искать" id="how-to-search">
      {children && <Row label="Как это называют">{children}</Row>}
      <Row label="Готовые запросы">
        <ul role="list" className="flex list-none! flex-wrap gap-1.5 pl-0!">
          {queries.map((q) => (
            <li key={q}>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(q)}`}
                target="_blank"
                rel="noopener"
                className="ref inline-flex h-[23px] items-center gap-1.5 border border-input-line bg-input px-2 font-mono text-[12px] hover:border-hint hover:text-hint"
              >
                <span aria-hidden="true">⌕</span>
                {q}
              </a>
            </li>
          ))}
        </ul>
      </Row>
    </Table>
  )
}
