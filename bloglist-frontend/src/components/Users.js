import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'


const Users = () => {

  const users = useSelector(state => state.users)

  const getUserTable = (users) => {

    const iterateUsers = () => (
      users.map((user) => (
        <tr key={user.id}>
          <td>
            <Link to={`/users/${user.id}`}>{user.name}</Link>
          </td>
          {
            user.blogs ?
              <td>{user.blogs.length}</td>
              :
              <td>0</td>
          }
        </tr>
      ))
    )

    if (!users || users.length === 0)
      return null

    return (
      <Table striped>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {iterateUsers()}
        </tbody>
      </Table>
    )
  }


  return (
    <div>
      <h2>Users</h2>
      {getUserTable(users)}
    </div>
  )
}

export default Users
