# Data Importer

這個 repo 負責將中選會的 xlsx 轉成比較好看的格式，這些預處理的資料先放在 `/res` 內，然後才會匯入資料庫。

資料庫匯入的主程式在 `/src` 內。

## 資料匯入

將 `/.env.sample` 複製一份至 `/.env` ，然後在 `/.env` 中填入資料庫的帳號密碼等資料。

接著安裝必要模組：
```bash
npm i
```

執行程式。
```bash
npm start
```

## 表格說明
此資料庫目前有 21 個表格，待罷免案資料匯入後會有更多。

以下給出各表格各欄位之說明。除非額外提及，否則所有欄位都是 `NOT NULL` 。
- 🔑 表 `PRIMARY KEY`
- 🗝️ 表 `UNIQUE KEY`

### cities
記錄各縣市之編號。該編號為流水號。

| column | type     | instuction |
| ---    | ---      | ---        |
| id     | tinyint  | 縣市編號    |
| name   | varchar  | 縣市名稱    |

- 🔑 `id`
- 🗝️ `name`

### districts
記錄各鄉/鎮/市/區的編號。鄉鎮市區之編號為三位數或四位數之非流水號。其除以 100 之商值為其所屬縣市編號。

| column | type     | instuction |
| ---    | ---      | ---        |
| id     | smallint | 鄉/鎮/市/區編號    |
| name   | varchar  | 鄉/鎮/市/區名稱    |
| city   | tinyint  | 所屬縣市編號 |

- 🔑 `id`
- 🗝️ `city` `name`

### villages
記錄各村里之編號。村里編號為至少七位數之非流水號。其除以 1000 之商值為期所屬鄉鎮市區之編號。

| column | type     | instuction |
| ---    | ---      | ---        |
| id     | int      | 村里編號    |
| name   | varchar  | 村里名稱    |
| dist   | smallint | 所屬鄉/鎮/市/區編號 |

- 🔑 `id`
- 🗝️ `dist` `name`

### parties
記錄各政黨之編號。政黨編號為流水號，惟 `-1` 對應至 `NULL` 表無黨籍。除無黨籍之 `name` 值為 `NULL` 之外，其餘記錄皆為 `NOT NULL` 。

| column | type     | instuction |
| ---    | ---      | ---        |
| id     | tinyint      | 政黨編號        |
| name   | varchar  | 政黨名稱    |

- 🔑 `id`
- 🗝️ `name`

### candidates
記錄各候選人之編號。候選人編號為流水號。

| column | type     | instuction |
| ---    | ---      | ---        |
| id     | smallint      | 候選人編號        |
| name   | varchar  | 候選人名稱    |

- 🔑 `id`
- 🗝️ `name`
    - 遇同名同姓者，後方以括弧加註其政黨

### legislator_constituencies
記錄各村里於各次區域立委選舉中，所屬之選區。

選區編號除以 100 之商數為該選區所屬縣市之編號，餘數為該選區之編號。
- 例如 105 為台北市第五選區。因為 105 / 100 = 1 為台北市之編號， 105 % 100 = 5 表第五選區。

| column | type     | instuction |
| ---    | ---      | ---        |
| year     | int      | 選舉年份        |
| vill_id   | varchar  | 村里    |
| cst    | smallint | 所屬選區 |

- 🔑 `year` `id`

### (legislator_at_large|legislator|president|local)_polls
記錄各次選舉之票數。
- `legislator_at_large` 不分區立委選舉
- `legislator` 區域立委選舉
- `president` 總統選舉
- `local` 地方首長選舉

| column | type     | instuction |
| ---    | ---      | ---        |
| vill_id  | int    | 村里    |
| year   | smallint | 選舉年份    |
| no     | tinyint  | 號次    |
| poll   | int      | 得票數      |

- 🔑 `year` `no` `vill_id`

### (legislator_at_large|legislator|president|local)_voters
記錄各次選舉之投票權人數。

| column | type     | instuction |
| ---    | ---      | ---        |
| vill_id  | int    | 村里    |
| year   | smallint | 選舉年份    |
| no     | tinyint  | 號次    |
| voter  | int      | 投票權人數      |

- 🔑 `year` `no` `vill_id`

### legislator_at_large_candidates
記錄各次全國不分區立委選舉之參選政黨。

| column   | type     | instuction |
| ---      | ---      | ---        |
| year     | smallint | 選舉年份    |
| no       | tinyint  | 號次    |
| party_id | tinyint  | 參選政黨    |

- 🔑 `year` `no`
- 🗝️ `year` `party_id`

### legislator_candidates
記錄各次全國區域立委選舉之候選人。

| column   | type     | instuction |
| ---      | ---      | ---        |
| year     | smallint | 選舉年份    |
| cst      | smallint | 選區    |
| no       | tinyint  | 號次   |
| cand_id  | smallint | 候選人     |
| party_id | tinyint  | 推薦政黨    |

- 🔑 `year` `cst` `no`
- 🗝️ `year` `cand_id`

### local_candidates
記錄各次地方首長選舉之候選人。

| column   | type     | instuction |
| ---      | ---      | ---        |
| year     | smallint | 選舉年份    |
| city     | tinyint  | 縣市    |
| no       | tinyint  | 號次   |
| cand_id  | smallint | 候選人     |
| party_id | tinyint  | 推薦政黨    |

- 🔑 `year` `city` `no`
- 🗝️ `year` `cand_id`

### president_candidates
記錄各次總統與副總統選舉之候選人。

| column   | type     | instuction |
| ---      | ---      | ---        |
| year     | smallint | 選舉年份    |
| no       | tinyint  | 號次       |
| cand_id  | smallint | 總統候選人     |
| vice_cand_id  | smallint | 副總統候選人     |
| party_id | tinyint  | 推薦政黨    |

- 🔑 `year` `no`
- 🗝️ `year` `cand_id`
- 🗝️ `year` `vice_cand_id`
- 🗝️ `year` `party_id`

### referendums
記錄各公投之資料。

| column   | type     | instuction |
| ---      | ---      | ---        |
| ref_case | tinyint| 公投案號次    |
| vill_id  | int | 村里    |
| consent  | int  | 同意票數       |
| against  | int | 反對票數     |
| void  | int | 無效票數     |
| voter | int  | 投票權人數    |

- 🔑 `ref_case` `vill_id`