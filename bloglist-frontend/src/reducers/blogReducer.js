import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  switch (action.type) {

  case 'INIT_BLOGS':
    return action.data

  case 'NEW_BLOG':
    return [...state, action.data]

  case 'UPDATE_BLOG': {
    return state.map(n =>
      n.id !== action.data.id ? n : action.data
    )
  }

  case 'DELETE_BLOG':
    return state.filter( n => n.id !== action.id )

  default:
    return state
  }
}

export const deleteBlog = id => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch({
      type: 'DELETE_BLOG',
      id: id
    })
  }
}

export const updateBlog = blog => {
  return async dispatch => {
    const updatedBlog = await blogService.update(blog)
    const completeBlog = await blogService.getOne(updatedBlog.id)
    dispatch({
      type: 'UPDATE_BLOG',
      data: completeBlog
    })
  }
}

export const createBlog = blog => {
  return async dispatch => {
    const returnedBlog = await blogService.create(blog)
    // fetch the updated blog entry to populate the user object
    const fullBlog = await blogService.getOne(returnedBlog.id)
    if (!fullBlog.user.id)
      throw new Error('blog entry is corrupted, discarding entry')
    dispatch({
      type: 'NEW_BLOG',
      data: fullBlog
    })
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export default blogReducer