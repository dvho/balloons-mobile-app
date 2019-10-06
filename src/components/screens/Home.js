import React from 'react'
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as Font from 'expo-font'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import { Audio } from 'expo-av'
var wishwash = require('wishwash')
import { Balloon, Pop, Cloud, InitialCloud } from '../views'
import config from '../../config'

//Get expo running on AndroidStudio emulator: https://www.youtube.com/watch?v=Q0dERWCzoi0, https://docs.expo.io/versions/latest/workflow/android-studio-emulator/
//make a linearTimer and use its Math.random output to calc random clouds as well as special balloons (no longer use random function within Balloon.js to calc special balloons)

class Home extends React.Component {

    constructor() {
        super()
        this.state = {
            fontLoaded: false,
            sound: true,
            endMusicIsPlaying: false,
            gruntNumber: Math.ceil(Math.random() * 9),
            counter: 1200, //initialize at 1200
            balloonNumber: 0,
            cloudNumber: 0,
            score: 0,
            life: 3,
            revealSkull: false,
            x: null,
            y: null,
            diameter: null,
            balloonColor: null,
            isSnowflake: false,
            isWatermelon: false
        }
        this.increaseScore = this.increaseScore.bind(this)
        this.decreaseLife = this.decreaseLife.bind(this)
        this.increaseLife = this.increaseLife.bind(this)
        this.blowUpSnowflake = this.blowUpSnowflake.bind(this)
        this.sendPopParams = this.sendPopParams.bind(this)
    }

    async restart() {
        this.setState({
            endMusicIsPlaying: false,
            gruntNumber: Math.ceil(Math.random() * 9),
            counter: 1200,
            balloonNumber: 0,
            cloudNumber: 0,
            score: 0,
            life: 3,
            revealSkull: false,
            diameter: null
        })
        await this.endMusic.stopAsync()
        await this.endMusic.unloadAsync()
    }

    decreaseScore() {
        this.setState({
            score: ((this.state.life > 0) && (this.state.score > 5)) ? this.state.score - 5 : this.state.score,
            revealSkull: true
        })
        setTimeout(() => {
            this.setState({revealSkull: false})
        }, 250)
    }

    increaseScore() {
        this.setState({score: this.state.life > 0 ? this.state.score + 1 : this.state.score})
    }

    decreaseLife(touched) {
        this.setState({
            life: touched ? this.state.life : (this.state.life === 0 ? 0 : this.state.life - 1)})
    }

    increaseLife() {
        this.setState({life: this.state.life > 0 ? this.state.life + 1 : 0})
    }

    blowUpSnowflake() {
        this.setState({
            balloonNumber: this.state.life > 0 ? 0 : this.state.balloonNumber,
            score: this.state.score + 15,
            life: this.state.life + 1 //when decreaseLife is calledback from Animation in Balloon.js when a snowflake is blown up a single life is being subtracted so making up for it here
        })
    }

    sendPopParams(e, diameter, balloonColor, snowflake, watermelon) {
        this.setState({
            x: e.nativeEvent.pageX,
            y: e.nativeEvent.pageY,
            diameter: diameter,
            balloonColor: balloonColor,
            isSnowflake: snowflake,
            isWatermelon: watermelon
        })
    }

    async playGrunt() {

        const soundObject = new Audio.Sound()
        const gruntArray = [require('../../assets/sounds/grunt01.mp3'), require('../../assets/sounds/grunt02.mp3'), require('../../assets/sounds/grunt03.mp3'), require('../../assets/sounds/grunt04.mp3'), require('../../assets/sounds/grunt05.mp3'), require('../../assets/sounds/grunt06.mp3'), require('../../assets/sounds/grunt07.mp3'), require('../../assets/sounds/grunt08.mp3'), require('../../assets/sounds/grunt09.mp3')]

        try {
            this.setState({gruntNumber: (this.state.gruntNumber + Math.ceil(Math.random() * 8)) % 9})
            await soundObject.loadAsync(gruntArray[this.state.gruntNumber])
            this.grunt = soundObject
                this.grunt.setPositionAsync(0)
                this.grunt.playAsync()

                .then(async playbackStatus => {
                    setTimeout(() => {
                        soundObject.unloadAsync()
                    }, 650)
                })
                .catch(error => {
                    console.log(error)
                })
        } catch (error) {
              console.log(error)
        }
    }

    async playEndMusic() {
        //https://www.youtube.com/watch?v=sR6TDLT5Jk0
        //https://vodovoz.bandcamp.com/track/go-bossa-jazz-commercial-web-license
        if (this.state.endMusicIsPlaying) {
            return
        }
        this.setState({endMusicIsPlaying: true})
        const soundObject = new Audio.Sound()

        try {
            await soundObject.loadAsync(require('../../assets/sounds/end-music.mp3'))
            this.endMusic = soundObject
                this.endMusic.setPositionAsync(0)
                this.endMusic.playAsync()
                this.endMusic.setIsLoopingAsync(true)
        } catch (error) {
              console.log(error)
        }
    }

    async componentDidMount() {
        await Font.loadAsync({
        'EncodeSansSemiExpanded-Bold': require('../../assets/fonts/EncodeSansSemiExpanded-Bold.ttf')
        })
        await this.setState({
            fontLoaded: true
        })
        await (wishwashControl = () => {
            let wishwashTimer = Math.random() * wishwash(this.state.counter, 1, 1200, true) //Where this.state.counter is initialized at 1200, this yo-yos between 1201 and 1 infinitely
            this.state.life > 0 ? null : (this.state.sound ? this.playEndMusic() : null)
            this.setState({
                counter: this.state.life > 0 ? this.state.counter + 1 : this.state.counter,
                balloonNumber: this.state.life > 0 ? this.state.balloonNumber + 1 : this.state.balloonNumber
            })
            setTimeout(wishwashControl, wishwashTimer)
        })()
        await (linearControl = () => {
            let repeatRate = Math.random() * 10000

            this.setState({
                cloudNumber: this.state.cloudNumber + 1
            })
            setTimeout(linearControl, repeatRate)
        })()
    }

