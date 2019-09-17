import { Dimensions } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

export default {
    statusBarHeight: getStatusBarHeight(),
    screenWidth: Dimensions.get('window').width,
    screenHeight: Dimensions.get('window').height
}
