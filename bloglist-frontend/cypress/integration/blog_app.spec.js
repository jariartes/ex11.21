describe('Blog app', function () {

  const user = {
    name: 'Jari Artes',
    username: 'jartes',
    password: 'passupassu'
  }

  const backend = 'http://localhost:3003'

  beforeEach(function () {
    cy.request('POST', `${backend}/api/testing/reset`)
    cy.request('POST', `${backend}/api/users/`, user)

    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('log in to application')
    cy.get('#login').should('exist')
  })

  describe('Login', function () {

    it('succeeds with correct credentials', function () {
      cy.get('#username').type(user.username)
      cy.get('#password').type(user.password)
      cy.get('#login').click()
      cy.contains(`${user.name} logged in`)
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type(user.username)
      cy.get('#password').type('asdfgfklösdfglkj')
      cy.get('#login').click()
      cy.contains('invalid username or password')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })

  })

  const blog = {
    author: 'John Holmes',
    title: 'Mine is bigger than yours',
    url: 'https://foo.bar/baz'
  }

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login(user)
    })

    it('A blog can be created', function () {
      // click the new blog button
      cy.contains('new blog').click()
      // fill in the form
      cy.get('#author').type(blog.author)
      cy.get('#title').type(blog.title)
      cy.get('#url').type(blog.url)
      cy.get('#submit').click()
      // verify result
      cy.contains(`a new blog ${blog.title} by ${blog.author} added`)
      cy.get('.hiddenBlog').contains(`${blog.title} ${blog.author}`)
    })

    it('A blog can liked', function () {
      // create the blog entry first
      cy.createBlog(blog)
      // click the view button
      cy.get('.hiddenBlog').contains('view').click()
      // click the like button and expect to have one like
      cy.get('.visibleBlog').contains('like').click()
      // expect to have 1 like
      cy.get('.visibleBlog').contains('likes 1')
    })

    it('A blog can be removed', function () {
      // create the blog entry first
      cy.createBlog(blog)
      // click the view button
      cy.get('.hiddenBlog').contains('view').click()
      // confirm dialog test
      cy.on('window:confirm', function (txt) {
        expect(txt).to.contain('Remove blog')
      })
      // click the remove button and verify there are no blog entries
      cy.get('.visibleBlog').contains('remove').click()
      cy.contains('blog entry successfully removed')
      cy.get('html').should('not.contain', blog.title)
    })

    const manyBlogs = [
      {
        author: 'Five Likes',
        title: 'Almost liked',
        url: 'https://foo.bar/baz',
        likes: 5
      },
      {
        author: 'Dozen Likes',
        title: 'Much liked',
        url: 'https://foo.bar/baz',
        likes: 12
      },
      {
        author: 'One Like',
        title: 'Not liked',
        url: 'https://foo.bar/baz',
        likes: 1
      }
    ]

    it.only('Blogs are sorted in descending order by likes', function () {
      // create blog list entries
      manyBlogs.forEach(blog => cy.createBlog(blog))
      cy.get('.hiddenBlog').then(entries => {
        //console.log(entries[0])
        expect(entries.length).to.eq(3)
        // ugly but works
        expect(entries[2].textContent).to.contain('One Like')
        expect(entries[1].textContent).to.contain('Five Likes')
        expect(entries[0].textContent).to.contain('Dozen Likes')
      })

    })

  })
})