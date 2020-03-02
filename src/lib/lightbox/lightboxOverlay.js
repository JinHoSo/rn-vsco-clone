import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Animated, Dimensions, Modal, StyleSheet} from 'react-native'

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;
const STATUS_BAR_OFFSET = 0// (Platform.OS === 'android' ? -25 : 0);
const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
  },
  open: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});

export default class LightboxOverlay extends Component {
  static propTypes = {
    origin: PropTypes.shape({
      x:        PropTypes.number,
      y:        PropTypes.number,
      width:    PropTypes.number,
      height:   PropTypes.number,
    }),
    springConfig: PropTypes.shape({
      tension:  PropTypes.number,
      friction: PropTypes.number,
    }),
    backgroundColor: PropTypes.string,
    isOpen:          PropTypes.bool,
    onOpen:          PropTypes.func,
    onClose:         PropTypes.func,
    willClose:         PropTypes.func,
  };

  static defaultProps = {
    springConfig: { tension: 30, friction: 7 },
    backgroundColor: '#000000',
  };

  state = {
    isAnimating: false,
    isPanning: false,
    target: {
      x: 0,
      y: 0,
      opacity: 1,
    },
    openVal: new Animated.Value(0),
  };

  open = () => {
    this.setState({
      isAnimating: true,
      target: {
        x: 0,
        y: 0,
        opacity: 0.9,
      }
    });

    Animated.spring(
      this.state.openVal,
      { toValue: 1, ...this.props.springConfig }
    ).start(() => {
      this.setState({ isAnimating: false });
      this.props.didOpen();
    });
  }

  close = () => {
    this.props.willClose();

    this.setState({
      isAnimating: true,
    });
    Animated.spring(
      this.state.openVal,
      { toValue: 0, ...this.props.springConfig }
    ).start(() => {
      this.setState({
        isAnimating: false,
      });
      this.props.onClose();
    });
  }

  componentWillReceiveProps(props) {
    if(this.props.isOpen !== props.isOpen && props.isOpen) {
      this.open();
    }
  }

  render() {
    const {
            isOpen,
            origin,
            backgroundColor,
          } = this.props;

    const {
            openVal,
            target,
          } = this.state;

    const lightboxOpacityStyle = {
      opacity: openVal.interpolate({inputRange: [0, 1], outputRange: [0, target.opacity]})
    };

    const openStyle = [styles.open, {
      left:   openVal.interpolate({inputRange: [0, 1], outputRange: [origin.x, target.x]}),
      top:    openVal.interpolate({inputRange: [0, 1], outputRange: [origin.y + STATUS_BAR_OFFSET, target.y + STATUS_BAR_OFFSET]}),
      width:  openVal.interpolate({inputRange: [0, 1], outputRange: [origin.width, WINDOW_WIDTH]}),
      height: openVal.interpolate({inputRange: [0, 1], outputRange: [origin.height, WINDOW_HEIGHT]}),
    }];

    const background = (<Animated.View style={[styles.background, { backgroundColor: backgroundColor }, lightboxOpacityStyle]}></Animated.View>);
    const content = (
      <Animated.View style={openStyle}>
        {this.props.children}
      </Animated.View>
    );

    return (
      <Modal visible={isOpen} transparent={true} onRequestClose={() => this.close()} style={{padding:0, margin:0}}>
        {background}
        {content}
      </Modal>
    );
  }
}