    render() {

        const allBalloons = []
        const allInitialClouds = []
        const allClouds = []
        const lives = []

        for (i = 0; i < this.state.balloonNumber; i++) {
            allBalloons.push(<Balloon key={i} increaseScore={this.increaseScore} decreaseLife={this.decreaseLife} increaseLife={this.increaseLife} blowUpSnowflake={this.blowUpSnowflake} sendPopParams={this.sendPopParams}/>)
        }

        for (i = 0; i < 13; i++) {
            allInitialClouds.push(<InitialCloud key={i}/>)
        }

        for (i = 0; i < this.state.cloudNumber; i++) {
            allClouds.push(<Cloud key={i}/>)
        }

        for (i = 0; i < this.state.life; i++) {
            lives.push('🍉')
        }

        return(
            <View>
                <TouchableOpacity style={{width: config.screenWidth, height: config.screenHeight}} onPressIn={() => {this.decreaseScore(); (this.state.sound && this.state.life > 0) ? this.playGrunt() : null}} activeOpacity={this.state.life > 0 ? 0 : 1}>

                { this.state.life > 0 ? null :
                <View style={{width: config.screenWidth, height: config.screenHeight}}>

                <LinearGradient colors={[`rgb(58,${wishwash(this.state.counter * 3, 32, 255, true)},255 )`, 'rgb(239,239,255)', 'rgb(255,165,0)']} style={{position: 'absolute', width: 100 + '%', height: 100 + '%'}}/>

                <LinearGradient colors={['rgb(0,192,241)', 'rgb(255,255,255)']} style={{position: 'absolute', bottom: 0, width: config.screenWidth, height: config.screenWidth * .405}}/>

                <Image source={require('../../assets/images/beach.png')} style={{position: 'absolute', bottom: 0, width: config.screenWidth, height: config.screenWidth * .81}}/>

                    <View style={{alignItems: 'center', marginTop: config.screenWidth/3}}>
                        <Text style={{fontFamily: 'EncodeSansSemiExpanded-Bold', fontSize: 24, paddingBottom: 20}}>Final Score: {this.state.score}</Text>
                        <TouchableOpacity onPressOut={() => this.restart()} style={{width: config.screenWidth/4.5, borderWidth: StyleSheet.hairlineWidth, borderRadius: config.screenWidth/40, borderColor: 'rgb(0,0,0)', justifyContent: 'center', alignItems: 'center'}}><MaterialCommunityIcons name={'backup-restore'} size={config.screenWidth/5} color={'rgb(0,0,0)'}/></TouchableOpacity>
                    </View>
                </View> }

                { this.state.life > 0 ?
                    <View style={{marginTop: 40, opacity: .08, backgroundColor: 'rgb(255,255,255)'}}>
                        <MaterialCommunityIcons name={'skull'} size={config.screenWidth} color={'rgb(0,0,0)'}/>
                    </View> : null }
                { this.state.life > 0 ? <View style={[styles.container, {opacity: this.state.revealSkull ? 0 : 1, backgroundColor: 'rgb(239,239,255)'}]}>
                    <LinearGradient colors={[`rgb(58,${wishwash(this.state.counter * 3, 32, 255, true)},255 )`, 'rgb(239,239,255)']} style={{position: 'absolute', width: 100 + '%', height: 100 + '%'}}/>

                    {allInitialClouds}
                    {allClouds}

                    <LinearGradient colors={['rgb(0,192,241)', 'rgb(255,255,255)']} style={{position: 'absolute', bottom: 0, width: config.screenWidth, height: config.screenWidth * .405}}/>

                    <Image source={require('../../assets/images/beach.png')} style={{position: 'absolute', bottom: 0, width: config.screenWidth, height: config.screenWidth * .81}}/>

                    <Pop x={this.state.x} y={this.state.y} sound={this.state.sound} diameter={this.state.diameter} balloonColor={this.state.balloonColor} snowflake={this.state.isSnowflake} watermelon={this.state.isWatermelon}/>

                    {allBalloons}

                    </View> : null }
                { this.state.life > 0 ?
                    <View style={styles.scoreBar}>
                        { this.state.fontLoaded ? <Text style={{fontFamily: 'EncodeSansSemiExpanded-Bold', fontSize: 14}}>Score: {this.state.score}</Text> : null }
                        <Text style={styles.lives}>{lives}</Text>
                        <TouchableOpacity onPress={() => this.setState({sound: !this.state.sound})} style={styles.soundToggle}>
                            <Ionicons name={this.state.sound ? 'ios-volume-high' : 'ios-volume-off'} size={40} color={'rgb(0,0,0)'} style={{opacity: this.state.sound ? 1 : .3}}/>
                        </TouchableOpacity>
                    </View> : null }
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        flex: 1,
        width: config.screenWidth,
        height: config.screenHeight
    },
    scoreBar: {
        flexDirection: 'column',
        position: 'absolute',
        width: config.screenWidth,
        alignItems: 'center',
        marginTop: config.statusBarHeight
    },
    soundToggle: {
        position: 'absolute',
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: config.screenWidth
    },
    lives: {
        paddingLeft: 7,
        fontSize: 16
    }
})

export default Home
