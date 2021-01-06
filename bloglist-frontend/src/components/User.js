import React from 'react'
import { useSelector } from 'react-redux'

const User = ({ id }) => {

  const user = useSelector(state =>
    state.users.find(user => id === user.id)
  )

  console.log('user', user)

  if (!user)
    return null

  return (
    <div>
      <h2>{user.name}</h2>
      <p>added blogs</p>
      { user.blogs.length > 0 &&
        user.blogs.map(blog => (
          <li key={blog.id}>{blog.title}</li>
        ))
      }
    </div>
  )
}

export default User
