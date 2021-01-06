import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'


test('<BlogForm /> updates parent state and calls onSubmit', async () => {

  //const createBlog = jest.fn()

  const component = render(
    <BlogForm />
  )

  const author = component.container.querySelector('#author')
  const title = component.container.querySelector('#title')
  const url = component.container.querySelector('#url')

  const form = component.container.querySelector('form')

  fireEvent.change(author, {
    target: { value: 'Test Author' }
  })
  fireEvent.change(title, {
    target: { value: 'Test Title' }
  })
  fireEvent.change(url, {
    target: { value: 'Test Url' }
  })

  await act(async () => {
    fireEvent.submit(form)
  })

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].author).toBe('Test Author')
  expect(createBlog.mock.calls[0][0].title).toBe('Test Title')
  expect(createBlog.mock.calls[0][0].url).toBe('Test Url')
})