# gulp_htmlinc.js
---

HTML ファイルを静的インクルード  
"/example/" のpackage.json で親階層をローカルモジュールとして読み込んでいるので注意してください。

"/example/gulpfile.js" の読み込み部分
```
,htmlInc = require('gulp-htmlinc') /* local module */
```

"/example/package.json" の"devDependencies"
```
"gulp-htmlinc": "../",
```