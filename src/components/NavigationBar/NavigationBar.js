import React from 'react';
import { Platform, StatusBar, StyleSheet, Text, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { isIphoneX } from '../../public/js/GlobalStyles';

const NAV_BAR_HEIGHT_IOS = 44; // 导航栏在IOS中的高度
const NAV_BAR_HEIGHT_ANDROID = 50; // 导航栏在ANDROID中的高度
const NAV_BAR_HEIGHT = Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID;
const STATUS_BAR_HEIGHT = Platform.OS !== 'ios' || isIphoneX() ? 0 : 20; // 状态栏的高度

// 设置状态栏所接受的属性
const StatusBarShare = {
    barStyle: PropTypes.oneOf(['light-content', 'default']),
    hidden: PropTypes.bool,
    backgroundColor: PropTypes.string,
};

export default class NavigationBar extends React.Component {
    static propTypes = {
        style: ViewPropTypes.style,
        title: PropTypes.string,
        titleView: PropTypes.element,
        titleLayoutStyle: ViewPropTypes.style,
        hide: PropTypes.bool,
        statusBar: PropTypes.shape(StatusBarShare),
        rightButton: PropTypes.element,
        leftButton: PropTypes.element,
    };

    static defaultProps = {
        statusBar: {
            barStyle: 'light-content',
            hidden: false,
        },
    };

    getButtonElement(el) {
        return <View style={styles.navBarButton}>{el ? el : null}</View>;
    }

    render() {
        let statusBar = !this.props.statusBar.hidden ? (
            <View style={styles.statusBar}>
                <StatusBar {...this.props.statusBar} />
            </View>
        ) : null;
        let titleView = this.props.titleView ? (
            this.props.titleView
        ) : (
            <Text ellipsizeMode={'head'} numberOfLines={1} style={styles.title}>
                {this.props.title}
            </Text>
        );
        let content = this.props.hide ? null : (
            <View style={styles.navBar}>
                {this.getButtonElement(this.props.leftButton)}
                <View style={[styles.navBarTitleContainer, this.props.titleLayoutStyle]}>{titleView}</View>
                {this.getButtonElement(this.props.rightButton)}
            </View>
        );
        return (
            <View style={[styles.container, this.props.style]}>
                {statusBar}
                {content}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2196f3',
    },
    statusBar: {
        height: STATUS_BAR_HEIGHT,
    },
    title: {
        fontSize: 20,
        color: 'white',
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: NAV_BAR_HEIGHT,
    },
    navBarTitleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 40,
        right: 40,
        top: 0,
        bottom: 0,
    },
    navBarButton: {
        alignItems: 'center',
    },
});
