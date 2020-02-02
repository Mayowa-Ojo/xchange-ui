// cache recent conversions
class CacheStorage {
    constructor() {
        // this.getCurrentConversion = this.getCurrentConversion.bind(this)
        // this.checkForNewData = this.checkForNewData.bind(this)
        // this.addEventListener = this.addEventListener.bind(this)
        
        this.addEventListener()
    }

    getCurrentConversion() {
        const base = document.querySelector('#primary-currency').value
        const target = document.querySelector('#target-currency').value
        const input = this.userInput.value

        return {
            base,
            target,
            input
        }
    }

    getCacheStorage() {
        const data = window.localStorage.getItem('cache')
        
        if(data) {
            return JSON.parse(data)
        } else return false
    }

    setCacheStorage(data, isNewData) {
        if(isNewData) {
            window.localStorage.setItem('cache', JSON.stringify([data]))
        } else {
            const cacheData = this.getCacheStorage()
            cacheData.push(data)
            window.localStorage.setItem('cache', JSON.stringify(cacheData))
        }
    }

    addEventListener() {
        this.userInput = document.querySelector('#user-input')

        this.userInput.addEventListener('keypress', this.checkForNewData.bind(this))
    }

    checkForNewData(e) {
        if(e.which === 13) {
            console.log("Checking for new data...")
            
            const currentConversion = this.getCurrentConversion()
            const cacheStorage = this.getCacheStorage()
            // check if conversion is in cache
            if(!this.checkForDuplicate(cacheStorage, currentConversion).isDuplicate) {
                // set cache storage
                if(cacheStorage) {
                    this.setCacheStorage(currentConversion, false)
                } else this.setCacheStorage(currentConversion, true)
            } else console.log('Cache duplicate found!')
        }
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

    validateConversion() {

    }
}

export default CacheStorage