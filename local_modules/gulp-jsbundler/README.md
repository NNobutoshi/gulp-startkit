# gulp_jsbundler.js
---

gulp-concat でJavaScript ファイルを束ねるGulp タスク用。  
"/example/" のpackage.json は親階層をローカルモジュールとして読み込んでいるので注意してください。

"/example/gulpfile.js" の読み込み部分
```
,jsBundler   = require('gulp-jsbundler') /* local module */
```

"/example/package.json" の"devDependencies"
```
"gulp-jsbundler": "../",
```