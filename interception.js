/** 向window中添加当前用户的所有收藏视频 */
async function initMedias() {
    const mid = document.cookie
        ?.split('; ')
        ?.map(str => str.split('='))
        ?.find(item => item[0] === 'DedeUserID')
        ?.[1]
    if (!mid) {
        return
    }
    const url = `https://api.bilibili.com/x/v3/fav/folder/created/list-all?up_mid=${mid}`
    const favLists = await fetch(url, { credentials: "include" })
        .then(res => res.json())
        .then(data => data?.data?.list)
    const mediaLists = await Promise.all(favLists?.map(async item => {
        const favId = item.id
        const mediaCount = item.media_count
        const totalPage = Math.ceil(mediaCount / 20)
        const mediaLists = await Promise.all(new Array(totalPage).fill().map((item, index) => {
            const url = `https://api.bilibili.com/x/v3/fav/resource/list?media_id=${favId}&pn=${index + 1}&ps=20&keyword=&order=mtime&type=0&tid=0&platform=web`
            return fetch(url, { credentials: "include" }).then(res => res.json()).then(data => data.data.medias)
        }))
        return mediaLists.flat()
    }))
    window.__MEDIAS = mediaLists.flat()
}