import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = () => {

  const notification = useSelector(state => state.notification)

  const variant = notification.type === 'notification' ? 'success' : 'danger'

  if (notification.type) {
    return (
      <Alert variant={variant} >
        {notification.message}
      </Alert>
    )
  } else
    return null
}

export default Notification