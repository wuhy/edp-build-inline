edp-build-inline
========

> EDP Build plugin for inline resource

edp-build-inlnie 是 [edp-build](https://github.com/ecomfe/edp-build)的一个插件，用于内联静态资源，支持图片、脚本、样式等。

## 如何使用

```javascript
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
```
