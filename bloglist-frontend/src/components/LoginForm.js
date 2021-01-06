import React from 'react'
import { loginUser } from '../reducers/userReducer'
import useField from '../hooks'
import { useDispatch } from 'react-redux'
import { Form, Button } from 'react-bootstrap'


const LoginForm = () => {

  const username = useField('text')
  const password = useField('password')

  const dispatch = useDispatch()

  const handleLogin = event => {
    event.preventDefault()
    dispatch(loginUser({
      username: username.value,
      password: password.value
    }))
    username.clear()
    password.clear()
  }

  return (
    <div>
      <h2>log in to application</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label>username</Form.Label>
          <Form.Control {...username} />
          <Form.Label>password</Form.Label>
          <Form.Control {...password} />
          <Button variant="primary" id='login' type="submit">
            login
          </Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default LoginForm