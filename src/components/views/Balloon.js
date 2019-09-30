import React from 'react'
import { StyleSheet, View, Platform, TouchableOpacity, TouchableNativeFeedback, Animated, Easing, Text, Image } from 'react-native'
import config from '../../config'

//TouchableOpacity doesn't work inside a parent with position absolute on Android (this is a react native bug) but TouchableNativeFeedback does. TouchableNativeFeedback doesn't work at all on iOS so I had to place two different blocks of JSX inside a ternary in my render method

//https://stackoverflow.com/questions/38053071/react-native-animated-complete-event
//https://docs.expo.io/versions/latest/sdk/audio/
//https://ethercreative.github.io/react-native-shadow-generator/

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
        let opacity = specialBalloon ? 1 : .7 //1 : .5
        let shadowOpacity = null //specialBalloon ? .5 : 1

        Animated.timing(
          top,
          { toValue: 0 - config.screenHeight - diameter * 2,
            duration: 7000 + Math.random() * 6000,
            easing: Easing.bezier(0, 0, 1, 1), //this is linear because the default apparently isn't
            userNativeDriver: true //this needs to be added for Android
        }).start(() => this.props.decreaseLife(this.state.touched)) //call the equivalent of animationEnd by having an anonymous function call decreaseLife with the argument as to whether or not it was touched or escaped

        return(

            this.state.touched ? null

            :

            Platform.OS !== 'ios' ?

            <Animated.View style={[styles.container, {left: positionFromLeft, top: top, zIndex: zIndex}]}>

                <TouchableNativeFeedback onPressIn={(e) => {this.setState({touched: true}); this.props.sendPopParams(e, diameter, balloonColor, snowflake && specialBalloon); specialBalloon ? (snowflake ? this.props.blowUpSnowflake() : this.props.increaseLife()) : this.props.increaseScore()}} activeOpacity={1} style={{left: positionFromLeft}}>
                    <View style={[styles.balloon, {opacity: opacity, shadowOpacity: shadowOpacity, width: diameter, height: diameter, borderBottomLeftRadius: diameter, borderTopLeftRadius: diameter, borderTopRightRadius: diameter, backgroundColor: balloonColor}]}>{specialBalloon ? (snowflake ? <Text style={styles.special}>❄️</Text> : <Text style={styles.special}>🍉</Text>) : <Image source={require('../../assets/images/balloon-radial-gradient.png')} style={{marginLeft: diameter/12, marginTop: -diameter/12, width: diameter, height: diameter}}/>}</View>
                </TouchableNativeFeedback>

                <View style={[styles.string, {height: diameter, top: diameter / 5}]}></View>

            </Animated.View>

            :

            <Animated.View style={[styles.container, {top: top, zIndex: zIndex}]}>

                <TouchableOpacity onPressIn={(e) => {this.setState({touched: true}); this.props.sendPopParams(e, diameter, balloonColor, snowflake && specialBalloon); specialBalloon ? (snowflake ? this.props.blowUpSnowflake() : this.props.increaseLife()) : this.props.increaseScore()}} activeOpacity={1} style={{left: positionFromLeft}}>
                    <View style={[styles.balloon, {opacity: opacity, shadowOpacity: shadowOpacity, width: diameter, height: diameter, borderBottomLeftRadius: diameter, borderTopLeftRadius: diameter, borderTopRightRadius: diameter, backgroundColor: balloonColor}]}>{specialBalloon ? (snowflake ? <Text style={styles.special}>❄️</Text> : <Text style={styles.special}>🍉</Text>) : <Image source={require('../../assets/images/balloon-radial-gradient.png')} style={{marginLeft: diameter/12, marginTop: -diameter/12, width: diameter, height: diameter}}/>}</View>
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
        //shadowColor: 'rgb(0,0,0)',
        //shadowOffset: {width: 0, height: 10},
        //shadowRadius: 4,
        //elevation: 8
    },
    string: {
        width: 1,
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgb(0,0,0)',
        //shadowOffset: {width: -10, height: 5},
        //shadowOpacity: 1,
        //shadowRadius: 4,
        //elevation: 8
    },
    special: {
        fontSize: 14,
        marginTop: 6,
        marginLeft: 6
    }
})

export default Balloon
