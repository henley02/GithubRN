import React from 'react';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';

export default class BackButton extends React.Component {
    static propTypes = {
        goBack: PropTypes.func,
        color: PropTypes.string,
    };

    static defaultProps = {
        color: '#fff',
    };

    render() {
        const { goBack, color } = this.props;
        console.log(color);
        return (
            <TouchableOpacity onPress={goBack} style={{ padding: 8, paddingLeft: 12 }}>
                <Ionicons name={'ios-arrow-back'} size={26} color={color} />
            </TouchableOpacity>
        );
    }
}
