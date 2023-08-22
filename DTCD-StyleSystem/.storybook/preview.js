import baseComponentList from '../src/base-components/components';

import './temp-global-styles.css';

try {
  baseComponentList.forEach(component => {
    const { name, baseClass } = component;
    window.customElements.define(name, baseClass);
  });
} catch (error) {
  console.log(error);
}

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: 'white',
    values: [
      {
        name: 'white',
        value: '#fefefe',
      },
      {
        name: 'black',
        value: '#353542',
      },
    ],
  },
}