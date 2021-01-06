const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')


let initialUsers = [
    {
        _id: '5f738a43965d95a01f88e879',
        username: 'user1',
        name: 'First User',
        passwordHash: '$2b$10$QJ53fBYZRtRw86haAyhB/emX4xwiTMuMwUXcfUCB2K.Ac/PeBpwE.',
        blogs: []
    },
    {
        _id: '5f738a43965d95a01f88e87a',
        username: 'user2',
        name: 'Second User',
        passwordHash: '$2b$10$XkMhv8YZE1QgpwHsMQF6fecBU5vcV7uDxSQZsl7dr8DfYIJyxhOHG',
        blogs: []
    }
]

const initialBlogs = [
    {
        user: '5f738a43965d95a01f88e879',
        title: 'React patterns', author: 'Michael Chan', url: 'https://reactpatterns.com/', likes: 7
    },
    {
        user: '5f738a43965d95a01f88e879', comments: ['6f738a43965d95a01f88e87a', '6f738a43965d95a01f88e87b'],
        title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html', likes: 5
    },
    {
        user: '5f738a43965d95a01f88e879',
        title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html', likes: 12
    },
    {
        user: '5f738a43965d95a01f88e87a',
        title: 'First class tests', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll', likes: 10
    },
    {
        user: '5f738a43965d95a01f88e87a', comments: ['6f738a43965d95a01f88e87c', '6f738a43965d95a01f88e87d'],
        title: 'TDD harms architecture', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html', likes: 0
    },
    {
        user: '5f738a43965d95a01f88e87a',
        title: 'Type wars', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html', likes: 2
    }
]

const initialComments = [
    {
        _id: '6f738a43965d95a01f88e87a',
        comment: 'I like goto'
    },
    {
        _id: '6f738a43965d95a01f88e87b',
        comment: 'I hate goto'
    },
    {
        _id: '6f738a43965d95a01f88e87c',
        comment: 'I like TDD'
    },
    {
        _id: '6f738a43965d95a01f88e87d',
        comment: 'I hate TDD'
    },
]

const listWithOneBlog = [
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        user: '5f738a43965d95a01f88e879'
    }
]

const loadBlogs = async () => {
    const blogs = await Blog.find({}).populate('user').populate('comments')
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({}).populate('blogs')
    return users.map(u => u.toJSON())
}


// initialize blog and user db
const initBlogsUsersDb = async () => {

    await Comment.deleteMany({})
    await Comment.insertMany(initialComments)

    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)

    // read in the blog entries
    let blogs = await Blog.find({})

    // fill in the user.blogs array with blog ids
    initialUsers
        .forEach(user => {
            const userBlogs = blogs.filter(blog => blog.user.toString() === user._id.toString())
            //console.log('user._id', user._id, typeof user._id)
            // console.log(userBlogs)
            user.blogs = userBlogs.map(blog => blog.id)
        })
    //console.log('initialUsers', initialUsers)

    await User.deleteMany({})
    await User.insertMany(initialUsers)

}


module.exports = {
    initialBlogs,
    initialUsers,
    listWithOneBlog,
    loadBlogs,
    usersInDb,
    initBlogsUsersDb
}
