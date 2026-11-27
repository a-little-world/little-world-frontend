import { ReactNode } from 'react';

import Header from '../../blocks/Header';
import { StatusBody, StatusPage } from './PartnerLanding.styles';

const AdventStatusPage = ({ children }: { children: ReactNode }) => (
  <StatusPage>
    <Header />
    <StatusBody>{children}</StatusBody>
  </StatusPage>
);

export default AdventStatusPage;
