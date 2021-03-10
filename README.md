# gulp_startkit

静的な 中規模Web サイトのGulp による製作用。

## 想定

- プロジェクトはGit でバージョン管理下にあること。

- 各package は、開発開始時に最新版をインストール。  
その後 npm shrinkwrap など行って、共有。

- dist もバージョン管理下に置く想定。

## 差分ビルド

ほぼ、すべてのタスクで行う。
依存関係にあるファイルを一緒に通したり、```git diff``` で差異のあるものをだけを通したり。
ただし、```gulp.src()``` を通った後。

src 1ファイル → dist 1ファイル のようなタスクは、```gulp.lastRun()``` と併用する。  

JavaScript 用のタスクだけは、Webpack のcache を利用する。
