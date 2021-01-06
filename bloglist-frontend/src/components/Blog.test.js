/* eslint-disable no-unused-vars */
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import Blog from './Blog'

const blog = {
  author: 'First Last',
  title: 'Title of the blog post',
  url: 'foobar',
  likes: 10,
  user: {
    username: 'Author Name'
  }
}

const user = {
  username: 'Author Name'
}

const updateBlog = jest.fn()
const deleteBlog = jest.fn()

let component

describe('<Blog />', () => {

  beforeEach(() => {
    component = render(
      <Blog
        blog={blog}
      />
    )
  })

  test('renders the default view correctly', () => {
    const div = component.container.querySelector('.hiddenBlog')
    expect(div).toBeDefined()
    expect(div).toHaveTextContent(blog.author)
    expect(div).toHaveTextContent(blog.title)

    const div2 = component.container.querySelector('.visibleBlog')
    expect(div2).toBeFalsy()

  })

  test('default view does not show all details', () => {
    expect(
      component.container.querySelector('.visibleBlog')
    ).toBeFalsy()
  })


  test('after clicking the view button, details are displayed', () => {
    const button = component.getByText('view')
    fireEvent.click(button)
    const div = component.container.querySelector('.visibleBlog')
    expect(div).toBeDefined()
    expect(div).toHaveTextContent(blog.likes)
    expect(div).toHaveTextContent(blog.url)
    expect(div).toHaveTextContent(blog.user.username)
  })

  test('after clicking the like button twice, two events are counted', () => {
    // make sure we start from zero calls
    updateBlog.mockClear()

    // change the view
    const button1 = component.getByText('view')
    fireEvent.click(button1)
    // click twice
    const button2 = component.getByText('like')
    fireEvent.click(button2)
    fireEvent.click(button2)

    expect(updateBlog.mock.calls).toHaveLength(2)
  })
})