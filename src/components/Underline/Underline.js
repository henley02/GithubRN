import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

export default class Underline extends React.Component {
    static propTypes = {
        backgroundColor: PropTypes.string,
        height: PropTypes.number,
    };

    static defaultProps = {
        backgroundColor: 'darkgray',
        height: 0.5,
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: this.props.backgroundColor,
                        height: this.props.height,
                    },
                ]}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        opacity: 0.5,
    },
});
