const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    const body = request.body

    // password length must be at least 3 chars
    if (!(body.password && body.password.length > 3)) {
        response
            .status(400)
            .json({ error: 'minimum password length is 3 characters' })
    } else {
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash,
        })

        const userSave = await user.save()

        response.status(201).json(userSave)
    }
})

usersRouter.get('/:id', async (request, response) => {
    const id = request.params.id
    const apiResponse = await User
        .findById(id)
        .populate('blogs', { author: 1, title: 1 })
    response.status(200).json(apiResponse).end()
})


usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({})
        .populate('blogs', { author: 1, title: 1 })
    response.json(users.map(u => u.toJSON()))
})

usersRouter.delete('/:id', async (request, response) => {
    const id = request.params.id
    //console.log('removed id = ', id)
    await User.findByIdAndDelete(id)
    response.status(204).end()
})

module.exports = usersRouter