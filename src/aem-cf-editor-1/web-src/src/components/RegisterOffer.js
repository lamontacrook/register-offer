/*
 * <license header>
 */

//https://bbw-demo.vercel.app/preview/promo/content/dam/bbw/site/en/home/components/hand-soap
//https://bbw-demo.vercel.app/preview/promo/content/dam/bbw/site/en/home/components/hand-soap

import React, { useState, useEffect } from "react";
import { attach } from "@adobe/uix-guest";
import {
  Flex,
  Provider,
  Content,
  View,
  defaultTheme,
  Text,
  ButtonGroup,
  SearchField,
  ActionButton,
  ListView,
  Item,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Button,
  TextArea,
  TextField,
  Form
} from "@adobe/react-spectrum";
import actionWebInvoke from '../utils';
import ApplicationDelivery from "@spectrum-icons/workflow/ApplicationDelivery";
import Login from "@spectrum-icons/workflow/Login";
import FileHTML from "@spectrum-icons/workflow/FileHTML";
import allActions from '../config.json';
import { extensionId } from "./Constants";

const _token = 'eyJhbGciOiJSUzI1NiIsIng1dSI6Imltc19uYTEta2V5LWF0LTEuY2VyIiwia2lkIjoiaW1zX25hMS1rZXktYXQtMSIsIml0dCI6ImF0In0.eyJpZCI6IjE3MDk4NjU3NTYxMjRfMjhlYTNjNDctMzhhNC00ODBmLTg4ZTItODhiOWI5Njc1ZGUzX3V3MiIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJjbGllbnRfaWQiOiJleGNfYXBwIiwidXNlcl9pZCI6IkFFOTQxRTRDNjVFODlCMDYwQTQ5NUY4OUA4MWZiMWY3NzYzMWMwNDg4NDk1YzUwLmUiLCJzdGF0ZSI6IntcInNlc3Npb25cIjpcImh0dHBzOi8vaW1zLW5hMS5hZG9iZWxvZ2luLmNvbS9pbXMvc2Vzc2lvbi92MS9ZV1JsTWpJM056a3RNekl4WmkwME1UVXdMVGcxTXpRdE1qVTRaall6TldVME9UTm1MUzAzTUVNMk1VUkdNalkxTVRjeU9VVkRNRUUwT1RWRE1EUkFOV0poTnpGbE9ETTJOVEUyWkRkak9EUTVOV000T1M1bFwifSIsImFzIjoiaW1zLW5hMSIsImFhX2lkIjoiNkI2QjM5Rjc1NkFCQjk5RTdGMDAwMTAxQGFkb2JlLmNvbSIsImN0cCI6MCwiZmciOiJZSUxFRVFHT1hQUDdNSFVLSE1RVjJYQUE1WT09PT09PSIsInNpZCI6IjE3MDk4MzI1MjU3MjdfYzI2ZGI2YjUtYzlhOC00Yjk1LThiNDEtNzE3YzM4ZjE1Mjc1X3V3MiIsIm1vaSI6IjYxYmVmNGJhIiwicGJhIjoiTWVkU2VjTm9FVixMb3dTZWMiLCJleHBpcmVzX2luIjoiODY0MDAwMDAiLCJjcmVhdGVkX2F0IjoiMTcwOTg2NTc1NjEyNCIsInNjb3BlIjoiYWIubWFuYWdlLGFjY291bnRfY2x1c3Rlci5yZWFkLGFkZGl0aW9uYWxfaW5mbyxhZGRpdGlvbmFsX2luZm8uam9iX2Z1bmN0aW9uLGFkZGl0aW9uYWxfaW5mby5wcm9qZWN0ZWRQcm9kdWN0Q29udGV4dCxhZGRpdGlvbmFsX2luZm8ucm9sZXMsQWRvYmVJRCxhZG9iZWlvLmFwcHJlZ2lzdHJ5LnJlYWQsYWRvYmVpb19hcGksYXVkaWVuY2VtYW5hZ2VyX2FwaSxjcmVhdGl2ZV9jbG91ZCxtcHMsb3BlbmlkLG9yZy5yZWFkLHBwcy5yZWFkLHJlYWRfb3JnYW5pemF0aW9ucyxyZWFkX3BjLHJlYWRfcGMuYWNwLHJlYWRfcGMuZG1hX3RhcnRhbixzZXNzaW9uIn0.fQnQFmKLxE9XAWeD-UZ9bnF0f8QYofiRnDGEZCWX4ErAySB30T_op3AYyrfwaUgcyJZcF0wYzx_7-vyKu9cvO8Pgt_hQflB5uCq4cqG7SEvaLjVqbxMcnn-KirIfeWwE0fVpx101x-QlITgsLysGHv7Tj6UgQl0290hqW-c8jJwx7iXkl3ULNqlULxOWds3cGLoHoXz5mUzO2ZplYQgDKjr__6hkwXeWaysO65IdEOaU2hl_IXYA4Ux4VP3shN0ylYlp4Nnfae91VHEjL4kMukvxlp9wLI7dTqqJO9E9h0uH_0rG4BAtV9KcMfwK2ZVzFhBPJ-dx9o352roMCXAiMQ';
const _apiKey = '3af35f9c2dac45008506d484731aba13';
const _imsOrg = '120A56765E16E7BE0A495FEB@AdobeOrg';
const _sbxName = 'kabbeysbox';
// const editorProps = {
//   'data-aue-resource': `urn:aemconnection:${content._path}/jcr:content/data/${content._variation}`,
//   'data-aue-type': 'reference',
//   'data-aue-filter': 'cf',
//   'data-aue-label': 'Promo'
// };

