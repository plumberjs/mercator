var util = require('./lib/util.js');

module.exports = {
  SourceMap: require('./lib/sourcemap.js'),
  stripSourceMappingComment:       util.stripSourceMappingComment,
  generateJsSourceMappingComment:  util.generateJsSourceMappingComment,
  generateCssSourceMappingComment: util.generateCssSourceMappingComment
};
