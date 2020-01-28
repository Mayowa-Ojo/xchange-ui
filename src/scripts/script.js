window.onload = function() {
    console.log('Loading...')
    fetchData('USD', 'NGN')

    document.querySelector('#user-input').addEventListener('keypress', function(e) {
        if(e.which == 13) {
            displayResult()
        }
    })

    new SlideShow()
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
/*
function slideShow() {
    const sliders = document.querySelectorAll('.slider i')

    let firstInterval,
        secondInterval,
        thirdInterval;
    let counter = 0

    sliders.forEach(slider => {
        timer(slider, [...sliders])
    })

    function timer(slider) {

        if(slider.classList.value.includes('one')) {
            const nextSlider = arguments[1][1]
            const prevSlider = arguments[1][2]
            
            counter++
            console.log(counter)

            firstInterval = setInterval(function() {
                slider.style.opacity = '0.4'
                // set next slider opacity=1
                nextSlider.style.opacity = '1'
                // set prev slider opacity=0.4
                prevSlider.style.opacity = '0.4'
                // console.log(firstInterval)

                clearInterval(thirdInterval)
            }, 3000)
        }

        if(slider.classList.value.includes('two')) {
            const nextSlider = arguments[1][2]
            
            counter++
            console.log(counter)
            
            secondInterval = setInterval(function() {
                slider.style.opacity = '0.4'
                // set next slider to opacity=1
                nextSlider.style.opacity = '1'

                clearInterval(firstInterval)
            }, 6000)
        }
            
        if(slider.classList.value.includes('three')) {
            const nextSlider = arguments[1][0]
            
            counter++
            console.log(counter)
            
            thirdInterval = setInterval(function() {
                slider.style.opacity = '0.4'
                // set next slider opacity=1
                nextSlider.style.opacity = '1'
                
                clearInterval(secondInterval)
            }, 9000)
        }
    }
}
*/

class SlideShow {
    constructor() {
        this.state = {
            isRefreshing: true
        }
        this.sliders = [...document.querySelectorAll('.slider i')]

        // this.timer = this.timer.bind(this)

        this.timer()

        console.log(`new class instance created: "SlideShow"`)
    }

    timer() {
        setTimeout(function(sliders) {
            sliders[0].style.opacity = '0.4'
            sliders[1].style.opacity = '1'
        }, 3000, this.sliders)

        setTimeout(function(sliders) {
            sliders[1].style.opacity = '0.4'
            sliders[2].style.opacity = '1'
        }, 6000, this.sliders)

        setTimeout(function(sliders, state, refresh) {
            sliders[2].style.opacity = '0.4'
            sliders[0].style.opacity = '1'

            // state.isRefreshing = true

            refresh(state)
        }, 9000, this.sliders, this.state, this.refresh)

    }

    refresh(state) {
        if(state.isRefreshing) {
            new SlideShow()
        }
    }
}