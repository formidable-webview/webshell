import React, { ComponentClass } from 'react';
import makeWebshell, { FeatureBuilder, MinimalWebViewProps } from '.';

const Test = new FeatureBuilder({
  className: '',
  defaultOptions: {},
  featureIdentifier: '',
  script: ''
})
  .withEventHandlerProp<boolean, 'onDOM'>('onDOM')
  .withEventHandlerProp<boolean, 'onThat'>('onThat')
  .build();

const Webshell = makeWebshell(
  {} as ComponentClass<MinimalWebViewProps>,
  new Test()
);

<Webshell onDOM={() => ({})} onThat={() => ({})} />;
