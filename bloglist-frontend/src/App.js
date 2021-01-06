import React, { useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import Users from './components/Users'
import User from './components/User'
import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser, logoutUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/usersReducer'
import { Switch, Route, useHistory, useRouteMatch, Link } from 'react-router-dom'
import { Form, Navbar, Nav, Button } from 'react-bootstrap'


const App = () => {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
    dispatch(initializeUsers())
  }, [dispatch])


  const user = useSelector(state => state.user)
  //const users = useSelector(state => state.users)

  const history = useHistory()

  let match = useRouteMatch('/users/:id')
  const userId = match ? match.params.id : null

  match = useRouteMatch('/blogs/:id')
  const blogId = match ? match.params.id : null

  const logoutHandler = () => {
    dispatch(logoutUser(user))
    history.push('/')
  }


  const menu = () => (
    <Navbar collapseOnSelect bg="light" expand="lg" variant="light">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#" as="span">
            <Link to="/">blogs</Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            <Link to="/users">users</Link>
          </Nav.Link>
        </Nav>
        <Navbar.Text><em>{user.name} logged in</em></Navbar.Text>
        <Form inline>
          <Button variant="outline-primary" onClick={logoutHandler}>logout</Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  )

  return (
    <div className="container">
      <Notification />
      {user === null ?
        <LoginForm /> :
        <div>
          {menu()}
          <h2>blog app</h2>
          <Switch>
            <Route path="/users/:id">
              <User id={userId} />
            </Route>
            <Route path="/users">
              <Users />
            </Route>
            <Route path="/blogs/:id">
              <Blog blogId={blogId} />
            </Route>
            <Route path="/">
              <BlogForm />
              <BlogList />
            </Route>
          </Switch>
        </div>
      }
    </div>
  )
}

export default App
