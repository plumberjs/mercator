function readSourceMappingComment(source) {
    var match = source.match(/\/[*/][@#]\ssourceMappingURL=(\S+)\s*(?:\*\/)?\s*$/);
    return match && match[1];
}

function stripSourceMappingComment(source) {
    return source.replace(/\/[*/][@#]\ssourceMappingURL[^\r\n]*\n?/g, '');
}

function generateJsSourceMappingComment(sourceMapFilename) {
    if (! sourceMapFilename) {
        throw "Missing source map filename when calling generateJsSourceMappingComment";
    }

    return '//# sourceMappingURL=' + sourceMapFilename;
}

function generateCssSourceMappingComment(sourceMapFilename) {
    if (! sourceMapFilename) {
        throw "Missing source map filename when calling generateCssSourceMappingComment";
    }

    return '/*# sourceMappingURL=' + sourceMapFilename + ' */';
}


module.exports = {
  readSourceMappingComment: readSourceMappingComment,
  stripSourceMappingComment: stripSourceMappingComment,
  generateJsSourceMappingComment: generateJsSourceMappingComment,
  generateCssSourceMappingComment: generateCssSourceMappingComment
};
