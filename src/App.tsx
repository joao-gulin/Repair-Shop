import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AppLayout } from './components/app-layout'
import { BrowserRouter, Routes, Route } from "react-router";
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';

const queryClient = new QueryClient()
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppLayout>
          <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path='/customers' element={<Customers />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default App
