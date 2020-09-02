import * as React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Page from '../components/Page';
import PermissionDeniedPage from './PermissionDeniedPage';
import Notifications from './elements/Notifications';
import Notification from './elements/Notification';
import NewNotification from './elements/NewNotification';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const GET_NOTIFICATION = gql`
  query Notification($path: String) {
    app_interface_emails_v1(path: $path) {
      path
      labels
      name
      subject
      to {
        users {
          path
          name
        }
      }
      body
    }
  }
`;

const GET_NOTIFICATIONS = gql`
  query Notifications {
    app_interface_emails_v1 {
      path
      labels
      name
      subject
      to {
        users {
          name
          path
        }
        namespaces {
          name
          path
        }
        aws_accounts {
          name
          path
        }
      }
      body
    }
  }
`;


const NotificationsPage = ({ location }) => {
  const path = location.hash.substring(1);

  if (path) {
    if (path === "create") {
      return (
        <NewNotification />
      )
    } else {
      return (
        <Query query={GET_NOTIFICATION} variables={{ path }}>
          {({ loading, error, data }) => {
            if (loading) return 'Loading...';
            if (error) return `Error! ${error.message}`;
  
            const notification = data.app_interface_emails_v1[0];
            const body = <Notification notification={notification} />;
            return <Page title={notification.name} body={body} path={notification.path} />;
          }}
        </Query>
      );
    }
  }

  return (

    <Query query={GET_NOTIFICATIONS}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;

        const username = cookies.get('github-oauth-user')
        const email = cookies.get('github-oauth-email')
        console.log("notifications page:", username, email);

        // if (username === "user-name") {
        //   return PermissionDeniedPage;
        // }

        const body = <Notifications notifications={data.app_interface_emails_v1} />;
        return <Page title="Notifications" body={body} create={{"hash": "create", "path":"/notifications", "label": "Create a new notification"}}/>;
      }}
    </Query>

  );
};

export default NotificationsPage;
