/*
 * <license header>
 */

import { Text } from '@adobe/react-spectrum';
import { register } from '@adobe/uix-guest';
import { extensionId } from './Constants';
import { generatePath } from 'react-router';

async function ExtensionRegistration() {
  const guestConnection = await register({
    id: extensionId,
    methods: {
      headerMenu: {
        async getButtons() {
          const contentFragment = await guestConnection.host.contentFragment.getContentFragment();
          const model = contentFragment.model;
          if (model?.title === 'Promo') {
            return [
              {
                id: 'register-offer',
                label: 'Register Offer',
                icon: 'OpenIn',
                variant: 'action',
                disabled: 'yes',
                onClick() {

                  const modalURL =
                    '/index.html#' +
                    generatePath(
                      '/content-fragment/:fragment/register-offer',
                      {
                        fragment: encodeURIComponent(contentFragment.path),
                      }
                    );

                  guestConnection.host.modal.showUrl({
                    title: 'Register Offer',
                    url: modalURL,
                    loading: true,
                    width: '600px'
                  });
                },
              },
            ];
          } else return [];
        },
      },
    }
  });

  const init = async () => {
    guestConnection;
  };

  init().catch(console.error);

  return <Text>IFrame for integration with Host (AEM)...</Text>;
}

export default ExtensionRegistration;
