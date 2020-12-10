import React from 'react';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class ShareButton extends React.Component {
    render() {
        const { shareClick } = this.props;
        return (
            <TouchableOpacity activeOpacity={1} onPress={shareClick}>
                <Ionicons size={20} name={'md-share-social-outline'} style={{ opacity: 0.9, marginRight: 10, color: 'white' }} />
            </TouchableOpacity>
        );
    }
}
