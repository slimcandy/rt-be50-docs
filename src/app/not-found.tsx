import { ButtonGen } from '@/components/router'

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="text-base font-bold text-emboss">404</p>
      <h1 className="mt-2 text-[13px]">Такой страницы в справочнике нет.</h1>
      <p className="mt-6">
        <ButtonGen href="/">На главную</ButtonGen>
      </p>
    </div>
  )
}