const formatHtml = (actionResponse) => {
  const _htmlOffer = `<div className='promo'>
    <div className='promo-asset'>
      Image
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
  const [token, setToken] = useState(_token);
  const [apiKey, setApiKey] = useState(_apiKey);
  const [imsOrg, setIMSOrg] = useState(_imsOrg);
  const [sandbox, setSandbox] = useState(_sbxName);
  const [appPath, setAppPath] = useState('https://bbw-demo.vercel.app/preview/');
  const [model, setModel] = useState('promo');
  const [fragmentPath, setFragmentPath] = useState('');

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
    console.log('here');
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
      setHtmlOffer(formatHtml(actionResponse));
      console.log(`Response from ${action}:`, actionResponse);
    } catch (e) {
      console.error(e)
    }
    conn.host.modal.set({ loading: false });
  };

  async function sendOffer(conn, htmlOffer, actionResponse) {
    conn.host.modal.set({ loading: true });
    console.log(htmlOffer);
    const headers = {
      'Authorization': 'Bearer ' + token,
      'x-gw-ims-org-id': imsOrg,
      'x-api-key': apiKey,
      'x-sandbox-name': sandbox
    };

    console.log(actionResponse);
    const {onDate, offDate} = actionResponse.data.promoByPath.item;
    const params = {
      aemHost: `https://${conn.sharedContext.get('aemHost')}`,
      startDate: onDate,
      endDate: offDate,
      offer: htmlOffer
    };

    const action = 'send-offer';

    try {
      const actionResponse = await actionWebInvoke(allActions[action], headers, params);
      setActionResponse(actionResponse);
      
      console.log(`Response from ${action}:`, actionResponse);
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
                <iframe style={{ height: '180px', width: '300px', border: '0' }} src={`${appPath}${model?.title?.toLowerCase()}${fragmentPath}`}></iframe>
                <ButtonGroup>
                  <Button variant="primary" onPress={() => sendOffer(guestConnection, htmlOffer, actionResponse)}>Share to Offer Descisioning</Button>
                  <Button variant="secondary" onPress={onCloseHandler}>Close</Button>
                </ButtonGroup>
              </Flex>
            </View >
          </Item>
          <Item key='auth'>
            <View width="100%">
              <Flex direction='column' width='100%' gap={"size-100"}>
                <Form width='100%'>
                  <TextArea onChange={setToken} value={token} label='Authentication Token' />
                  <TextField onChange={setApiKey} value={apiKey} label="API Key" />
                  <TextField onChange={setIMSOrg} value={imsOrg} label="IMS Org" />
                  <TextField onChange={setSandbox} value={sandbox} label="Sandbox Name" />
                  <TextField onChange={setAppPath} value={appPath} label="App Path" />
                </Form>
              </Flex>
            </View >
          </Item>
          <Item key='html'>
            <View width="100%">
              <Flex direction='column' width='100%' gap={"size-100"}>
                <TextArea value={htmlOffer} label='HTML Offer' />
              </Flex>
            </View >
          </Item>
        </TabPanels>
      </Tabs>

    </Provider >
  );
}
