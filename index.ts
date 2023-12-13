import puppeteer from "puppeteer"
(async function () {
    const broswer = await puppeteer.launch({ headless: false })
    const page = await broswer.newPage()
    await page.setRequestInterception(true)
    page.on('request', req => {
        const type = req.resourceType()
        if (type === 'document' || type === 'stylesheet') {
            req.continue()
        } else {
            req.abort()
        }
    })
    await page.goto('https://www.bilibili.com/')
})()