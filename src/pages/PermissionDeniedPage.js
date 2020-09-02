import * as React from 'react';
import Page from '../components/Page';

function PermissionDeniedPage() {
  return (
    <Page
      body={
        <React.Fragment>
          <h1>Permission Denied</h1>
        </React.Fragment>
      }
    />
  );
}

export default PermissionDeniedPage();
