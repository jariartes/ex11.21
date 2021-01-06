import React, { useState, useEffect } from 'react'
import blogs from '../services/blogs'
import useField from '../hooks'
import blogService from '../services/blogs'
import { Form, Button, ListGroup } from 'react-bootstrap'


const Comments = ({ blogId }) => {

  const [blog, setBlog] = useState({})

  const commentField = useField('text')

  useEffect(() => {
    (async () => {
      if (!blogId)
        return
      const blog = await blogs.getOne(blogId)
      setBlog(blog)
    })()
  }, [blogId])

  const handleAdd = async event => {
    event.preventDefault()
    const commentRequest = {
      id: blog.id,
      comment: commentField.value
    }
    const newComment = await blogService.createComment(commentRequest)
    //console.log('newcomment', newComment)
    const newBlog = { ...blog, comments: blog.comments.concat(newComment) }
    setBlog(newBlog)
    commentField.clear()
  }

  if (Object.keys(blog).length === 0 && blog.constructor === Object)
    return null

  //console.log('Comments blog', blog)

  return (
    <div>
      <h3>comments</h3>
      <Form onSubmit={handleAdd}>
        <Form.Group>
          <Form.Control {...commentField} />
          <Button variant="primary" type="submit">
            add comment
          </Button>
        </Form.Group>
      </Form>
      <ListGroup>
        { blog.comments.length > 0 &&
          blog.comments.map(comment => (
            <ListGroup.Item key={comment.id}>{comment.comment}</ListGroup.Item>
          ))
        }
      </ListGroup>
    </div>
  )
}

export default Comments
