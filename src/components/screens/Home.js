import React from 'react'
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import { Balloon } from '../views'
import config from '../../config'

//Should cache some gif assets and have an animation running in the background that looks like daytime and one for night when the game is over

class Home extends React.Component {

    constructor() {
        super()
        this.state = {
            balloonNumber: 0,
            tempBalloonNumber: 0,
            score: 0,
            life: 3
        }
        this.increaseScore = this.increaseScore.bind(this)
        this.decreaseLife = this.decreaseLife.bind(this)
        this.increaseLife = this.increaseLife.bind(this)
        this.blowUpSnowflake = this.blowUpSnowflake.bind(this)
    }

    decreaseScore() {
        this.setState({score: ((this.state.life > 0) && (this.state.score > 5)) ? this.state.score - 5 : this.state.score})
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
            life: this.state.life + 1 //at some point a life is being subtracted for blowing up a snowflake so makeing up for it here
        })
    }

    componentDidMount() {
        (control = () => {
            let timer = Math.random() * (2000 - (this.state.balloonNumber))
            this.setState({
                balloonNumber: this.state.life > 0 ? this.state.balloonNumber + 1 : this.state.balloonNumber,
                tempBalloonNumber: this.state.life > 0 ? this.state.tempBalloonNumber + 1 : this.state.tempBalloonNumber
            })
            setTimeout(control, timer)
        })()
    }

    render() {
        const allBalloons = []
        const lives = []

        for (i = 0; i < this.state.tempBalloonNumber; i++) {
            allBalloons.push(<Balloon key={i} increaseScore={this.increaseScore} decreaseLife={this.decreaseLife} increaseLife={this.increaseLife} blowUpSnowflake={this.blowUpSnowflake}/>)
        }

        for (i = 0; i < this.state.life; i++) {
            lives.push('🍉')
        }

        return(
            <View>
                <TouchableOpacity style={{width: config.screenWidth, height: config.screenHeight}} onPressIn={() => this.decreaseScore()} activeOpacity={this.state.life > 0 ? 0 : 1}>
                <View style={[styles.container, {backgroundColor: this.state.life > 0 ? 'rgb(239,239,255)' : 'rgb(64,64,64)'}]}>{allBalloons}</View>
                <View style={styles.scoreBar}>
                    <Text style={styles.score}>{this.state.life > 0 ? 'Score: ' : 'Final Score: '}{this.state.score}</Text>
                    <Text style={styles.lives}>{lives}</Text>
                </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
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
    },
    score: {
        paddingRight: 4,
        fontSize: 14
    }
})

export default Home
