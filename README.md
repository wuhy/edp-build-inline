edp-build-inline
========

[![Dependency Status](https://david-dm.org/wuhy/edp-build-inline.svg)](https://david-dm.org/wuhy/edp-build-inline) [![devDependency Status](https://david-dm.org/wuhy/edp-build-inline/dev-status.svg)](https://david-dm.org/wuhy/edp-build-inline#info=devDependencies) [![NPM Version](https://img.shields.io/npm/v/edp-build-inline.svg?style=flat)](https://npmjs.org/package/edp-build-inline)  

> EDP Build plugin for inline resource

edp-build-inline 是 [edp-build](https://github.com/ecomfe/edp-build) 的一个插件，用于内联静态资源，支持图片、脚本、样式等。

## Usage

### Install

```shell
npm install edp-build-inline
```

### Config
```javascript
    var InlineProcessor = require('edp-build-inline');
    
    // 对样式图片内联
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



### Options

* files - `Array.<string|RegExp>` `optional` 要替换处理的文件，默认 `['*.css', '*.html', '*.tpl', '!dep/**/*']`

* inlineOption - `Object` 内联选项，更多内联选项参考 [inline-resource](https://github.com/wuhy/inline-resource) 

    * css - `boolean|Object` `optional` 是否内联样式文件
    
        ```javascript
        css: {
            // 是否重新计算内联后的样式文件的 url，默认 false
            rebase: false, 
            rebase: {
                absolute: true, // 重新计算为绝对地址
                ignore: function (url, relativeFile, targetFile) { // 忽略某些 url rebase
                    return false;
                }
            },
            rebase: function (url, relativeFile, targetFile) { //  自定义 rebase
                var isLocalPath = this.isLocal(url);
                var absPath = this.resolve(url, relativeFile);
                var rebasePath = this.rebase(url, relativeFile, targetFile);
                return url;
            }
        }
        ```
    
    * js - `boolean|Object` `optional` 是否内联 js
      
      ```javascript
      js: {
          // 是否使用定制的内联方法，默认 false
          // e.g., var tpl = '__inline("./a.tpl")'; // output: var tpl = '<inline tpl content>'
          // '__inline("./a.js")' // output: <inline js file content>
          custom: false
      }
      ``` 
    
    * html - `boolean|Object` `optional` 是否内联 html
    
    * img - `boolean|Object` `optional` 是否内联图片
    
        ```javascript
        img: {
            // 当图片大小 <= 1024byte 才进行内联
            limit: 1024
        }
        ```

    * font - `boolean|Object` `optional` 是否内联字体文件
        
        ```javascript
            font: {
                // 当字体文件大小 <= 1024byte 才进行内联
                limit: 1024
            }
        ```
    
    * svg - `boolean|Object` `optional` 是否内联 svg 文件，默认使用 base64 编码内联   
    
        ```javascript
        svg: {
            // 默认使用 base64 编码内联，`useSource` 为 true，则源文件内联，
            // 只针对 html 文件内联有效
            useSource: false, 
            
            // 当 svg 文件大小 <= 1024byte 才进行内联
            limit: 1024,
        }
        ```
    * inlinePathResolver - `Function` `optional` 重新计算内联文件路径       
    
        ```javascript
        {
            inlinePathResolver: function (path, file) {
                return path.replace(/{%site_host%}\//, '');
                
                // 指定返回的路径相对的目录
                // return {path: path, dir: '.'};
            }
        }
        ```
    
    * processor - `Object` `optional` 自定义的文件所使用的处理器类型定义，可选
        
         ```javascript
        {
            processor: { // 指定特定类型文件使用的处理器类型，key 为文件的扩展名
                mustache: 'html'
            },
        }
        ```
        
    * inlineAll - `boolean` `optional` 是否自动内联所有的本地资源，而不是通过指定 url 查询参数方式来进行内联，默认通过查询参数方式指定内联
        
        ```javascript
        {
            inlineAll: true, // 对于 `inlineAll` 为 true，需要手动指定要全部内联的资源类型
            css: true,       // 内联所有的 css 资源 
        }
        ```
        
        ```css
        .icon {
            /* 使用查询参数方式指定要内联的图片 */
            background: url(img/loading.gif?_inline)
        }
        ```
     
    * inlineParamName - `string` `optional` 内联查询参数名称，可选，默认 `_inline`   

* customTask - `Object` `optional` 自定义的内联任务

    ```javascript
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
    ```
