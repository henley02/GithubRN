import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import TimeSpan from '../../public/js/model/TimeSpan';
import { isIphoneX } from '../../public/js/GlobalStyles';

export const TimeSpans = [new TimeSpan('今 天', 'since=daily'), new TimeSpan('本 周', 'since=weekly'), new TimeSpan('本月', 'since=monthly')];

export default class TrendingDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
    }

    show = () => {
        this.setState({
            visible: true,
        });
    };

    close = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        const { onClose, onSelect } = this.props;
        return (
            <Modal transparent={true} visible={this.state.visible} onRequestClose={() => this.close()}>
                <TouchableOpacity onPress={() => this.close()} style={styles.container}>
                    <MaterialIcons size={36} color={'white'} name={'arrow-drop-up'} style={styles.arrow} />
                    <View style={styles.content}>
                        {TimeSpans.map((item, index) => (
                            <TouchableOpacity onPress={() => onSelect(item)} key={index}>
                                <View style={styles.TextContainer}>
                                    <Text style={styles.text}>{item.showText}</Text>
                                </View>
                                {index !== TimeSpans.length - 1 ? <View style={styles.line} /> : null}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'center',
        paddingTop: isIphoneX() ? 30 : 0,
    },
    arrow: {
        marginTop: 40,
        padding: 0,
        margin: -15,
    },
    content: {
        backgroundColor: 'white',
        borderRadius: 3,
        paddingHorizontal: 3,
        marginRight: 3,
    },
    TextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        color: 'black',
        fontWeight: '400',
        padding: 8,
        paddingLeft: 26,
        paddingRight: 26,
    },
    line: {
        height: 0.3,
        backgroundColor: 'darkgray',
    },
});
