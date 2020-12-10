import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class SettingItem extends React.Component {
    static propTypes = {
        callback: PropTypes.func,
        text: PropTypes.string,
        color: PropTypes.string,
        Icons: PropTypes.oneOfType([PropTypes.func, PropTypes.element]), // react-native-vector-icons 组件
        icon: PropTypes.string, // 左侧图标
        expandableIco: PropTypes.string, // 右侧 图标
    };

    render() {
        const { Icons, icon, color, text, expandableIco } = this.props;
        return (
            <TouchableOpacity onPress={this.props.callback} style={styles.container} activeOpacity={1}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    {Icons && icon ? (
                        <Icons name={icon} size={16} style={{ marginRight: 10 }} color={color} />
                    ) : (
                        <View
                            style={{
                                opacity: 1,
                                width: 16,
                                height: 16,
                                marginRight: 10,
                            }}
                        />
                    )}
                    <Text>{text}</Text>
                </View>
                <Ionicons name={expandableIco ? expandableIco : 'chevron-forward'} size={16} style={{ marginRight: 10, alignSelf: 'center' }} color={color || 'black'} />
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 10,
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
});
