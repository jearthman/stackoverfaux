import { useEffect, useState } from "react";

/**
 * A custom hook that returns a debounced version of a value.
 * Debouncing ensures that the value only updates after a specified delay
 * of no changes, which helps reduce unnecessary operations.
 *
 * @param value The value to debounce
 * @param delay The delay in milliseconds (default: 500ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay = 500) {
  // Store the debounced value in state
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up a timer that will update the debounced value after the specified delay
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if:
    // 1. The value changes before the delay has passed
    // 2. The component unmounts
    // This prevents memory leaks and ensures we don't update state after unmounting
    return () => clearTimeout(timeout);
  }, [value, delay]); // Effect runs when value or delay changes

  return debouncedValue;
}
