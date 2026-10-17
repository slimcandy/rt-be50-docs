'use client'

// ⌘K search over every page, section and field of the guide. The index is
// built at compile time by src/mdx/search.mjs (FlexSearch). Logic follows the
// Tailwind Plus Protocol template; the look follows the router's UI.

import {
  createAutocomplete,
  type AutocompleteApi,
  type AutocompleteCollection,
  type AutocompleteState,
} from '@algolia/autocomplete-core'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import clsx from 'clsx'
import { usePathname, useRouter } from 'next/navigation'
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import Highlighter from 'react-highlight-words'

import { formTitle, locate } from '@/data/menu'
import { type Result } from '@/mdx/search.mjs'

type EmptyObject = Record<string, never>

type Autocomplete = AutocompleteApi<
  Result,
  React.SyntheticEvent,
  React.MouseEvent,
  React.KeyboardEvent
>

const SearchContext = createContext<{
  open: () => void
  modifierKey: string | undefined
}>({ open: () => {}, modifierKey: undefined })

export function useSearch() {
  return useContext(SearchContext)
}

function useAutocomplete({ onNavigate }: { onNavigate: () => void }) {
  let id = useId()
  let router = useRouter()
  let [autocompleteState, setAutocompleteState] = useState<
    AutocompleteState<Result> | EmptyObject
  >({})

  function navigate({ itemUrl }: { itemUrl?: string }) {
    if (itemUrl) {
      router.push(itemUrl)
    }
    onNavigate()
  }

  let [autocomplete] = useState<Autocomplete>(() =>
    createAutocomplete<
      Result,
      React.SyntheticEvent,
      React.MouseEvent,
      React.KeyboardEvent
    >({
      id,
      placeholder: 'Поле, настройка или вопрос: «скрытая сеть», «WPS», «DNS»',
      defaultActiveItemId: 0,
      onStateChange({ state }) {
        setAutocompleteState(state)
      },
      shouldPanelOpen({ state }) {
        return state.query !== ''
      },
      navigator: { navigate },
      getSources({ query }) {
        return import('@/mdx/search.mjs').then(({ search }) => [
          {
            sourceId: 'guide',
            getItems() {
              return search(query, { limit: 8 })
            },
            getItemUrl({ item }) {
              return item.url
            },
            onSelect: navigate,
          },
        ])
      },
    }),
  )

  return { autocomplete, autocompleteState }
}

function HighlightQuery({ text, query }: { text: string; query: string }) {
  return (
    <Highlighter
      highlightClassName="bg-transparent text-hint underline"
      searchWords={[query]}
      autoEscape={true}
      textToHighlight={text}
    />
  )
}

function SearchResult({
  result,
  autocomplete,
  collection,
  query,
}: {
  result: Result
  autocomplete: Autocomplete
  collection: AutocompleteCollection<Result>
  query: string
}) {
  let id = useId()
  let here = locate(result.url.split('#')[0])
  let where = here ? formTitle(here) : result.pageTitle

  return (
    <li
      className="group block cursor-default border-t border-cell-line bg-th px-3 py-2 first:border-t-0 aria-selected:bg-selected"
      aria-labelledby={`${id}-where ${id}-title`}
      {...autocomplete.getItemProps({ item: result, source: collection.source })}
    >
      <div id={`${id}-title`} aria-hidden="true" className="text-[13px] font-bold text-emboss">
        <HighlightQuery text={result.title} query={query} />
      </div>
      {where && where !== result.title && (
        <div id={`${id}-where`} aria-hidden="true" className="mt-0.5 truncate font-menu text-[11px] text-muted group-aria-selected:text-white">
          {here?.group.split && <>{here.group.split} › </>}
          {where}
        </div>
      )}
    </li>
  )
}

