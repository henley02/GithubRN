import React from 'react';
import SettingItem from '../../components/SettingItem/SettingItem';
import { Text, TouchableOpacity } from 'react-native';

export default class ViewUtil {
    static getMenuItem(callback, Menu, color, expandableIco) {
        return <SettingItem color={color} callback={callback} expandableIco={expandableIco} Icons={Menu.Icons} icon={Menu.icon} text={Menu.name} />;
    }

    static getRightButton(title, callback) {
        return (
            <TouchableOpacity style={{ alignItems: 'center' }} onPress={callback}>
                <Text style={{ fontSize: 20, color: '#ffffff', marginRight: 10 }}>{title}</Text>
            </TouchableOpacity>
        );
    }
}
