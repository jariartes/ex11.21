import blogService from '../services/blogs'
import loginService from '../services/login'
import { setMessage } from '../reducers/notificationReducer'


const userReducer = (state = null, action) => {
  switch (action.type) {

  case 'SET_USER':
    //console.log('set_user action', action)
    return action.user

  case 'UNSET_USER':
    return null

  default:
    return state
  }
}

const setUser = (user) => {
  return {
    type: 'SET_USER',
    user: user
  }
}

const unsetUser = () => {
  return {
    type: 'UNSET_USER'
  }
}

export const logoutUser = (user) => {
  return dispatch => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(setMessage({ type: 'notification', message: `${user.name} logged out` }))
    dispatch(unsetUser())
  }
}


export const loginUser = (credentials) => {
  return async dispatch => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      dispatch(setUser(user))
      dispatch(setMessage({ type: 'notification', message: `user ${user.name} logged in` }))
    } catch (exception) {
      console.log('exception', exception)
      dispatch(setMessage({ type: 'error', message: 'invalid username or password' }))
    }
  }
}

export const initializeUser = () => {
  return dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    //console.log('user', loggedUserJSON)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }
}

export default userReducer