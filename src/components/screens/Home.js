import React from 'react'
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import { Balloon } from '../views'
import config from '../../config'

class Home extends React.Component {

    constructor() {
        super()
        this.state = {
            balloonNumber: 0,
            score: 0,
            life: 3
        }
        this.increaseScore = this.increaseScore.bind(this)
        this.decreaseLife = this.decreaseLife.bind(this)
    }

    decreaseScore() {
        this.setState({score: this.state.score - 5})
        // console.log(`Score: ${this.state.score}`)
    }

    increaseScore() {
        this.setState({score: this.state.score + 1})
        // console.log(`Score: ${this.state.score}`)
    }

    decreaseLife(touched) {
        this.setState({life: touched ? this.state.life : (this.state.life === 0 ? 0 : this.state.life - 1)})
        // console.log(`Life: ${this.state.life}`)
    }

    componentDidMount() {
        (control = () => {
            let timer = Math.random() * (1200 - (this.state.balloonNumber * 2))
            this.setState({balloonNumber: this.state.balloonNumber + 1})
            setTimeout(control, timer)
        })()
    }

    render() {
        const allBalloons = []

        for (i = 0; i < this.state.balloonNumber; i++) {
            allBalloons.push(<Balloon key={i} increaseScore={this.increaseScore} decreaseLife={this.decreaseLife}/>)
        }

        return(
            <View><TouchableOpacity style={{width: config.screenWidth, height: config.screenHeight}} onPressIn={() => this.decreaseScore()} activeOpacity={0}><View style={styles.container}>{allBalloons}</View><Text style={styles.lives}>🍉🍉🍉</Text></TouchableOpacity></View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: config.screenWidth,
        height: config.screenHeight,
        backgroundColor: 'rgb(239,239,255)',
        //marginTop: config.statusBarHeight
    },
    lives: {
        position: 'absolute',
        marginTop: config.statusBarHeight,
        marginLeft: 4
    }
})

export default Home
