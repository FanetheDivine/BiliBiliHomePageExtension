(() => {
    const mid = document.cookie
        ?.split('; ')
        ?.map(str => str.split('='))
        ?.find(item => item[0] === 'DedeUserID')
        ?.[1]
    if (!mid) {
        alert('未登录，无法启用插件功能')
        return
    }
    const container = document.querySelector('.recommended-swipe.grid-anchor')
    container.style.position = 'relative'
    const rollButton = document.createElement('button')
    container.append(rollButton)
    rollButton.classList.add('primary-btn')
    rollButton.style = 'position:absolute;top:0;right:100%;transform:translate(-10px);height:auto;'
    rollButton.innerText = '换一批'
    rollButton.addEventListener('click', rollCards)
    const card = document.createElement('div')
    container.append(card)
    card.style = 'position:absolute;inset:0 0 0 0;z-index:1;background-color:white;display:grid;grid-template-columns: repeat(2,1fr);grid-gap:20px;'

    let videoIndex = 0
    async function rollCards() {
        if (!window.__MEDIAS) {
            return
        }
        const videos = []
        new Array(4).fill().forEach(() => {
            if (videoIndex === window.__MEDIAS.length) {
                videoIndex = 0
            }
            videos.push(window.__MEDIAS[videoIndex])
            ++videoIndex
        })
        const videoInfo = videos.map(item => {
            return getVideoCard(
                `https://www.bilibili.com/video/${item.bvid}`,
                item.cover.replace('http', 'https'),
                item.cnt_info.view_text_1,
                item.cnt_info.danmaku,
                formateTime(item.duration),
                item.title,
                `https://space.bilibili.com/${item.upper.mid}`,
                item.upper.name,
                new Date(item.pubtime * 1000).toLocaleDateString()
            )
        })
        card.innerHTML = videoInfo.join('')
    }

    function formateTime(time) {
        const h = parseInt(time / 3600)
        const minute = parseInt(time / 60 % 60)
        const second = Math.ceil(time % 60)

        const hours = h < 10 ? '0' + h : h
        const formatSecond = second > 59 ? 59 : second
        return `${hours > 0 ? `${hours}:` : ''}${minute < 10 ? '0' + minute : minute}:${formatSecond < 10 ? '0' + formatSecond : formatSecond}`
    }

    /** 向window中添加当前用户的所有收藏视频 */
    (async () => {
        const url = `https://api.bilibili.com/x/v3/fav/folder/created/list-all?timestamp=${new Date().getTime()}&up_mid=${mid}`
        const favLists = await fetch(url, { credentials: "include" })
            .then(res => res.json())
            .then(data => data?.data?.list)
        const mediaLists = await Promise.all(favLists?.map(async item => {
            const favId = item.id
            const mediaCount = item.media_count
            const totalPage = Math.ceil(mediaCount / 20)
            const mediaLists = await Promise.all(new Array(totalPage).fill().map((item, index) => {
                const url = `https://api.bilibili.com/x/v3/fav/resource/list?timestamp=${new Date().getTime()}&media_id=${favId}&pn=${index + 1}&ps=20&keyword=&order=mtime&type=0&tid=0&platform=web`
                return fetch(url, { credentials: "include" }).then(res => res.json()).then(data => data.data.medias)
            }))
            return mediaLists.flat()
        }))
        window.__MEDIAS = mediaLists?.flat().sort(() => Math.random() - 0.5)
        rollCards()
    })()

    function getVideoCard(videoHref, cover, view, bullet, duration, title, uploaderHref, uploader, uploadDate) {
        return `
<div data-v-6f3c6166="" class="feed-card">
    <div data-v-6f3c6166="" class="bili-video-card is-rcmd" data-report="tianma.1-1-1.click"
        style="--cover-radio: 56.25%;">
        <div class="bili-video-card__wrap __scale-wrap">
                <a href="${videoHref}"
                target="_blank" rel="noopener" data-target-url="https://www.bilibili.com/video/BV1Yb4y137w3"
                data-spmid="333.1007" data-mod="tianma.1-1-1" data-idx="click">
                <div class="bili-video-card__image __scale-player-wrap bili-video-card__image--hover">
                    <div class="bili-video-card__image--wrap">
                        <picture class="v-img bili-video-card__cover" style="    box-shadow: #00ffd6 0 0 5px 1px;
                        "><img
                                src="${cover}"
                                alt="" loading="eager" onload=""
                                onerror="typeof window.imgOnError === 'function' &amp;&amp; window.imgOnError(this)">
                        </picture>
                    </div>
                    <div class="bili-video-card__mask">
                        <div class="bili-video-card__stats">
                            <div class="bili-video-card__stats--left"><span class="bili-video-card__stats--item"><svg
                                        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                        viewBox="0 0 24 24" width="24" height="24" fill="#ffffff"
                                        class="bili-video-card__stats--icon">
                                        <path
                                            d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z"
                                            fill="currentColor"></path>
                                        <path
                                            d="M14.7138 10.96875C15.50765 11.4271 15.50765 12.573 14.71375 13.0313L11.5362 14.8659C10.74235 15.3242 9.75 14.7513 9.75001 13.8346L9.75001 10.1655C9.75001 9.24881 10.74235 8.67587 11.5362 9.13422L14.7138 10.96875z"
                                            fill="currentColor"></path>
                                    </svg><span class="bili-video-card__stats--text">${view}</span></span><span
                                    class="bili-video-card__stats--item"><svg xmlns="http://www.w3.org/2000/svg"
                                        xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24"
                                        height="24" fill="#ffffff" class="bili-video-card__stats--icon">
                                        <path
                                            d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z"
                                            fill="currentColor"></path>
                                        <path
                                            d="M15.875 10.75L9.875 10.75C9.46079 10.75 9.125 10.4142 9.125 10C9.125 9.58579 9.46079 9.25 9.875 9.25L15.875 9.25C16.2892 9.25 16.625 9.58579 16.625 10C16.625 10.4142 16.2892 10.75 15.875 10.75z"
                                            fill="currentColor"></path>
                                        <path
                                            d="M17.375 14.75L11.375 14.75C10.9608 14.75 10.625 14.4142 10.625 14C10.625 13.5858 10.9608 13.25 11.375 13.25L17.375 13.25C17.7892 13.25 18.125 13.5858 18.125 14C18.125 14.4142 17.7892 14.75 17.375 14.75z"
                                            fill="currentColor"></path>
                                        <path
                                            d="M7.875 10C7.875 10.4142 7.53921 10.75 7.125 10.75L6.625 10.75C6.21079 10.75 5.875 10.4142 5.875 10C5.875 9.58579 6.21079 9.25 6.625 9.25L7.125 9.25C7.53921 9.25 7.875 9.58579 7.875 10z"
                                            fill="currentColor"></path>
                                        <path
                                            d="M9.375 14C9.375 14.4142 9.03921 14.75 8.625 14.75L8.125 14.75C7.71079 14.75 7.375 14.4142 7.375 14C7.375 13.5858 7.71079 13.25 8.125 13.25L8.625 13.25C9.03921 13.25 9.375 13.5858 9.375 14z"
                                            fill="currentColor"></path>
                                    </svg><span class="bili-video-card__stats--text">${bullet}</span></span></div><span
                                class="bili-video-card__stats__duration">${duration}</span>
                        </div>
                    </div>
                </div>
                <h3 class="bili-video-card__info--tit">${title}</h3>
            </a>
            <div class="bili-video-card__info __scale-disable">\x3C!----><div class="bili-video-card__info--right">
                    <div class="bili-video-card__info--bottom">\x3C!----><a class="bili-video-card__info--owner"
                            href="${uploaderHref}"
                            target="_blank" data-spmid="333.1007" data-mod="tianma.1-1-1" data-idx="click"><svg
                                xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                viewBox="0 0 24 24" width="24" height="24" fill="currentColor"
                                class="bili-video-card__info--owner__up">
                                <path
                                    d="M6.15 8.24805C6.5642 8.24805 6.9 8.58383 6.9 8.99805L6.9 12.7741C6.9 13.5881 7.55988 14.248 8.3739 14.248C9.18791 14.248 9.8478 13.5881 9.8478 12.7741L9.8478 8.99805C9.8478 8.58383 10.1836 8.24805 10.5978 8.24805C11.012 8.24805 11.3478 8.58383 11.3478 8.99805L11.3478 12.7741C11.3478 14.41655 10.01635 15.748 8.3739 15.748C6.73146 15.748 5.4 14.41655 5.4 12.7741L5.4 8.99805C5.4 8.58383 5.73578 8.24805 6.15 8.24805z"
                                    fill="currentColor"></path>
                                <path
                                    d="M12.6522 8.99805C12.6522 8.58383 12.98795 8.24805 13.4022 8.24805L15.725 8.24805C17.31285 8.24805 18.6 9.53522 18.6 11.123C18.6 12.71085 17.31285 13.998 15.725 13.998L14.1522 13.998L14.1522 14.998C14.1522 15.4122 13.8164 15.748 13.4022 15.748C12.98795 15.748 12.6522 15.4122 12.6522 14.998L12.6522 8.99805zM14.1522 12.498L15.725 12.498C16.4844 12.498 17.1 11.8824 17.1 11.123C17.1 10.36365 16.4844 9.74804 15.725 9.74804L14.1522 9.74804L14.1522 12.498z"
                                    fill="currentColor"></path>
                                <path
                                    d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z"
                                    fill="currentColor"></path>
                            </svg>
                            <span class="bili-video-card__info--author">${uploader}</span>
                            <span class="bili-video-card__info--date">·${uploadDate}</span></a></div>
                </div>
            </div>
        </div>
    </div>
</div>
        `
    }
})()
