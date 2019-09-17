import React from 'react'
import { StyleSheet, View, TouchableOpacity, Animated, Easing, Text } from 'react-native'
import config from '../../config'

//https://stackoverflow.com/questions/38053071/react-native-animated-complete-event

class Balloon extends React.PureComponent {

    constructor() {
        super()
        this.state = {
            touched: false
        }
    }

    render() {
        let specialBalloon = Math.random() * 20 < 1
        let snowflake = Math.round(Math.random()) === 1
        let top = new Animated.Value(config.screenHeight)
        let diameter = specialBalloon ? 30 : 30 + Math.random() * config.screenWidth / 3
        let positionFromLeft = Math.abs(diameter - Math.random() * config.screenWidth)
        let zIndex = specialBalloon ? 1000 : Math.random() * 1000
        let balloonColor = specialBalloon ? 'rgb(255,255,255)' : `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`
        let opacity = specialBalloon ? 1 : .5
        let shadowOpacity = specialBalloon ? .5 : 1

        Animated.timing(
          top,
          { toValue: 0 - config.screenHeight - diameter * 2,
            duration: 7000 + Math.random() * 6000,
            easing: Easing.bezier(0, 0, 1, 1), //this is linear because the default apparently isn't
            userNativeDriver: true
        }).start(() => this.props.decreaseLife(this.state.touched))

        return(
            this.state.touched ? null
                :
            <Animated.View style={[styles.container, {top: top, zIndex: zIndex}]}>

                <TouchableOpacity onPressIn={() => {this.setState({touched: true}); this.props.increaseScore()}} activeOpacity={1} style={{left: positionFromLeft}}>
                    <View style={[styles.balloon, {opacity: opacity, shadowOpacity: shadowOpacity, width: diameter, height: diameter, borderBottomLeftRadius: diameter, borderTopLeftRadius: diameter, borderTopRightRadius: diameter, backgroundColor: balloonColor}]}>{specialBalloon ? (snowflake ? <Text style={styles.special}>❄️</Text> : <Text style={styles.special}>🍉</Text>) : null}</View>
                </TouchableOpacity>

                <View style={[styles.string, {left: positionFromLeft, height: diameter, top: diameter / 5}]}></View>

            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignItems: 'center'
    },
    balloon: {
        transform: ([{ rotateZ: '45deg' }]),
        shadowColor: 'rgb(0,0,0)',
        shadowOffset: {width: 0, height: 10},
        shadowRadius: 4,
        elevation: 8
    },
    string: {
        width: 1,
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgb(0,0,0)',
        shadowOffset: {width: -10, height: 5},
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 8
    },
    special: {
        fontSize: 14,
        marginTop: 6,
        marginLeft: 6
    }
})

export default Balloon
