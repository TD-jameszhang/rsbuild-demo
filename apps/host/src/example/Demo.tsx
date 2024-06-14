import React, { useEffect, useRef, useState } from 'react'
import { useViewport } from "../utils/ViewportProvider"


function useViewShift(){
  const SEPARATOR = '-'
  const viewport = useViewport()
  const currentViewport = useRef(viewport)

  const [viewShift, setViewShift] = useState<string>(viewport)

  useEffect(() => {
    if(viewport !== currentViewport.current) {
      setViewShift(`${currentViewport.current}${SEPARATOR}${viewport}`)
    }
    console.log('prev viewport value: ', currentViewport.current)
    console.log('next viewport value: ', viewport)
    currentViewport.current = viewport
    console.log('viewShift: ', viewShift)
  }, [viewport])

  return {viewShift, setViewShift}
}

export default function Demo(){
  const {viewShift, setViewShift} = useViewShift()
  return <div>
    <span>{viewShift}</span>
    <div>
      <button onClick={() => console.log(viewShift)}>console viewShift</button>
    </div>
  </div>
}