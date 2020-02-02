window.onload = function() {
    console.log('Loading...')
    fetchData('USD', 'NGN')

    document.querySelector('#user-input').addEventListener('keypress', function(e) {
        if(e.which == 13) {
            displayResult()
        }
    })

    new SlideShow()
    new CacheStorage()
}

/*****************************************/
// Register service worker
if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
        .then(function() {
            console.log("service worker registered")
        })
}
/*****************************************/

const API_KEY = "c7229232ddf7bc2c77dc"

async function fetchData(primary, target) {
    const BASE_URL = `https://free.currconv.com/api/v7/convert?q=${primary}_${target},${target}_${primary}&compact=ultra&apiKey=${API_KEY}`
    const url = BASE_URL

    const response = await fetch(url)
    const data = await response.json()
        
    return data
}

function runConversion(value, multiplier) {
    return {
        result: (JSON.parse(value) * multiplier).toFixed(2)
    }
}

function displayResult() {
    const { primary, target, query } = getUserInput()
    // check if user input is empty
    const validation = validateUserInput(primary, target, query)
    if(!validation.isValid) {
        alert(validation.msg)
        return
    }
    const searchKey = `${primary}_${target}`
    fetchData(primary, target).then(data => {
        const rate = data[searchKey]
        // console.log(typeof rate)
        const { result } = runConversion(query, rate)
        const outputDisplay = document.querySelector('.result')
        outputDisplay.innerText = result
        console.log(result)
    })
}

function getUserInput() {
    const primary = document.querySelector('#primary-currency').value
    const target = document.querySelector('#target-currency').value
    const query = document.querySelector('#user-input').value
    
    return {
        primary,
        target,
        query
    }
}

function validateUserInput(primary, target, query) {
    if(primary === target) {
        return {
            isValid: false,
            msg: 'Conversion parameters cannot be the same'
        }
    }

    if(query === '') {
        return {
            isValid: false,
            msg: 'Please enter a value'
        }
    }

    if(isNaN(parseFloat(query))) {
        return {
            isValid: false,
            msg: 'Query must be a number'
        }
    }

    return {
        isValid: true
    }
}

// - Slideshow

class SlideShow {
    constructor() {
        this.state = {
            isRefreshing: true,
            timers: {
                first: null,
                second: null,
                third: null
            },
            slideShowText: [
                'Get live conversion rates',
                'Over 200 live currencies',
                'Mutliple conversion categories',
            ]
        }
        this.sliders = [...document.querySelectorAll('.slider i')]
        this.headerText = document.querySelector('header .header-top p')

        // this.timer = this.timer.bind(this)

        this.timer()
    }

    timer() {
        this.state.timers.first = setTimeout(function(sliders, textSlider, headerText, slideShowText) {
            sliders[0].style.opacity = '0.4'
            sliders[1].style.opacity = '1'

            // run text slider
            textSlider(headerText, slideShowText[1])
        }, 3000, this.sliders, this.textSlider, this.headerText, this.state.slideShowText)

        this.state.timers.second = setTimeout(function(sliders, textSlider, headerText, slideShowText) {
            sliders[1].style.opacity = '0.4'
            sliders[2].style.opacity = '1'

            // run text slider
            textSlider(headerText, slideShowText[2])
        }, 6000, this.sliders, this.textSlider, this.headerText, this.state.slideShowText)

        this.state.timers.third = setTimeout(function(sliders, state, refresh, textSlider, headerText, slideShowText) {
            sliders[2].style.opacity = '0.4'
            sliders[0].style.opacity = '1'

            // run text slider
            textSlider(headerText, slideShowText[0])
            // refresh the slideshow
            refresh(state)
        }, 9000, this.sliders, this.state, this.refresh, this.textSlider, this.headerText, this.state.slideShowText)
    }

    refresh(state) {
        // clear previous timeouts
        clearTimeout(state.timers.first)
        clearTimeout(state.timers.second)
        clearTimeout(state.timers.third)
        
        if(state.isRefreshing) {
            new SlideShow()
        }
    }

    textSlider(element, slideShowText) {
        element.textContent = slideShowText
    }
}

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
            cache.forEach(item => {
                const a = item.base == entry.base
                const b = item.target == entry.target
                const c = item.input == entry.input
                
                if(a && b && c) {
                    result.isDuplicate = a && b && c
                } else {
                    result.isDuplicate = false
                }
            })
        } else {
            result.isDuplicate = false
        }

        return result
    }

    validateConversion() {

    }
}