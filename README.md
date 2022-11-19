# 非公式tverプレイヤー

Linux,Windowsでtverをリモコン操作で見ることができるアプリ。（現在はキーボードのみ。）

## 依存

*   python3
*   yt-dlp  
    (自分でビルドする場合)
*   nodejs
*   electron
*   electron-forge

```shell
npm i electron-forge
```

## ビルド

```shell
 npm run make
```

## 直接実行

```shell
 npm run start
```

## 使い方

esc=戻る  
1-7チャンネル（ストリーミングのとき）  
l=番組リスト（ストリーミングのとき）  
↑↓=移動（番組リストのとき）  
↑=時刻表示/非表示切り替え(プレイヤーのとき)  
スペース=再生/一時停止切り替え(プレイヤーのとき)
