const environments = {
  dev: {
    baseUrl: 'https://test-api.k6.io',
  },
  staging: {
    baseUrl: 'https://test-api.k6.io',
  },
  prod: {
    baseUrl: 'https://test-api.k6.io',
  },
};

export function getEnvironment() {
  const environment = __ENV.ENVIRONMENT || 'dev';
  const config = environments[environment];

  if (!config) {
    throw new Error(`Unknown environment: ${environment}`);
  }

  return config;
}
