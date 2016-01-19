edp-build-inline
========

> EDP Build plugin for inline resource

edp-build-inlnie 是 [edp-build](https://github.com/ecomfe/edp-build) 的一个插件，用于内联静态资源，支持图片、脚本、样式等。

## 如何使用

```css
.icon {
    /* 使用查询参数方式指定要内联的图片 */
    background: url(img/loading.gif?_inline)
}
```

```javascript
    var InlineProcessor = require('edp-build-inline');
    
    // 复杂自定义任务
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
        inlineOption: {
            img: true,
            inlinePathGetter: function (path) {
                var newPath = path.replace(/\{\$host\}\//, '');
                return {path: newPath, dir: '.'};
            }
        }
    });
    
    // 简单：只对样式图片内联
    var inlineProcessor = new InlineProcessor({
        files: ['src/main.css'],
        inlineOption: {
            img: {
                limit: 1024 * 5 // 小于 5kb 图片才内联
            }
        }
    });
        
    return {
        'default': [
            lessProcessor, moduleProcessor, inlineProcessor, pathMapperProcessor
        ],

        'release': [
            lessProcessor, cssProcessor, moduleProcessor,
            jsProcessor, inlineProcessor, pathMapperProcessor, addCopyright
        ]
    };
```

更多内联选项 `inlineOption` 参考 [inline-resource](https://github.com/wuhy/inline-resource) 。
