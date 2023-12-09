import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import './index.scss'
import { CssBaseline } from '@mui/material'
import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity
    }
  }
})
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <MantineProvider>
      <RouterProvider router={router} />
      <CssBaseline />
      <ReactQueryDevtools />
    </MantineProvider>
  </QueryClientProvider>
)
