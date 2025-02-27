import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Main from './pages/Main'

const queryClient = new QueryClient()
function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <Main />
        <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default App
