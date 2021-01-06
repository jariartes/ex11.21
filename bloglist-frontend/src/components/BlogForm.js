import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { setMessage } from '../reducers/notificationReducer'
import useField from '../hooks'
import { Form, Button } from 'react-bootstrap'

const BlogForm = () => {

  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const dispatch = useDispatch()

  // add a blog entry to the db & update the blogs arrays
  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      author: author.value,
      title: title.value,
      url: url.value,
    }
    toggleVisibility()
    dispatch(createBlog(blogObject))
    dispatch(setMessage({
      type: 'notification',
      message: `a new blog ${blogObject.title} by ${blogObject.author} added`
    }))
    title.clear()
    author.clear()
    url.clear()
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>create new</button>
      </div>
      <div style={showWhenVisible}>
        <h3>create new</h3>
        <Form onSubmit={addBlog}>
          <Form.Group>
            <Form.Label>author</Form.Label>
            <Form.Control {...author} id="author" />
            <Form.Label>title</Form.Label>
            <Form.Control {...title} id="title" />
            <Form.Label>url</Form.Label>
            <Form.Control {...url} id="url" />
            <Button id='submit' type='submit'>save</Button>
          </Form.Group>
        </Form>
        <Button onClick={toggleVisibility}>cancel</Button>
      </div>
    </div>
  )
}

export default BlogForm
