import React, { FunctionComponent, ReactNode, useState, useEffect, useContext, useCallback} from 'react'
import { throttle } from 'lodash'

type Size = "small" | "medium" | "large"
type Breakpoints = {
  [k in Size]: {min: number, max: number}
}
type Target = Pick<Window, 'innerWidth' | 'addEventListener' | 'removeEventListener'>

const BREAKPOINTS:Breakpoints = {
  small: {
    min: 0,
    max: 640
  },
  medium: {
    min: 641,
    max: 960
  },
  large: {
    min: 961,
    max: Infinity
  }
}

const ViewportContext = React.createContext<Size | null>(null)

function useCustomTargetResize(
  target: Target | Element,
  handleResize: any,
  resizeCallback: any
) {
  useEffect(() => {
    if(!target || !(target instanceof Window) || !target.addEventListener){
      return
    }
    target.addEventListener('resize', handleResize, true)

    return () => {
      resizeCallback.cancel()

      if(!target || !target.removeEventListener) return;

      target.removeEventListener('resize', handleResize, true)
    }
  }, [target, resizeCallback, handleResize])

  useEffect(() => {
    if(!target || !(target instanceof Element)) return;

    const observer = new ResizeObserver(handleResize);
    observer.observe(target)

    return () => {
      resizeCallback.cancel()

      if(!target) return

      observer.unobserve(target)
      observer.disconnect()
    }
  }, [target, resizeCallback, handleResize])
}

function getWidthBaseOnTarget(target: Target | HTMLElement) {
  if(target instanceof HTMLElement) return target.offsetWidth;
  return target.innerWidth
}

const useViewport = ():Size => {
  const viewport = useContext(ViewportContext)

  if(!viewport){
    throw new Error("You must use a ViewportProvider to get a viewport.")
  }
  return viewport
}

const getViewportMatch = (target: Target | HTMLElement): Size | null => {
  const width = getWidthBaseOnTarget(target)

  let breakpoint: Size

  for(breakpoint in BREAKPOINTS){
    const {min, max} = BREAKPOINTS[breakpoint]
    if(width >= min && width <= max) return breakpoint
  }
  return null
}

const Provider:FunctionComponent<{
  children: ReactNode,
  target?: Target | HTMLElement
}> = ({children, target = window}) => {
  const [viewport, setViewport] = useState<Size | null>(getViewportMatch(target))

  const setNewSize = useCallback(() => {
    // @ts-ignore
    setViewport(getViewportMatch(target))
  }, [target])

  const resizeCallback = useCallback(throttle(setNewSize, 200), [])
  const handleResize = useCallback(() => {
    resizeCallback()
  }, [resizeCallback])

  // @ts-ignore
  useCustomTargetResize(target, handleResize, resizeCallback);

  useEffect(() => {
    setNewSize()
  }, [target, setNewSize])

  return (
    <ViewportContext.Provider value={viewport}>
      {children}
    </ViewportContext.Provider>
  )
}

const ViewportProvider:React.FC<{
  children: ReactNode,
  target?: HTMLElement
}> = ({children, target}) => <Provider target={target}>{children}</Provider>

export {
  ViewportContext,
  Provider,
  useViewport,
  BREAKPOINTS
}

export default ViewportProvider
