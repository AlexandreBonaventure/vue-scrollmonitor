/**
 * Generate a unique id
 */
export const generateId = (numbers = 7) => {
  const uniqueKey = Math.random().toString(36).substr(2, (2 + numbers)) // should be unique because of the seed
  return `_${uniqueKey}`
}
