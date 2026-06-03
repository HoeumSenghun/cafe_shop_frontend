export function resolveFormData (prevState, formData) {
  if (formData && typeof formData.get === 'function') return formData
  if (prevState && typeof prevState.get === 'function') return prevState
  return null
}
