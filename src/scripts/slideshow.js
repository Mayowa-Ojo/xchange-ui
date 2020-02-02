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

export default SlideShow