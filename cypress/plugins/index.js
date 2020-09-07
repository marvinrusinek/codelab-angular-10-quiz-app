const cypressTypeScriptPreprocessor = require('./cy-ts-preprocessor');
const {
  addMatchImageSnapshotPlugin
} = require('cypress-image-snapshot/plugin');

module.exports = (on, config) => {
  addMatchImageSnapshotPlugin(on, config);
  // on('file:preprocessor', cypressTypeScriptPreprocessor);
};
