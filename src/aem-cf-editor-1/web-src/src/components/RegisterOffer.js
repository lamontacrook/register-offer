import React, { useState, useEffect } from "react";
import { attach } from "@adobe/uix-guest";
import {
  Flex,
  Provider,
  View,
  defaultTheme,
  Text,
  ButtonGroup,
  Item,
  Tabs,
  TabList,
  TabPanels,
  Button,
  TextArea,
  TextField,
  Form,
  Well
} from "@adobe/react-spectrum";
import actionWebInvoke from '../utils';
import ApplicationDelivery from "@spectrum-icons/workflow/ApplicationDelivery";
import Login from "@spectrum-icons/workflow/Login";
import FileHTML from "@spectrum-icons/workflow/FileHTML";
import allActions from '../config.json';
import { extensionId } from "./Constants";
import { srcSet, sizes } from '../responsive-image';

const formatHtml = (actionResponse, conn) => {
  const publishUrl = conn.sharedContext.get('aemHost').replace('author', 'publish');
  const imageSizes = [
    {
      imageWidth: '2000px',
      renditionName: 'web-optimized-xlarge.webp',
    },
    {
      imageWidth: '1600px',
      renditionName: 'web-optimized-xlarge.webp',
    },
    {
      imageWidth: '1200px',
      renditionName: 'web-optimized-xlarge.webp',
    },
    {
      imageWidth: '1000px',
      renditionName: 'web-optimized-large.webp',
    },
    {
      imageWidth: '750px',
      renditionName: 'web-optimized-large.webp',
    },
    {
      imageWidth: '500px',
      renditionName: 'web-optimized-large.webp',
    },
    {
      imageWidth: '412px',
      renditionName: 'web-optimized-large.webp',
    },
    {
      size: '100vw',
    }
  ];

  const img = `<img loading='lazy' 
    alt="${actionResponse.data.promoByPath.item.asset.description}"
    title="${actionResponse.data.promoByPath.item.asset.title}"
    src="${actionResponse.data.promoByPath.item.asset._publishUrl}" 
    srcSet="${srcSet('https://' + publishUrl + actionResponse.data.promoByPath.item.asset._dynamicUrl, imageSizes)}"
    sizes="${sizes(imageSizes)}"
    data-aue-prop="asset" 
    data-aue-type="media" 
    data-aue-label='Asset'/>`;

  const _htmlOffer = `<div className='promo' 
    data-aue-resource="urn:aemconnection:${actionResponse.data.promoByPath.item._path}/jcr:content/data/${actionResponse.data.promoByPath.item._variation}"
    data-aue-type="reference"
    data-aue-filter="cf"
    data-aue-label="Promo">
    <div className='promo-asset'>
      ${img}
    </div>
    <div className='promo-text'>
      <span data-aue-prop='title' data-aue-type='richtext' data-aue-label='Headline'>
        ${actionResponse.data.promoByPath.item.title.html}
      </span>
      <span data-aue-prop='promotionalLanguage' data-aue-type='richtext' data-aue-label='Promotional Language'>
        ${actionResponse.data.promoByPath.item.promotionalLanguage.html}
      </span>
    </div>
    </div>`;

  return _htmlOffer;
};

