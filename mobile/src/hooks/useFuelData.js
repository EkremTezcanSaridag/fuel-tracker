import { useEffect, useState } from 'react'
import { fallbackFuelData, loadFuelData } from '../services/fuelData'

export function useFuelData() {
  const [state, setState] = useState({
    data: fallbackFuelData,
    loading: true,
  })

  useEffect(() => {
    let isMounted = true

    loadFuelData().then((data) => {
      if (!isMounted) {
        return
      }

      setState({
        data,
        loading: false,
      })
    })

    return () => {
      isMounted = false
    }
  }, [])

  return state
}
