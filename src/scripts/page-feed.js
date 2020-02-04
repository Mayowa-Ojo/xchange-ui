// Page feed class
import CacheStorage from './cache.js'

class PageFeed {
    constructor() {
        this.listElement = document.querySelector('.feed-container')

        this.populateFeed()
    }

    getCountryCodes() {        
        // read json file
        return fetch('/xchange-ui/src/assets/data/country-code.json')
            .then(res => res.json())
            .then(data => data)
            .catch(err => console.error(err))
    }

    populateFeed() {
        // get cache data
        const cacheData = CacheStorage.getCacheData()
        console.log(cacheData)
        this.getCountryCodes().then(countryCodes => {
            // loop through cache data and call generate function
            for(let i = cacheData.length-1; i >= 0; i--) {
                this.generateFeedItem(cacheData[i], countryCodes)
            }
        })
    }

    generateFeedItem(data, countryCodes) {
        const inner_html = `<p class="feed-title">currency</p>
            <div class="feed-content">
                <img class="country-flag" src="./assets/svg/${countryCodes[data.base]}.svg" alt="${countryCodes[data.base]} flag">
                <p>${data.base} (${data.input})</p>
                <i class="fas fa-long-arrow-alt-right"></i>
                <img class="country-flag" src="./assets/svg/${countryCodes[data.target]}.svg" alt="${countryCodes[data.target]} flag">
                <p>${data.target} (${data.result})</p>
            </div>`
        const listItem = document.createElement('li')

        listItem.classList.add('feed')
        listItem.innerHTML = inner_html
        this.listElement.appendChild(listItem)
    }

    refreshFeed() {
        // remove previous feed list
        this.listElement.innerHTML = ''
        // add updated feed
        this.populateFeed()
    }
}

export default PageFeed