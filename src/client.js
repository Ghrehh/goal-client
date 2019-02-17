import ApolloClient from "apollo-boost";

const backend = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

const client = new ApolloClient({
  uri: `${backend}/gql`
});

export default client;
