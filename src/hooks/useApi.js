import { useState, useEffect, useCallback } from 'react'

export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedApiFunction = useCallback(apiFunction, dependencies)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await memoizedApiFunction()
        if (isMounted) {
          setData(result)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Une erreur est survenue')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [memoizedApiFunction])

  const refetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await memoizedApiFunction()
      setData(result)
    } catch (err) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }, [memoizedApiFunction])

  return { data, loading, error, refetch }
}