function SearchResults({
  autocomplete,
  query,
  collection,
}: {
  autocomplete: Autocomplete
  query: string
  collection: AutocompleteCollection<Result>
}) {
  if (collection.items.length === 0) {
    return (
      <p className="bg-td px-4 py-5 text-center text-xs text-soft">
        По запросу <strong className="text-hint">«{query}»</strong> ничего нет.
        Попробуйте другое слово или английское название поля, как оно написано
        в роутере.
      </p>
    )
  }
  return (
    <ul {...autocomplete.getListProps()}>
      {collection.items.map((result) => (
        <SearchResult
          key={result.url}
          result={result}
          autocomplete={autocomplete}
          collection={collection}
          query={query}
        />
      ))}
    </ul>
  )
}

const SearchInput = forwardRef<
  React.ComponentRef<'input'>,
  {
    autocomplete: Autocomplete
    autocompleteState: AutocompleteState<Result> | EmptyObject
    onClose: () => void
  }
>(function SearchInput({ autocomplete, autocompleteState, onClose }, inputRef) {
  let inputProps = autocomplete.getInputProps({ inputElement: null })

  return (
    <div className="p-2.5">
      <input
        ref={inputRef}
        data-autofocus
        className="h-9 w-full appearance-none border border-input-line bg-input px-2.5 text-[13px] text-white outline-hidden placeholder:text-soft/80 focus:border-hint [&::-webkit-search-cancel-button]:hidden"
        {...inputProps}
        onKeyDown={(event) => {
          if (
            event.key === 'Escape' &&
            !autocompleteState.isOpen &&
            autocompleteState.query === ''
          ) {
            // Safari can jump to the bottom of the page when the dialog closes
            // from the input; blurring first avoids it.
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur()
            }
            onClose()
          } else {
            inputProps.onKeyDown(event)
          }
        }}
      />
    </div>
  )
})

function SearchDialog({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) {
  let formRef = useRef<React.ComponentRef<'form'>>(null)
  let inputRef = useRef<React.ComponentRef<typeof SearchInput>>(null)
  let { autocomplete, autocompleteState } = useAutocomplete({
    onNavigate() {
      setOpen(false)
    },
  })

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false)
        autocomplete.setQuery('')
      }}
      className="fixed inset-0 z-50"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/60" />
      <div className="fixed inset-0 overflow-y-auto px-4 py-4 sm:py-20 lg:py-[12vh]">
        <DialogPanel className="mx-auto overflow-hidden rounded-[3px] border border-tab-active bg-form shadow-2xl shadow-black/60 sm:max-w-xl">
          <div className="bg-thead px-2.5 py-1 text-xs font-bold text-emboss">
            Поиск по справочнику
          </div>
          <div {...autocomplete.getRootProps({})}>
            <form
              ref={formRef}
              {...autocomplete.getFormProps({
                inputElement: inputRef.current,
              })}
            >
              <SearchInput
                ref={inputRef}
                autocomplete={autocomplete}
                autocompleteState={autocompleteState}
                onClose={() => setOpen(false)}
              />
              <div
                className={clsx(
                  'mx-2.5 mb-2.5 max-h-[60vh] overflow-y-auto border border-cell-line empty:hidden',
                )}
                {...autocomplete.getPanelProps({})}
              >
                {autocompleteState.isOpen && (
                  <SearchResults
                    autocomplete={autocomplete}
                    query={autocompleteState.query}
                    collection={autocompleteState.collections[0]}
                  />
                )}
              </div>
            </form>
          </div>
          <p className="border-t border-tab-active px-2.5 py-1.5 font-menu text-[11px] text-muted">
            <kbd>↑</kbd> <kbd>↓</kbd> выбрать · <kbd>↵</kbd> открыть ·{' '}
            <kbd>esc</kbd> закрыть
          </p>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  let [isOpen, setIsOpen] = useState(false)
  let [modifierKey, setModifierKey] = useState<string>()
  let pathname = usePathname()

  useEffect(() => {
    setModifierKey(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? '⌘' : 'Ctrl ')
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setIsOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  let open = useCallback(() => setIsOpen(true), [])

  return (
    <SearchContext.Provider value={{ open, modifierKey }}>
      {children}
      <SearchDialog open={isOpen} setOpen={setIsOpen} />
    </SearchContext.Provider>
  )
}