export default function () {
  const {AIO_token, AIO_apiKey, AIO_imsOrg, AIO_sbxName} = process.env;
  const [token, setToken] = useState(AIO_token);
  const [apiKey, setApiKey] = useState(AIO_apiKey);
  const [imsOrg, setIMSOrg] = useState(AIO_imsOrg);
  const [sandbox, setSandbox] = useState(AIO_sbxName);
  const [appPath, setAppPath] = useState('https://bbw-demo.vercel.app/preview/');
  const [model, setModel] = useState('promo');
  const [fragmentPath, setFragmentPath] = useState('');
  const [offerName, setOfferName] = useState('');
  const [results, setResults] = useState('');
  const [update, setUpdate] = useState(false);

  const [htmlOffer, setHtmlOffer] = useState('');

  const updateSearchedAudience = (item) => {
    if (item)
      return setSearchedAudience([...searchedAudience, currentKey]);
    else
      return [];
  };
  const updateSelectedAudiences = (item) => {
    if (item) {
      const { currentKey } = item;
      console.log(currentKey);
      return setSelectedAudiences([...selectedAudiences, currentKey]);
    } else
      return [];
  };
  const [guestConnection, setGuestConnection] = useState();
  const [actionResponse, setActionResponse] = useState();

  async function getFragmentDetails(conn) {
    const { path } = await conn.host.contentFragment.getContentFragment();

    const headers = {
      'Authorization': 'Bearer ' + conn.sharedContext.get('auth').imsToken,
      'x-gw-ims-org-id': conn.sharedContext.get('auth').imsOrg
    };

    const params = {
      aemHost: `https://${conn.sharedContext.get('aemHost')}`,
      query: 'promo-list',
      fragment: path,
      endpoint: 'bbw'
    };

    const action = 'fragment-details';

    try {
      const actionResponse = await actionWebInvoke(allActions[action], headers, params);
      setActionResponse(actionResponse);
      setHtmlOffer(formatHtml(actionResponse, conn));
      if(actionResponse.data.promoByPath.item.offerDelivery) setUpdate(true);
      console.log(`Response from ${action}:`, actionResponse);
    } catch (e) {
      console.error(e)
    }
    conn.host.modal.set({ loading: false });
  };

  async function sendOffer(conn, htmlOffer, actionResponse, offerName) {
    conn.host.modal.set({ loading: true });
    
    const _headers = {
      'Authorization': 'Bearer ' + conn.sharedContext.get('auth').imsToken,
      'x-gw-ims-org-id': conn.sharedContext.get('auth').imsOrg,
      'Content-Type':'application/json'
    };

    const headers = {
      'Authorization': 'Bearer ' + token,
      'x-gw-ims-org-id': imsOrg,
      'x-api-key': apiKey,
      'x-sandbox-name': sandbox
    };

    console.log(actionResponse.data.promoByPath.item);
    const { onDate, offDate } = actionResponse.data.promoByPath.item;
    const params = {
      aemHost: `https://${conn.sharedContext.get('aemHost')}`,
      startDate: onDate,
      endDate: offDate,
      offer: htmlOffer,
      offerName: offerName,
      fragmentPath: fragmentPath,
      altHeaders: JSON.stringify(_headers),
      model: model.path,
      priority: actionResponse.data.promoByPath.item.priorityHighLow,
      group: actionResponse.data.promoByPath.item.customerGroupAudience 
    };

    const action = 'send-offer';

    try {
      const actionResponse = await actionWebInvoke(allActions[action], headers, params);
      setActionResponse(actionResponse);
      const keys = Object.keys(actionResponse);
      if(keys.includes('content') && keys.includes('cf')) setResults('Offer successfully shared!');
      setUpdate(true);

      console.log(`Response from ${action}:`, JSON.stringify(actionResponse));
      conn.host.modal.set({ loading: false });
    } catch (e) {
      console.error(e);
      conn.host.modal.set({ loading: false });
    }
  }

  useEffect(() => {
    (async () => {
      const guestConnection = await attach({ id: extensionId });
      const { model, path } = await guestConnection.host.contentFragment.getContentFragment();
      console.log('------');
      console.log(guestConnection.sharedContext.get('auth').imsToken);
      console.log('------');
      setGuestConnection(guestConnection);
      setModel(model);
      setFragmentPath(path);
      getFragmentDetails(guestConnection);
    })();
  }, []);

  const onCloseHandler = () => {
    guestConnection.host.modal.close();
  };

  return (
    <Provider theme={defaultTheme} colorScheme='light'>
      <Tabs aria-label='AJO Integration'>
        <TabList>
          <Item key='promo'><ApplicationDelivery /><Text>Register</Text></Item>
          <Item key='auth'><Login /><Text>Authentication</Text></Item>
          <Item key='html'><FileHTML /><Text>HTML</Text></Item>
        </TabList>
        <TabPanels marginTop={10}>
          <Item key='promo'>
            <View width="auto" justifySelf='center'>
              <Flex direction='column' width='100%' gap={'size-100'}>
                <TextField onChange={setOfferName} value={offerName} label="Offer Name" />
                <iframe style={{ height: '180px', width: '300px', border: '0' }} src={`${appPath}${model?.title?.toLowerCase()}${fragmentPath}`}></iframe>
                <ButtonGroup>
                  <Button variant="primary" onPress={() => sendOffer(guestConnection, htmlOffer, actionResponse, offerName)}>{update ? 'Update Offer' : 'Share Offer'}</Button>
                  <Button variant="secondary" onPress={onCloseHandler}>Close</Button>
                </ButtonGroup>
                <Well>{results}</Well>
              </Flex>
            </View >
          </Item>
          <Item key='auth'>
            <View width="100%">
              <Flex direction='column' width='100%' gap={"size-100"}>
                <Form width='100%'>
                  <TextArea width='100%' onChange={setToken} value={token} label='Authentication Token' />
                  <TextField width='100%' onChange={setApiKey} value={apiKey} label="API Key" />
                  <TextField width='100%' onChange={setIMSOrg} value={imsOrg} label="IMS Org" />
                  <TextField width='100%' onChange={setSandbox} value={sandbox} label="Sandbox Name" />
                  <TextField width='100%' onChange={setAppPath} value={appPath} label="App Path" />
                </Form>
              </Flex>
            </View >
          </Item>
          <Item key='html'>
            <View width="100%">
              <Flex direction='column' width='100%' gap={"size-100"}>
                <TextArea width='100%' value={htmlOffer} label='HTML Offer' />
              </Flex>
            </View >
          </Item>
        </TabPanels>
      </Tabs>

    </Provider >
  );
}
