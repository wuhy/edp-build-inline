/**
 * @file config edp-build
 * @author EFE
 */

/* globals LessCompiler, CssCompressor, JsCompressor, PathMapper, AddCopyright, ModuleCompiler, TplMerge */

exports.input = __dirname;

var path = require('path');
exports.output = path.resolve(__dirname, 'output');

// var moduleEntries = 'html,htm,phtml,tpl,vm,js';
// var pageEntries = 'html,htm,phtml,tpl,vm';

exports.getProcessors = function () {
    var lessProcessor = new LessCompiler();
    var cssProcessor = new CssCompressor();
    var moduleProcessor = new ModuleCompiler();
    var jsProcessor = new JsCompressor();
    var pathMapperProcessor = new PathMapper();
    var addCopyright = new AddCopyright();

    var InlineProcessor = require('edp-build-inline');
    var escapeTask = function (file) {
        return file.data.replace(/\{|\}/g, function (match) {
            return {'{': '{ldelim}', '}': '{rdelim}'}[match];
        });
    };
    var inlineProcessor = new InlineProcessor({
        files: ['templates/index.tpl'],
        customTask: {
            js: escapeTask,
            css: escapeTask
        },
        img: false,
        inlineOption: {
            inlinePathGetter: function (path) {
                var newPath = path.replace(/\{\$host\}\//, '');
                return {path: newPath, dir: '.'};
            }
        }
    });
    return {
        'default': [
            lessProcessor, moduleProcessor, inlineProcessor, pathMapperProcessor
        ],

        'release': [
            lessProcessor, cssProcessor, moduleProcessor,
            jsProcessor, pathMapperProcessor, addCopyright
        ]
    };
};

exports.exclude = [
    'tool',
    'doc',
    'test',
    'module.conf',
    'dep/packages.manifest',
    'dep/*/*/test',
    'dep/*/*/doc',
    'dep/*/*/demo',
    'dep/*/*/tool',
    'dep/*/*/*.md',
    'dep/*/*/package.json',
    'edp-*',
    '.edpproj',
    '.svn',
    '.git',
    '.gitignore',
    '.idea',
    '.project',
    'Desktop.ini',
    'Thumbs.db',
    '.DS_Store',
    '*.tmp',
    '*.bak',
    '*.swp'
];

/* eslint-disable guard-for-in */
exports.injectProcessor = function (processors) {
    for (var key in processors) {
        global[key] = processors[key];
    }
};
