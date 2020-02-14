import SlideShow from './slideshow.js'
import CacheStorage from './cache.js'
import PageFeed from './page-feed.js'

window.onload = function() {
    console.log('Loading...')

    /*****************************************/
    // Register service worker
    if('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js')
        .then(function() {
            console.log("service worker registered")
        })
    }
    /*****************************************/
    
    document.querySelector('#user-input').addEventListener('keypress', function(e) {
        if(e.which == 13) {
            displayResult()
        }
    })

    new SlideShow()
}


// Global variables
const pageFeed = new PageFeed()
const cacheStorage = new CacheStorage
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
        outputDisplay.innerText = JSON.parse(result).toLocaleString('ja-JP', {style: 'currency', currency: `${target}`})

        // update cache storage
        cacheStorage.checkForNewData()
        // refresh page feed
        pageFeed.refreshFeed()

        clearInput()
    })
}

function clearInput() {
    const input = document.querySelector('#user-input')

    input.value = ''
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
