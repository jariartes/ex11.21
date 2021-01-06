var _ = require('lodash')

const dummy = () => {
    return 1
}

// return total of all likes
const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0 )
}

// return first of most liked blogs
const favoriteBlog = (blogs) => {
    // no favorite, sorry
    if (blogs.length === 0)
        return -1

    return blogs.reduce((largest, blog) => {
        if (blog.likes > largest.likes)
            return blog
        return largest
    }, blogs[0])
}

// return (one) author with most blogs
const mostBlogs = (blogs) => {

    if (blogs.length === 0)
        return -1

    const counts = _.countBy(blogs, 'author')
    //console.log('counts = ', counts)

    const max = Object.entries(counts)
        .reduce((largest, author) => {
            // author[0] name, author[1] count
            if (author[1] > largest[1])
                return author
            return largest
        }, ['',0])

    //console.log('max =', max)
    return { author: max[0], blogs: max[1] }
}

// return (one) author with most total likes
const mostLikes = (blogs) => {
    if (blogs.length === 0)
        return -1

    // count likes per author
    const likesPerAuthor = blogs.reduce((result, blog) => {
        const author = blog.author
        result[author] = (result[author] + blog.likes) || blog.likes
        return result
    }, {})

    // find (one) author with most likes
    const author = _.reduce(likesPerAuthor, (max, likes, key) => {
        //console.log('max=', max)
        //console.log('likes=', likes)
        //console.log('key=', key)
        if (likes > max.likes)
            return { author: key, likes: likes }
        return max
    }, { author: 'none', likes: 0 })

    return author
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
