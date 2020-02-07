// cache recent conversions
class CacheStorage {
    constructor() {
        this.userInput = document.querySelector('#user-input')
        this.result = document.querySelector('.result')
        
        // this.addEventListener()
    }

    getCurrentConversion() {
        const base = document.querySelector('#primary-currency').value
        const target = document.querySelector('#target-currency').value
        const input = JSON.parse(this.userInput.value).toLocaleString('ja-JP', {style: 'currency', currency: `${base}`})
        const result = document.querySelector('.result').innerText

        return {
            base,
            target,
            input,
            result
        }
    }

    static getCacheData() {
        const data = window.localStorage.getItem('cache')
        
        if(data) {
            return JSON.parse(data)
        } else return false
    }

    setCacheData(data, isNewData) {
        if(isNewData) {
            window.localStorage.setItem('cache', JSON.stringify([data]))
        } else {
            const cacheData = CacheStorage.getCacheData()
            // check if cache limit is reached
            const updatedCache = this.checkCacheLimit(cacheData)
            updatedCache.push(data)
            window.localStorage.setItem('cache', JSON.stringify(updatedCache))
        }
    }

    // addEventListener() {
    //     this.userInput.addEventListener('keypress', this.checkForNewData.bind(this))
    // }

    checkForNewData() {
        console.log("Checking for new data...")
        
        const currentConversion = this.getCurrentConversion()
        const cacheStorage = CacheStorage.getCacheData()
        // check if conversion is in cache
        if(!this.checkForDuplicate(cacheStorage, currentConversion).isDuplicate) {
            // set cache storage
            if(cacheStorage) {
                this.setCacheData(currentConversion, false)
            } else this.setCacheData(currentConversion, true)
        } else console.log('Cache duplicate found!')
    }

    checkForDuplicate(cache, entry) {
        let result = {}

        if(cache) {
            result.isDuplicate = cache.some(item => item.base == entry.base && item.target == entry.target && item.input == entry.input)
        } else {
            result.isDuplicate = false
        }

        return result
    }

    checkCacheLimit(cache) {
        if(cache.length >= 15) {
            cache.shift()

            return cache
        } else return cache
    }
}

export default CacheStorage