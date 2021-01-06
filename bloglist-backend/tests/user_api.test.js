const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
//const bcrypt = require('bcrypt')
// const User = require('../models/user')


describe('when there is initially two users in the db', () => {
    beforeEach(async () => {
        await helper.initBlogsUsersDb()
    })

    test('all users have their pre-defined amount of blog entries', async () => {
        const usersAtStart = await helper.usersInDb()
        // update if the initial db changes
        expect(usersAtStart[0].blogs).toHaveLength(3)
        expect(usersAtStart[1].blogs).toHaveLength(3)
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        let newUser = {
            username: 'jartes',
            name: 'Jari Artes',
            password: 'passupassu',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with a too short a password', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: '1234567890',
            name: '1234567890',
            password: '123',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('minimum password length')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)

    })

    test('creation fails with a too short a user name', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: '1',
            name: '1234567890',
            password: '1234567890',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        //console.log('error = ', result.body.error)
        expect(result.body.error).toContain('username: Path `username`')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)

    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = usersAtStart[0]
        newUser.password = 'bogus'

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('removing the user succeeds', async () => {
        const usersAtStart = await helper.usersInDb()
        console.log('delete user id=', usersAtStart[0].id)
        await api
            .delete(`/api/users/${usersAtStart[0].id}`)
            .expect(204)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length-1)
    })

    afterAll(() => {
        mongoose.connection.close()
    })

})