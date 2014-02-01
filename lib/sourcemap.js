var path = require('path');

var SourceMapGenerator = require('source-map').SourceMapGenerator;
var SourceMapConsumer  = require('source-map').SourceMapConsumer;


// List of properties in Source Map format
var properties = [
    'version', 'file', 'mappings',
    'sources', 'sourcesContent', 'names'
];

function SourceMap(params) {
    // FIXME: check compulsory ones?
    properties.forEach(function(prop) {
        this[prop] = params[prop];
    }.bind(this));
}

SourceMap.prototype.copy = function(override) {
    var params = {};
    properties.forEach(function(prop) {
        params[prop] = override[prop] || this[prop];
    }.bind(this));
    return new SourceMap(params);
};

/**
 * Apply a new source map onto the current one and generate a composed
 * mapping from the original file.
 *
 * @param {SourceMap|Object} nextSourceMap Source map for a new transformation applied after the current source map.
 * @param {String} nextSourceFilename Filename of the generated source file the nextSourceMap is associated with.
 * @return {SourceMap} A new source map composing both the current and the next.
 */
SourceMap.prototype.apply = function(nextSourceMap, nextSourceFilename) {
    var currentMap = new SourceMapConsumer(this);
    var nextMap    = new SourceMapConsumer(nextSourceMap);

    var generator = SourceMapGenerator.fromSourceMap(nextMap);
    generator.applySourceMap(currentMap);
    return fromMapGenerator(generator);
};

SourceMap.prototype.append = function() {

    var generator = new SourceMapGenerator({
        file: destFilename
    });

    // Append each resource
    var map = new SourceMapConsumer(otherSourceMap);

    // FIXME: append self, or start from self?

    // Rebase the mapping by the lineOffset
    map.eachMapping(function(mapping) {
        generator.addMapping({
            generated: {
                line: mapping.generatedLine + offset,
                column: mapping.generatedColumn
            },
            original: {
                line: mapping.originalLine,
                column: mapping.originalColumn
            },
            source: mapping.source
        });
    });

    return fromMapGenerator(generator);
};

// SourceMap.prototype.concat = function() {

//     var lineOffset = 0;
//     var generator = new SourceMapGenerator({
//         file: destFilename
//     });

//     // Append each resource
//     sourceMapsAndOffsets.forEach(function(smao) {
//         var map = new SourceMapConsumer(smao.sourceMap);

//         // Rebase the mapping by the lineOffset
//         map.eachMapping(function(mapping) {
//             generator.addMapping({
//                 generated: {
//                     line: mapping.generatedLine + lineOffset,
//                     column: mapping.generatedColumn
//                 },
//                 original: {
//                     line: mapping.originalLine,
//                     column: mapping.originalColumn
//                 },
//                 source: mapping.source
//             });
//         });

//         lineOffset += smao.offset;
//     });

//     return fromMapGenerator(generator);
// };


SourceMap.prototype.mapSourcePaths = function(mapper) {
    return this.copy({
        sources: this.sources.map(function(sourcePath) {
            return mapper(sourcePath);
        })
    });
};

SourceMap.prototype.rebaseSourcePaths = function(targetDir) {
    return this.mapSourcePaths(function(sourcePath) {
        return path.relative(targetDir, sourcePath);
    });
};

SourceMap.prototype.toString = function() {
    return JSON.stringify(this);
};



function fromMapObject(sourceMapObject) {
    return new SourceMap(sourceMapObject);
}

function fromMapGenerator(sourceMapGenerator) {
    return fromMapObject(sourceMapGenerator.toJSON());
}

function fromMapData(sourceMapData) {
    return fromMapObject(JSON.parse(sourceMapData));
}

function fromSource(data, sourcePath) {
    var generator = new SourceMapGenerator({
        // FIXME: or just filename?
        file: path.basename(sourcePath)
    });

    generator.setSourceContent(sourcePath, data);

    data.split('\n').forEach(function(l, i) {
        generator.addMapping({
            generated: { line: i + 1, column: null },
            original:  { line: i + 1, column: null },
            source: sourcePath
        });
    });

    return fromMapObject(generator.toJSON());
}


module.exports = {
    fromMapObject: fromMapObject,
    fromSource: fromSource
};
