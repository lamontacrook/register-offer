/*
Copyright 2023 Adobe
All Rights Reserved.
NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { srcSet, sizes } from '../responsive-image';

const imageUrl = (context, asset) => {
  if(Object.keys(asset).includes('_dynamicUrl')) {
    const url = context.serviceURL.includes('publish-')? context.serviceURL.replace('author', 'publish') : context.serviceURL;  
    return url.replace(/\/$/, '') + asset._dynamicUrl;
  } else {  
    return asset._authorUrl;
  }
};

const Image = ({ asset, alt = 'WKND image', itemProp='asset', width, height }) => {
  
  let src = context.serviceURL.includes('publish-') ? asset?._publishUrl : asset?._authorUrl;
  
  width = width || asset?.width || '';
  height = height || asset?.height || '';

  src = imageUrl(context, asset);

  return (
    <picture>
      <img loading='lazy' alt={alt} src={src} width={width} height={height} srcSet={srcSet(src, imageSizes)} sizes={sizes(imageSizes)} data-aue-prop={itemProp} data-aue-type="media" data-aue-label='Asset'/>
    </picture>
  );
};