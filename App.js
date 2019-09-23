import React from 'react'
import { Home } from './src/components/screens'
import { AppLoading } from 'expo'
import * as Font from 'expo-font'
import { Asset, Image } from 'expo-asset'
const allFonts = [require('./src/assets/fonts/EncodeSansSemiExpanded-Bold.ttf')]
const allImages = [require('./src/assets/images/balloon-radial-gradient.png'), require('./src/assets/images/beach.png')]

class App extends React.Component {

    constructor() {
        super()
        this.state = {
            isReady: false
        }
        this.cacheImages = this.cacheImages.bind(this)
        this.cacheFonts = this.cacheFonts.bind(this)
    }

    cacheImages(images) {
        return images.map(image => {
            if (typeof image === 'string') {
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
        const imageAssets = await this.cacheImages(allImages)
        const fontAssets = await this.cacheFonts(allFonts)
        return Promise.all([...imageAssets, ...fontAssets])
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
