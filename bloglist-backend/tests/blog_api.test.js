/* eslint-disable no-unused-vars */
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

//const Blog = require('../models/blog')

describe('with preloaded blog list entries', () => {

    beforeEach(async () => {
        // initialize blogs and users db
        await helper.initBlogsUsersDb()
    })

    describe('fetching all blog list entries', () => {

        test('returns entries as json', async () => {
            await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })

        test('returns expected number of entries', async () => {
            const response = await api.get('/api/blogs')

            expect(response.body).toHaveLength(helper.initialBlogs.length)
        })


        test('returns the id field', async () => {
            const response = await api.get('/api/blogs')

            expect(response.body[0].id).toBeDefined()
        })

        test('returns a user object with each entry', async () => {
            const response = await api.get('/api/blogs')

            const blogs = response.body
            blogs.forEach(element => {
                expect(element.user).toBeDefined()
            })
        })

        test('returns a comments array with each entry', async () => {
            const response = await api.get('/api/blogs')

            const blogs = response.body
            blogs.forEach(element => {
                expect(element.comments).toBeDefined()
            })
        })

    }) // describe

    describe('inserting new blog list entries', () => {

        let userTokens = []

        // this is only run once within this describe block
        beforeAll(async () => {

            const getToken = (username, id) => {
                const userForToken = { username, id }
                return jwt.sign(userForToken, process.env.SECRET)
            }

            // obtain a valid token for all initial db users
            userTokens = helper.initialUsers.map(element => getToken(element.username, element._id))
            //console.log('userTokens', userTokens)
        })

        test('succeeds with a valid, authenticated request', async () => {
            await api
                .post('/api/blogs')
                .set('Authorization', 'bearer ' + userTokens[0])
                .send(helper.listWithOneBlog[0])
                .expect(201)
                .expect('Content-Type', /application\/json/)

            // fetch all blogs
            const response = await api.get('/api/blogs')

            expect(response.body).toHaveLength(helper.initialBlogs.length + 1)

            const titles = response.body.map(r => r.title)
            expect(titles).toContain(helper.listWithOneBlog[0].title)

        })

        test('succeeds without the likes field', async () => {
            // construct a blog entry without the likes field
            const brokenBlog = helper.listWithOneBlog[0]
            delete brokenBlog.likes

            const response = await api
                .post('/api/blogs')
                .set('Authorization', 'bearer ' + userTokens[0])
                .send(brokenBlog)
                .expect(201)

            expect(response.body.likes).toBe(0)
        })

        test('fails without a token', async () => {
            const response = await api
                .post('/api/blogs')
                .set('Authorization', 'bearer foobar')
                .send(helper.listWithOneBlog[0])
                .expect(401)

        })

        test('fails with an invalid token', async () => {
            const response = await api
                .post('/api/blogs')
                .send(helper.listWithOneBlog[0])
                .expect(401)

        })

        test('fails without the title field', async () => {
            const brokenBlog = helper.listWithOneBlog[0]
            delete brokenBlog.title

            const response = await api
                .post('/api/blogs')
                .set('Authorization', 'bearer ' + userTokens[0])
                .send(brokenBlog)
                .expect(400)

        })

        test('fails without the url field', async () => {
            const brokenBlog = helper.listWithOneBlog[0]
            delete brokenBlog.url

            const response = await api
                .post('/api/blogs')
                .set('Authorization', 'bearer ' + userTokens[0])
                .send(brokenBlog)
                .expect(400)

        })
    })

    describe('deleting blog list entries', () => {

        let userTokens = []

        // this is only run once within this describe block
        beforeAll(async () => {

            const getToken = (username, id) => {
                const userForToken = { username, id }
                return jwt.sign(userForToken, process.env.SECRET)
            }

            // obtain a valid token for all initial db users
            userTokens = helper.initialUsers.map(element => getToken(element.username, element._id))
            //console.log('userTokens', userTokens)
        })

        test('succeeds with a valid id', async () => {
            const blogs = await helper.loadBlogs()
            const deletedBlog = blogs[1]
            //console.log('all blogs=', blogs)
            //console.log('deletedBlog=', deletedBlog)

            await api
                .delete(`/api/blogs/${deletedBlog.id}`)
                .set('Authorization', 'bearer ' + userTokens[0])
                .expect(204)

            const updatedBlogs = await helper.loadBlogs()
            expect(updatedBlogs.length).toBe(blogs.length - 1)

            // verify that the blog id was removed from the user
            const user = await api
                .get(`/api/users/${deletedBlog.user.id}`)
                .expect(200)
            //console.log('user', user)
            expect(user.body.blogs.length).toBe(2)
        })

        test('fails with an invalid id', async () => {
            const id = '3242345643'
            await api
                .delete(`/api/blogs/${id}`)
                .set('Authorization', 'bearer ' + userTokens[0])
                .expect(400)
        })
    })

    describe('updating blog list entries', () => {

        let userTokens = []

        // this is only run once within this describe block
        beforeAll(async () => {

            const getToken = (username, id) => {
                const userForToken = { username, id }
                return jwt.sign(userForToken, process.env.SECRET)
            }

            // obtain a valid token for all initial db users
            userTokens = helper.initialUsers.map(element => getToken(element.username, element._id))
            //console.log('userTokens', userTokens)
        })

        test('succeeds with a valid id and response matches', async () => {
            const blogs = await helper.loadBlogs()
            const updatedBlog = blogs[1]
            //console.log('original blog=', updatedBlog)
            const id = updatedBlog.id
            updatedBlog.likes = 666
            delete updatedBlog.id

            const response = await api
                .put(`/api/blogs/${id}`)
                .set('Authorization', 'bearer ' + userTokens[0])
                .send(updatedBlog)
                .expect(200)
                .expect('Content-Type', /application\/json/)
            //console.log(response.body)
            expect(response.body.likes).toBe(666)
        })
    })

    describe('inserting blog comments', () => {

        let userTokens = []

        // this is only run once within this describe block
        beforeAll(async () => {

            const getToken = (username, id) => {
                const userForToken = { username, id }
                return jwt.sign(userForToken, process.env.SECRET)
            }

            // obtain a valid token for all initial db users
            userTokens = helper.initialUsers.map(element => getToken(element.username, element._id))
            //console.log('userTokens', userTokens)
        })

        test('succeeds with a valid blog id and token', async () => {
            const blogs = await helper.loadBlogs()
            const blog1 = blogs[1]
            const newComment = {
                comment: 'This is a comment',
            }
            //console.log('newComment', newComment)

            let response = await api
                .post(`/api/blogs/${blog1.id}/comments`)
                .set('Authorization', 'bearer ' + userTokens[0])
                .send(newComment)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            //console.log(response.body)

            response = await api
                .get(`/api/blogs/${blog1.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)
            expect(response.body.comments.length).toBe(3)
            const comments = response.body.comments.map(r => r.comment)
            expect(comments).toContain('This is a comment')
        })

        test('fails with an invalid blog id and a valid token', async () => {
            const newComment = {
                comment: 'This is a comment',
            }
            const blogId = 'abcdefg12345678797'

            const response = await api
                .post(`/api/blogs/${blogId}/comments`)
                .set('Authorization', 'bearer ' + userTokens[0])
                .send(newComment)
                .expect(400)
            //console.log(response.body)
        })

        test('fails with an valid blog id and without a token', async () => {
            const blogs = await helper.loadBlogs()
            const blog1 = blogs[1]
            const newComment = {
                comment: 'This is a comment',
            }

            let response = await api
                .post(`/api/blogs/${blog1.id}/comments`)
                .send(newComment)
                .expect(401)
            //console.log(response.body)
        })

    })

    afterAll(() => {
        mongoose.connection.close()
    })
})
