import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import SidebarLayout from './components/Wrappers/SideBarLayout'
import Main from './pages/Main'

const queryClient = new QueryClient()
function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <SidebarLayout>
          <Main />
        </SidebarLayout>
        <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default App
