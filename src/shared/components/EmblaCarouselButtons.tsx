import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react'

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean
  nextBtnDisabled: boolean
  onPrevButtonClick: () => void
  onNextButtonClick: () => void
}

export const usePrevNextButtons = (
  emblaApi: any,
  onButtonClick?: (emblaApi: any) => void
): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollPrev()
    if (onButtonClick) onButtonClick(emblaApi)
  }, [emblaApi, onButtonClick])

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollNext()
    if (onButtonClick) onButtonClick(emblaApi)
  }, [emblaApi, onButtonClick])

  const onSelect = useCallback((emblaApi: any) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on('reInit', onSelect)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  }
}

type DotButtonProps = PropsWithChildren<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
>

export const DotButton: React.FC<DotButtonProps & { selected: boolean }> = (props) => {
  const { children, selected, ...restProps } = props

  return (
    <button type="button" {...restProps} className={`h-3 w-3 mx-1 rounded-full ${selected ? 'bg-white' : 'bg-white/50'}`} />
  )
}

type PrevNextButtonProps = PropsWithChildren<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & {
    enabled: boolean
  }
>

export const PrevButton: React.FC<PrevNextButtonProps> = (props) => {
  const { children, enabled, ...restProps } = props

  return (
    <button
      className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full disabled:opacity-50"
      disabled={!enabled}
      {...restProps}
    >
      <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {children}
    </button>
  )
}

export const NextButton: React.FC<PrevNextButtonProps> = (props) => {
  const { children, enabled, ...restProps } = props

  return (
    <button
      className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full disabled:opacity-50"
      disabled={!enabled}
      {...restProps}
    >
      <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      {children}
    </button>
  )
}
