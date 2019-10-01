import React from 'react'
import { View, Animated, Easing } from 'react-native'
import { AntDesign, Entypo, FontAwesome, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import config from '../../config'

//AndDesign - cloud
//Entypo - cloud
//FontAwesome - cloud
//Foundation - cloud
//Ionicons - ios-cloud, ios-cloudy, md-cloud
//MaterialIcons - cloud
//MaterialIcons - wb-cloudy
//MaterialCommunityIcons - apple-icloud, cloud

class Cloud extends React.PureComponent {

    constructor() {
        super()
        this.state = {
        }
        this.clouds = [{suite: AntDesign, name: 'cloud'}, {suite: Entypo, name: 'cloud'}, {suite: FontAwesome, name: 'cloud'}, {suite: Ionicons, name: 'ios-cloud'}, {suite: Ionicons, name: 'ios-cloudy'}, {suite: Ionicons, name: 'md-cloud'}, {suite: MaterialIcons, name: 'cloud'}, {suite: MaterialIcons, name: 'wb-cloudy'}, {suite: MaterialCommunityIcons, name: 'apple-icloud'}, {suite: MaterialCommunityIcons, name: 'cloud'}]
    }

    render() {

        const selection = Math.floor(Math.random() * 10)

        let IconComponent = this.clouds[selection].suite
        let name = this.clouds[selection].name

        let color = Math.floor(Math.random() * 360)

        let size = 4 + Math.floor(Math.random() * 4)

        let opacity = .5 + Math.random() * .5

        let left = new Animated.Value(config.screenWidth)

        Animated.timing(
          left,
          { toValue: 0 - config.screenWidth/size,
            duration: 70000 + Math.random() * 20000,
            easing: Easing.bezier(0, 0, 1, 1), //this is linear because the default apparently isn't
            userNativeDriver: true //this needs to be added for Android
        }).start()

        return(
            <Animated.View style={{left: left, position: 'absolute', width: 100 + '%', height: 100 + '%', justifyContent: 'flex-end'}}>
                <IconComponent name={name} size={config.screenWidth/size} style={{bottom: config.screenWidth * .25, color: `hsl(${color}, 100%, 97%))`, opacity: opacity, shadowColor: 'rgb(255,255,255)', shadowOpacity: 1, shadowOffset: {width: 0, height: 0}, shadowRadius: 10}}/>
            </Animated.View>
        )
    }
}

export default Cloud

//shadowOffset: {width: -10, height: 5},
//shadowOpacity: 1,
//shadowRadius: 4,
//elevation: 8
