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

## コマンド

```
$ npm run dev
```

環境変数に``` NODE_ENV=development WATCH_ENV=1 SERVE_ENV=1 DIFF_ENV=1 ```を含むコマンドのエイリアス。  
source map、```Gulp.watch()```、server（Browsersync）、差分ビルドを有効にする。

※ Browsersync を有効にするには設定ファイル（```/gulpkit.js/config_serve.js```）の用意が必要。```/gulpkit.js/conifig_serve_orig.js```を複製、リネームして利用し、リネーム後のファイル名は、Git でignore されていて、server のIP アドレス等は、実装者各々で設定自由にする。
```
$ npm run one
```
環境変数に```NODE_ENV=development WATCH_ENV=0 SERVE_ENV=0 DIFF_ENV=0```を含むコマンドのエイリアス。
watch はされず、server も差分ビルドも無効。

```
$ npm run prod
```
環境変数に```NODE_ENV=production WATCH_ENV=0 SERVE_ENV=1 DIFF_ENV=0```を含むコマンドのエイリアス。  
```NODE_ENV=producrion```により```/gulpkit.js/config.js```の設定でCSS 、JavaScript の圧縮や、dest 先のフォルダの変更などを行う。  
以上のコマンドは、末尾に半角スペースの後、単体タスク名を入力で、各環境変数に従った実行が可能。例（```npm run dev html_pug```）。
```
$ npm run pug_tmp_engine
```
Exel ファイルの表に従って、Pug ファイルを量産する。
すでに表中のPug ファイルが存在する場合は、Pug 用のデータファイルのみ更新される。

## Vagrant

Vagrant も一応の使用が可能。
```
$ vagrant up
$ vagrant ssh
$ cd myproject
```
後、以下前述のコマンド通り。

- CentOS8（変更を予定）
- Node.js 14.15.4
- Apache

IP アドレス等は、```/vagrant_config.yml```を用意して実装者各々で設定自由｡
