import { getAppRoute } from '../../../routes';
import MessageCard from '../Cards/MessageCard';
import Layout from '../Layout/AppLayout';

const RouterError = () => (
  <Layout>
    <MessageCard
      title="error_view.title"
      linkText="error_view.button"
      linkTo={getAppRoute('')}
    />
  </Layout>
);

export default RouterError;
