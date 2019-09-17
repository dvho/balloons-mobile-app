import React from 'react'
import { StyleSheet, View, TouchableOpacity, Animated, Easing } from 'react-native'
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
        let top = new Animated.Value(config.screenHeight)
        let diameter = 30 + Math.random() * config.screenWidth / 3
        let positionFromLeft = Math.abs(diameter - Math.random() * config.screenWidth)
        let zIndex = Math.random() * 1000
        let balloonColor = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`

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
                    <View style={[styles.balloon, {width: diameter, height: diameter, borderBottomLeftRadius: diameter, borderTopLeftRadius: diameter, borderTopRightRadius: diameter, backgroundColor: balloonColor}]}></View>
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
        opacity: .5,
        transform: ([{ rotateZ: '45deg' }]),
        shadowColor: 'rgb(0,0,0)',
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 1,
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
    }
})

export default Balloon

//Update a global store of points in redux here
