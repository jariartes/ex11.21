const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')
const { getTokenUser } = require('../utils/token')


// get one blog list entry by id
blogsRouter.get('/:id', async (request, response) => {

    const id = request.params.id
    const blog = await Blog
        .findById(id)
        .populate('user', { username: 1, name: 1 })
        .populate('comments', { comment: 1 })
    //console.log('api get single', blog)
    response.json(blog)
})

// get all blog list entries
blogsRouter.get('/', async (request, response) => {

    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

// post a new comment to an existing blog id
blogsRouter.post('/:id/comments', async (request, response) => {

    const user = await getTokenUser(request.token)
    if (!request.token || !user._id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const comment = new Comment({ comment: request.body.comment })
    const result = await comment.save()

    // update the comment entry array in the blog record
    const blogId = request.params.id
    const blog = await Blog.findById(blogId)
    blog.comments = blog.comments.concat(comment._id)
    const blogUpdate = { comments: blog.comments }
    await Blog.findByIdAndUpdate(blogId, blogUpdate, { new: true })

    response.status(201).json(result)
})

// post a new entry
blogsRouter.post('/', async (request, response) => {

    const blog = new Blog(request.body)

    const user = await getTokenUser(request.token)
    if (!request.token || !user._id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    //console.log('post user', user)
    blog.user = user._id

    // set likes -> 0 if missing
    blog.likes = (blog.likes) ? blog.likes : 0
    // save the blog entry
    const result = await blog.save()

    // update the blog entry array in the user record
    user.blogs = user.blogs.concat(blog._id)
    await user.save()

    response.status(201).json(result)
})

// update an entry by id
blogsRouter.put('/:id', async (request, response) => {

    const user = await getTokenUser(request.token)
    if (!request.token || !user._id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const id = request.params.id
    const newBlog = {
        author: request.body.author,
        title: request.body.title,
        url: request.body.url,
        likes: request.body.likes
    }
    //console.log('request.body=', request.body)

    //console.log('newBlog=', newBlog)
    // we're not creating a new entry if the original has vanished
    const result = await Blog.findByIdAndUpdate(id, newBlog, { new: true })
    response.status(200).json(result)

})

// delete an entry by id w/ auth token
// only the creator of an entry can remove it
blogsRouter.delete('/:id', async (request, response) => {

    const user = await getTokenUser(request.token)
    if (!request.token || !user._id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const id = request.params.id
    const blog = await Blog.findById(id)

    // missing user or creator user is not the token user?
    if (!blog.user || blog.user.toString() !== user._id.toString()) {
        return response.status(403).json({ error: 'permission denied' })
    }

    await Blog.findByIdAndDelete(id)

    // remove blog id from creator's user record
    const userUpdate = { blogs: user.blogs.filter(blogId => blogId.toString() !== id.toString()) }
    await User.findByIdAndUpdate(user._id, userUpdate, { new: true })

    response.status(204).end()
})

module.exports = blogsRouter