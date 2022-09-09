const nxPreset = require('@nrwl/jest/preset').default;

module.exports = {
  ...nxPreset,
  testMatch: ['**/?(*.)+(spec|e2e-spec|smoke-spec).[jt]s?(x)'],
};
