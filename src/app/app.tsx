import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClusterProvider } from '../components/cluster/cluster-data-access'
import { SolanaProvider } from '../components/solana/solana-provider'
import { AppRoutes } from './app-routes'
import { Provider } from 'react-redux'
import { persistor, store } from '../reduxSetup/store'
import { PersistGate } from 'redux-persist/integration/react'

const client = new QueryClient()

export function App() {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
    <QueryClientProvider client={client}>
      <ClusterProvider>
        <SolanaProvider>
          <AppRoutes />
        </SolanaProvider>
      </ClusterProvider>
    </QueryClientProvider>
    </PersistGate>
    </Provider>
  )
}
