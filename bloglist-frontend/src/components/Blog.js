import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateBlog, deleteBlog } from '../reducers/blogReducer'
import { setMessage } from '../reducers/notificationReducer'
import { useHistory } from 'react-router-dom'
import Comments from './Comments'
import { Button } from 'react-bootstrap'

const Blog = ({ blogId }) => {

  const dispatch = useDispatch()

  const blog = useSelector(state =>
    state.blogs.find(blog => blogId === blog.id)
  )
  //console.log('blog', blog)

  const user = useSelector(state => state.user)

  const history = useHistory()

  // linked to increment likes button
  const handleUpdateLikes = () => {
    // note: blog points directly to state
    const newBlog = { ...blog, likes: blog.likes+1 }
    dispatch(updateBlog(newBlog))
    dispatch(setMessage({
      type: 'notification',
      message: `blog entry ${blog.title} by ${blog.author} updated`
    }))
  }

  // linked to blog entry remove button
  const handleDelete = () => {
    const answer = window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`)
    if (answer) {
      dispatch(deleteBlog(blog.id))
      dispatch(setMessage({
        type: 'notification',
        message: `blog entry '${blog.title}' by ${blog.author} deleted`
      }))
      history.push('/')
    }
  }

  const User = () => {
    const creator = blog.user
    if (!creator) {
      return null
    }

    return (
      <div>
        added by {creator.name}
        <br />
        {user.username === creator.username &&
          <><Button onClick={handleDelete}>remove</Button><br /></>
        }
      </div>
    )
  }

  if (!blog)
    return null

  return (
    <div>
      <h3>{blog.title} by {blog.author}</h3>
      <a href={blog.url}>{blog.url}</a><br />
      likes {blog.likes}
      <Button onClick={handleUpdateLikes}>like</Button><br />
      {User()}
      <Comments blogId={blog.id} />
    </div>
  )
}

export default Blog
