const notificationReducer = (state = {}, action) => {
  switch (action.type) {

  case 'SET_MESSAGE':
    return {
      id: action.id,
      type: action.message.type,
      message: action.message.message
    }

  case 'CLEAR_MESSAGE':
    return {}

  default:
    return state
  }
}

export const setMessage = (message) => {
  return (dispatch, getState) => {
    const nState = getState().notification
    if ( nState.id )
      clearTimeout(nState.id)
    const id = setTimeout(() => {
      dispatch({ type: 'CLEAR_MESSAGE' })
    }, 5000)

    dispatch({
      type: 'SET_MESSAGE',
      message,
      id
    })
  }
}

export default notificationReducer