# 用户收藏夹
```ts
const mid = '用户的mid'
const url = `https://api.bilibili.com/x/v3/fav/folder/created/list-all?up_mid=${mid}`
const favList = await fetch(url)
    .then(res=>res.json())
    .then(data=>data.data.list)
const favId = favList[0].id//默认收藏夹的id
```
# 收藏夹内容
```ts
const favId = '收藏夹id'
const pageNum = '页数(>0)'
const url = `https://api.bilibili.com/x/v3/fav/resource/list?media_id=${favId}&pn=${pageNum}&ps=20&keyword=&order=mtime&type=0&tid=0&platform=web`
const favMedias = await fetch(url)//收藏夹前20个视频
    .then(res=>res.json())
    .then(data=>data.data.medias)
```