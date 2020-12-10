import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NavigationUtil from '../../public/js/NavigationUtil';

/**
 * 欢迎页面
 */
export default class WelcomePage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.timer = setTimeout(() => {
            NavigationUtil.resetToHomePage(this.props);
        }, 2000);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>WelcomePage</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
