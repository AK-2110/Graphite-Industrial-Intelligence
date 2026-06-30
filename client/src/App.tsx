import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './trpc';
import DashboardLayout from './components/DashboardLayout';
import { Route, Switch } from 'wouter';

// Pages
import AssetRegistry from './pages/AssetRegistry';
import DocumentIngestion from './pages/DocumentIngestion';
import KnowledgeQA from './pages/KnowledgeQA';
import KnowledgeGraph from './pages/KnowledgeGraph';
import AnomalyFeed from './pages/AnomalyFeed';
import HomeDashboard from './pages/HomeDashboard';

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: import.meta.env.VITE_API_URL || 'http://localhost:4000/trpc',
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route path="/" component={HomeDashboard} />
          <Route>
            <DashboardLayout>
              <Switch>
                <Route path="/assets" component={AssetRegistry} />
                <Route path="/documents" component={DocumentIngestion} />
                <Route path="/qa" component={KnowledgeQA} />
                <Route path="/graph" component={KnowledgeGraph} />
                <Route path="/alerts" component={AnomalyFeed} />
                <Route>
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Page under construction.
                  </div>
                </Route>
              </Switch>
            </DashboardLayout>
          </Route>
        </Switch>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
