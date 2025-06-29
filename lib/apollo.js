import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

let ApolloClient;

function createApolloClient() {
    return new ApolloClient({
      ssrMode: typeof window === 'undefined',
      link: new HttpLink({
        uri: process.env.NEXT_PUBLIC_GRAPHQL_URI,
      }),
      cache: new InMemoryCache(),
    });
}

export function initializeApollo(initialState = null) {
    const _apolloClient = apolloClient ?? createApolloClient();
  
    if (initialState) {
      _apolloClient.cache.restore(initialState);
    }
  
    if (typeof window === 'undefined') return _apolloClient;
    
    if (!apolloClient) apolloClient = _apolloClient;
  
    return _apolloClient;
}

