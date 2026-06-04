export const formActionInitialState = {
  ok: false,
  message: '',
  fieldErrors: null,
  data: null
}

export function resolveFormData (prevState, formData) {
  if (formData && typeof formData.get === 'function') return formData
  if (prevState && typeof prevState.get === 'function') return prevState
  return null
}
