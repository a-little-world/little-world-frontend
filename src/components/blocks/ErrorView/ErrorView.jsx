import { getAppRoute } from '../../../routes';
import MessageCard from '../Cards/MessageCard';
import AppLayout from '../Layout/AppLayout';

const RouterError = ({ Layout = AppLayout }) => (
  <Layout>
    <MessageCard
      title="error_view.title"
      linkText="error_view.button"
      linkTo={getAppRoute()}
    />
  </Layout>
);

export default RouterError;
