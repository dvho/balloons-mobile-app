import React from 'react'
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as Font from 'expo-font'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Balloon, Pop } from '../views'
import config from '../../config'

//Should cache some gif assets and have an animation running in the background that looks like daytime and one for night when the game is over
//Font for score
//Balloon pop animation

class Home extends React.Component {

    constructor() {
        super()
        this.state = {
            fontLoaded: false,
            balloonNumber: 0,
            tempBalloonNumber: 0,
            score: 0,
            life: 3,
            revealSkull: false,
            x: null,
            y: null,
            diameter: null,
            balloonColor: null,
            isSnowflake: false
        }
        this.increaseScore = this.increaseScore.bind(this)
        this.decreaseLife = this.decreaseLife.bind(this)
        this.increaseLife = this.increaseLife.bind(this)
        this.blowUpSnowflake = this.blowUpSnowflake.bind(this)
        this.sendPopParams = this.sendPopParams.bind(this)
    }

    restart() {
        this.setState({
            balloonNumber: 0,
            tempBalloonNumber: 0,
            score: 0,
            life: 3,
            revealSkull: false
        })
    }

    decreaseScore() {
        this.setState({
            score: ((this.state.life > 0) && (this.state.score > 5)) ? this.state.score - 5 : this.state.score,
            revealSkull: ((this.state.life > 0) && (this.state.score > 5)) ? true : false
        })
        setTimeout(() => {
            this.setState({revealSkull: false})
        }, 150)
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
            tempBalloonNumber: this.state.life > 0 ? 0 : this.state.tempBalloonNumber,
            score: this.state.score + 15,
            life: this.state.life + 1 //when decreaseLife is calledback from Animation in Balloon.js when a snowflake is blown up a single life is being subtracted so making up for it here
        })
    }

    sendPopParams(e, diameter, balloonColor, snowflake) {
        this.setState({
            x: e.nativeEvent.pageX,
            y: e.nativeEvent.pageY,
            diameter: diameter,
            balloonColor: balloonColor,
            isSnowflake: snowflake
        })
    }

    async componentDidMount() {
        await Font.loadAsync({
        'EncodeSansSemiExpanded-Bold': require('../../assets/fonts/EncodeSansSemiExpanded-Bold.ttf')
        })
        await this.setState({
            fontLoaded: true
        })
        await (control = () => {
            let timer = Math.random() * (1200 - (this.state.balloonNumber))
            this.setState({
                balloonNumber: this.state.life > 0 ? this.state.balloonNumber + 1 : this.state.balloonNumber,
                tempBalloonNumber: this.state.life > 0 ? this.state.tempBalloonNumber + 1 : this.state.tempBalloonNumber
            })
            setTimeout(control, timer)
        })()
    }

    //style={{left: this.state.x - this.state.diameter/2, top: this.state.y - this.state.diameter / 2, width: this.state.diameter, height: this.state.diameter, backgroundColor: this.state.balloonColor}}

    render() {
        const allBalloons = []
        const lives = []

        for (i = 0; i < this.state.tempBalloonNumber; i++) {
            allBalloons.push(<Balloon key={i} increaseScore={this.increaseScore} decreaseLife={this.decreaseLife} increaseLife={this.increaseLife} blowUpSnowflake={this.blowUpSnowflake} sendPopParams={this.sendPopParams}/>)
        }

        for (i = 0; i < this.state.life; i++) {
            lives.push('🍉')
        }

        return(
            <View>
                <TouchableOpacity style={{width: config.screenWidth, height: config.screenHeight, backgroundColor: this.state.life > 0 ? null : 'rgb(0,64,128)'}} onPressIn={() => this.decreaseScore()} activeOpacity={this.state.life > 0 ? 0 : 1}>
                { this.state.life > 0 ? null :
                    <View style={{alignItems: 'center', marginTop: config.screenWidth/3}}>
                        <Text style={{fontFamily: 'EncodeSansSemiExpanded-Bold', fontSize: 24, paddingBottom: 20}}>Final Score: {this.state.score}</Text>
                        <TouchableOpacity onPress={() => this.restart()} style={{width: config.screenWidth/4}}><MaterialCommunityIcons name={'backup-restore'} size={config.screenWidth/4} color={'rgb(0,0,0)'}/></TouchableOpacity>
                    </View> }
                { this.state.life > 0 ?
                    <View style={{marginTop: 40, opacity: .08, backgroundColor: 'rgb(255,255,255)'}}>
                        <MaterialCommunityIcons name={'skull'} size={config.screenWidth} color={'rgb(0,0,0)'}/>
                    </View> : null }
                { this.state.life > 0 ? <View style={[styles.container, {opacity: this.state.revealSkull ? 0 : 1, backgroundColor: 'rgb(239,239,255)'}]}>
                    <LinearGradient colors={[`rgb(58,${255 - Math.abs(128 - (this.state.balloonNumber * 2) % 256)},255 )`, `rgb(239,239,255)`]} style={{position: 'absolute', width: 100 + '%', height: 100 + '%'}}/>

                    <View style={{position: 'absolute', bottom: 0, width: config.screenWidth, height: config.screenWidth * .405, backgroundColor: 'rgb(0,192,241)'}}>

                    </View>

                    <Image source={require('../../assets/images/beach.png')} style={{position: 'absolute', bottom: 0, width: config.screenWidth, height: config.screenWidth * .81}}/>
                    {allBalloons}
                    <Pop x={this.state.x} y={this.state.y} diameter={this.state.diameter} balloonColor={this.state.balloonColor} snowflake={this.state.isSnowflake}/>
                    </View> : null }
                { this.state.life > 0 ?
                    <View style={styles.scoreBar}>
                        { this.state.fontLoaded ? <Text style={{fontFamily: 'EncodeSansSemiExpanded-Bold', fontSize: 14}}>Score: {this.state.score}</Text> : null }
                        <Text style={styles.lives}>{lives}</Text>
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
    lives: {
        paddingLeft: 4,
        fontSize: 16
    }
})

export default Home
