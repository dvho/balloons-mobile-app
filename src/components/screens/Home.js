import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Balloon } from '../views'
import config from '../../config'

class Home extends React.Component {

    constructor() {
        super()
        this.state = {
            balloonNumber: 0
        }
    }

    missed() {
        console.log('missed')
    }

    componentDidMount() {
        (control = () => {
            let timer = Math.random() * (1200 - (this.state.balloonNumber * 2))
            this.setState({balloonNumber: this.state.balloonNumber + 1})
            console.log(timer)
            setTimeout(control, timer)
        })()
    }

    render() {
        const allBalloons = []

        for (i = 0; i < this.state.balloonNumber; i++) {
            allBalloons.push(<Balloon key={i}/>)
        }

        return(
            <TouchableOpacity style={{width: config.screenWidth, height: config.screenHeight}} onPressIn={() => this.missed()} activeOpacity={0}><View style={styles.container}>{allBalloons}</View></TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: config.screenWidth,
        height: config.screenHeight,
        backgroundColor: 'rgb(239,239,255)', //This will be sky blue
        //marginTop: config.statusBarHeight
    }
})


export default Home
