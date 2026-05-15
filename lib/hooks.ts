/**
 * Custom hooks for common component patterns
 * Enables reusable component logic
 */

import { useState, useCallback, useRef, useEffect, ReactNode } from 'react'

/**
 * Hook for managing form field state
 */
export const useField = <T = string>(
  initialValue: T,
  onValidate?: (value: T) => boolean,
) => {
  const [value, setValue] = useState<T>(initialValue)
  const [error, setError] = useState<string | null>(null)

  const validate = useCallback(
    (v: T) => {
      if (onValidate && !onValidate(v)) {
        setError('Invalid value')
        return false
      }
      setError(null)
      return true
    },
    [onValidate],
  )

  return {
    value,
    setValue,
    error,
    setError,
    validate,
    reset: () => {
      setValue(initialValue)
      setError(null)
    },
  }
}

/**
 * Hook for managing async data loading
 */
export const useAsync = <T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate = true,
) => {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [value, setValue] = useState<T | null>(null)
  const [error, setError] = useState<E | null>(null)

  const execute = useCallback(async () => {
    setStatus('pending')
    setValue(null)
    setError(null)

    try {
      const response = await asyncFunction()
      setValue(response)
      setStatus('success')
      return response
    } catch (error) {
      setError(error as E)
      setStatus('error')
    }
  }, [asyncFunction])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { execute, status, value, error }
}

/**
 * Hook for managing list state with common operations
 */
export const useList = <T extends { id?: any }>(initialList: T[] = []) => {
  const [list, setList] = useState<T[]>(initialList)

  const add = useCallback(
    (item: T) => {
      setList((prev) => [...prev, item])
    },
    [],
  )

  const remove = useCallback(
    (id: any) => {
      setList((prev) => prev.filter((item) => item.id !== id))
    },
    [],
  )

  const update = useCallback(
    (id: any, updates: Partial<T>) => {
      setList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
      )
    },
    [],
  )

  const reset = useCallback(() => {
    setList(initialList)
  }, [initialList])

  const clear = useCallback(() => {
    setList([])
  }, [])

  const move = useCallback(
    (fromIndex: number, toIndex: number) => {
      setList((prev) => {
        const newList = [...prev]
        const [removed] = newList.splice(fromIndex, 1)
        newList.splice(toIndex, 0, removed)
        return newList
      })
    },
    [],
  )

  return {
    list,
    add,
    remove,
    update,
    reset,
    clear,
    move,
    length: list.length,
  }
}

/**
 * Hook for managing toggle/checkbox state
 */
export const useToggle = (initialValue: boolean = false) => {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue((v) => !v)
  }, [])

  const setTrue = useCallback(() => {
    setValue(true)
  }, [])

  const setFalse = useCallback(() => {
    setValue(false)
  }, [])

  return { value, toggle, setTrue, setFalse, setValue }
}

/**
 * Hook for managing modal/dialog state
 */
export const useModal = (initialOpen: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen)

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggle = useCallback(() => {
    setIsOpen((v) => !v)
  }, [])

  return { isOpen, open, close, toggle }
}

/**
 * Hook for managing previous value
 */
export const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

/**
 * Hook for managing debounced value
 */
export const useDebouncedValue = <T,>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook for managing click outside
 */
export const useClickOutside = <T extends HTMLElement>(callback: () => void) => {
  const ref = useRef<T>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [callback])

  return ref
}

/**
 * Hook for managing keyboard shortcuts
 */
export const useKeyboard = (key: string, callback: () => void, options = {}) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === key || event.code === key) {
        callback()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [key, callback])
}

/**
 * Hook for managing scroll position
 */
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return scrollPosition
}

/**
 * Hook for managing window size
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

/**
 * Hook for managing controlled input
 */
export const useInput = (initialValue: string = '') => {
  const [value, setValue] = useState(initialValue)

  const bind = {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
  }

  const reset = () => setValue(initialValue)

  return { value, setValue, bind, reset }
}

/**
 * Hook for managing local storage
 */
export const useLocalStorage = <T,>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.error(error)
      }
    },
    [key, storedValue],
  )

  return [storedValue, setValue]
}

/**
 * Hook for managing tabs/accordion state
 */
export const useTabs = (initialTab: string | number = 0) => {
  const [activeTab, setActiveTab] = useState(initialTab)

  const handleTabChange = useCallback((tab: string | number) => {
    setActiveTab(tab)
  }, [])

  return { activeTab, handleTabChange }
}

/**
 * Hook for managing stepper/wizard state
 */
export const useStepper = (steps: number = 3, initialStep: number = 0) => {
  const [currentStep, setCurrentStep] = useState(initialStep)

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps - 1))
  }, [steps])

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }, [])

  const goToStep = useCallback(
    (step: number) => {
      setCurrentStep(Math.max(0, Math.min(step, steps - 1)))
    },
    [steps],
  )

  const reset = useCallback(() => {
    setCurrentStep(initialStep)
  }, [initialStep])

  return {
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    reset,
    isFirst: currentStep === 0,
    isLast: currentStep === steps - 1,
    progress: ((currentStep + 1) / steps) * 100,
  }
}

/**
 * Hook for managing state history
 */
export const useHistory = <T,>(initialState: T) => {
  const [state, setState] = useState<T>(initialState)
  const [history, setHistory] = useState<T[]>([initialState])
  const [historyIndex, setHistoryIndex] = useState(0)

  const updateState = useCallback(
    (newState: T | ((prev: T) => T)) => {
      const value = newState instanceof Function ? newState(state) : newState
      setState(value)
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), value])
      setHistoryIndex((prev) => prev + 1)
    },
    [state, historyIndex],
  )

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1)
      setState(history[historyIndex - 1])
    }
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1)
      setState(history[historyIndex + 1])
    }
  }, [history, historyIndex])

  return {
    state,
    updateState,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  }
}
