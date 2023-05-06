import Camera from '@renderer/pages/Camera'
import Setting from '@renderer/pages/Setting'
import { Navigate, createHashRouter } from 'react-router-dom'

const router = createHashRouter([
  {
    index: true,
    element: <Navigate to="/setting" />
  },
  {
    path: '/setting',
    element: <Setting />
  },
  {
    path: '/camera',
    element: <Camera />
  }
])

export default router
