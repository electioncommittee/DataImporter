# Data Importer

這個 repo 負責將中選會的 xlsx 轉成比較好看的格式，然後才會入資料庫。

匯入資料庫的程式放在 src 內。預先 parse 的資料放在 res 內。

## 資料匯入方法

將 `.env.sample` 複製一份至 `.env` ，然後在 `.env` 中填入資料庫帳號密碼等資料。接著安裝必要模組：
```bash
npm i
```

執行程式。
```bash
npm start
```
