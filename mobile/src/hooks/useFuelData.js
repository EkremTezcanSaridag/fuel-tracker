import { useCallback, useEffect, useState } from 'react'
import { fallbackFuelData, loadFuelData } from '../services/fuelData'

export function useFuelData() {
  const [state, setState] = useState({
    data: fallbackFuelData,
    loading: true,
    refreshing: false,
  })

  const refresh = useCallback(async () => {
    setState((current) => ({
      ...current,
      refreshing: true,
    }))

    const data = await loadFuelData({ refresh: true })

    setState({
      data,
      loading: false,
      refreshing: false,
    })
  }, [])

  useEffect(() => {
    let isMounted = true

    loadFuelData().then((data) => {
      if (!isMounted) {
        return
      }

      setState({
        data,
        loading: false,
        refreshing: false,
      })
    })

    return () => {
      isMounted = false
    }
  }, [])

  return {
    ...state,
    refresh,
  }
}
