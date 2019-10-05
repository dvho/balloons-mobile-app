import React from 'react'
import { Home } from './src/components/screens'
import { AppLoading } from 'expo'
import * as Font from 'expo-font'
import { Asset, Image } from 'expo-asset'
const allFonts = [require('./src/assets/fonts/EncodeSansSemiExpanded-Bold.ttf')]
const allImages = [require('./src/assets/images/balloon-radial-gradient.png'), require('./src/assets/images/beach.png')]
const allSounds = [require('./src/assets/sounds/pop.mp3'), require('./src/assets/sounds/explosion.mp3'), require('./src/assets/sounds/ching.mp3'), require('./src/assets/sounds/grunt01.mp3'), require('./src/assets/sounds/grunt02.mp3'), require('./src/assets/sounds/grunt03.mp3'), require('./src/assets/sounds/grunt04.mp3'), require('./src/assets/sounds/grunt05.mp3'), require('./src/assets/sounds/grunt06.mp3'), require('./src/assets/sounds/grunt07.mp3'), require('./src/assets/sounds/grunt08.mp3'), require('./src/assets/sounds/grunt09.mp3'), require('./src/assets/sounds/end-music.mp3')]

class App extends React.Component {

    constructor() {
        super()
        this.state = {
            isReady: false
        }
        this.cacheImages = this.cacheImages.bind(this)
        this.cacheFonts = this.cacheFonts.bind(this)
    }

    cacheSounds(sounds) {
        return sounds.map(sound => Asset.fromModule(sound).downloadAsync())
    }

    cacheImages(images) {
        return images.map(image => {
            if (typeof image === 'string') {
                //Just putting this as a placeholder for future use in case I later choose to include a URL in the allImages array above
                return Image.prefetch(image)
            } else {
                return Asset.fromModule(image).downloadAsync()
            }
        })
    }

    cacheFonts(fonts) {
        return fonts.map(font => Font.loadAsync(font))
    }

    _loadAssetsAsync = async () => {
        const soundAssets = await this.cacheSounds(allSounds)
        const imageAssets = await this.cacheImages(allImages)
        const fontAssets = await this.cacheFonts(allFonts)
        return Promise.all([...soundAssets, ...imageAssets, ...fontAssets])
    }

    render() {
        if (!this.state.isReady) {
            return (
                <AppLoading
                  startAsync={this._loadAssetsAsync}
                  onFinish={() => {this.setState({ isReady: true })}}
                  onError={console.warn}
                />
            )
        }

        return (
            <Home/>
        )
    }
}

export default App
