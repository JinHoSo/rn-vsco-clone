import React from 'react'
import {FlatList, StyleSheet, View, Image, Text} from 'react-native'
import {AuthState} from '../redux/auth/reducer'
import {connect} from 'react-redux'
import {RootState} from '../redux'
import {login} from '../redux/auth/actions'
import {NavigationActions} from 'react-navigation'
import {CameraRollPicker} from '../lib/cameraRollPicker'
import {Editor} from './editor'
import Modal from 'react-native-modal'
import ScaledImage from 'react-native-scaled-image'
import {screenWidth} from '../lib/screenSize'
import MasonryList from '@appandflow/masonry-list'
import {HAIR_LINE_WIDTH} from '../constant/env'
import {Ionicons} from '@expo/vector-icons'
import {View as AnimationView} from 'react-native-animatable'
import {ExploreImageItem} from '../components/exploreImageItem'

const IMAGE_WIDTH = screenWidth / 2 - 30

type MasonryImage = {
  width: number
  height: number
  uri: string
  createdAt: number
  clap?: number
}
interface State {
  imageList: MasonryImage[]
}

interface OwnProps {
}

interface StateProps {
  auth: AuthState,
}

interface DispatchProps {
  login: typeof login
  navigate: typeof NavigationActions.navigate
}

interface Props extends StateProps, DispatchProps, OwnProps {
}

class ExploreScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      imageList: [
        {
          width    : 753,
          height   : 1136,
          uri      : 'https://image-aws-us-west-2.vsco.co/c8e026/24071870/5b9729e00197697e6d000000/753x1136/vsco5b9729e4f1153.jpg',
          createdAt: 1538378572737 + this.getRandomNumber(),
          clap     : 83283,
        },
        {
          width    : 480,
          height   : 320,
          uri      : 'https://image-aws-us-west-2.vsco.co/80c9fc/3852521/5b97bf022c715b474fb53092/480x320/vsco5b97bf04e559e.jpg',
          createdAt: 1538378572721 + this.getRandomNumber(),
        },
        {
          width    : 721,
          height   : 960,
          uri      : 'https://image-aws-us-west-2.vsco.co/4e6536/68035487/5b97218a1bc0b31e3804a928/721x960/vsco5b97218cd2a64.jpg',
          createdAt: 1538378572619 + this.getRandomNumber(),
        },
        {
          width    : 480,
          height   : 320,
          uri      : 'https://image-aws-us-west-2.vsco.co/aae927/22278680/5b970f7b0675ea4d44000001/480x320/vsco5b970f7f46638.jpg',
          createdAt: 1538378572611 + this.getRandomNumber(),
        },
        {
          width    : 480,
          height   : 640,
          uri      : 'https://image-aws-us-west-2.vsco.co/5e050a/2404457/5b970928ef2b8f18b4d820b7/480x640/vsco5b97092f063a2.jpg',
          createdAt: 1538378572734 + this.getRandomNumber(),
        },
        {
          width    : 753,
          height   : 1136,
          uri      : 'https://image-aws-us-west-2.vsco.co/c8e026/24071870/5b9729e00197697e6d000000/753x1136/vsco5b9729e4f1153.jpg',
          createdAt: 1538378572737 + this.getRandomNumber(),
          clap     : 2145,
        },
        {
          width    : 721,
          height   : 960,
          uri      : 'https://image-aws-us-west-2.vsco.co/4e6536/68035487/5b97218a1bc0b31e3804a928/721x960/vsco5b97218cd2a64.jpg',
          createdAt: 1538378572735 + this.getRandomNumber(),
          clap     : 421,
        },
        {
          width    : 480,
          height   : 320,
          uri      : 'https://image-aws-us-west-2.vsco.co/aae927/22278680/5b970f7b0675ea4d44000001/480x320/vsco5b970f7f46638.jpg',
          createdAt: 1538378572611 + this.getRandomNumber(),
          clap     : 12,
        },
        {
          width    : 480,
          height   : 320,
          uri      : 'https://image-aws-us-west-2.vsco.co/80c9fc/3852521/5b97bf022c715b474fb53092/480x320/vsco5b97bf04e559e.jpg',
          createdAt: 1538378572610 + this.getRandomNumber(),
        },
      ],
    }
  }

  getRandomNumber() {
    return Math.floor(Math.random() * 10)
  }

  _renderImageInfo(item: MasonryImage) {
    return (
      <View
        style={styles.imageInfoContainer}>
        <Text style={styles.imageInfoText}>
          @JinHoSo
        </Text>

        {
          item.clap ?
            <View style={styles.imageClapContainer}>
              <Ionicons
                name='md-hand'
                size={11}
                color='#dddddd'
                style={styles.imageClap}
              />
              <Text style={styles.imageInfoText}>
                {
                  item.clap
                }
              </Text>
            </View>
            :
            null
        }
      </View>
    )
  }

  _renderImage(item: MasonryImage) {
    return (
      <ExploreImageItem item={item} />
    )
  }

  getHeightForItem(item) {
    return item.height / (item.width / IMAGE_WIDTH)
  }

  _renderList() {
    return (
      <MasonryList
        data={this.state.imageList}
        renderItem={({item}) => this._renderImage(item)}
        getHeightForItem={({item}) => this.getHeightForItem(item)}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.contentContainer}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {
          this._renderList()
        }
      </View>
    )
  }
}

export const
  Explore = connect<StateProps, DispatchProps, OwnProps>((state: RootState) => ({
    auth: state.auth,
  }), {
    login,
    navigate: NavigationActions.navigate,
  })(ExploreScreen)

const styles = StyleSheet.create({
  container         : {
    flex           : 1,
    backgroundColor: '#ffffff',
    padding        : 0,
    margin         : 0,
  },
  contentContainer  : {
    paddingVertical  : 10,
    paddingHorizontal: 10,
  },
  imageInfoContainer: {
    flexWrap       : 'wrap',
    flexDirection  : 'row',
    marginTop      : 3,
    padding        : 5,
    // backgroundColor: '#fafafa',
    // borderBottomWidth: HAIR_LINE_WIDTH,
    // borderColor      : '#f5f5f5',
  },
  imageInfoText     : {
    fontSize: 10,
    color   : '#b3b3b3',
  },
  imageClapContainer: {
    flexWrap     : 'wrap',
    flexDirection: 'row',
  },
  imageClap         : {
    marginLeft : 5,
    marginRight: 2,
    transform  : [
      {rotate: '-40deg'},
    ],
  },
  align0            : {
    flexDirection : 'column',
    justifyContent: 'center',
    alignItems    : 'flex-end',
  },
  align1            : {
    flexDirection : 'column',
    justifyContent: 'flex-start',
    alignItems    : 'flex-end',
  },
  align2            : {
    flexDirection : 'column',
    justifyContent: 'flex-start',
    alignItems    : 'center',
  },
  align3            : {
    flexDirection : 'column',
    justifyContent: 'flex-start',
    alignItems    : 'flex-start',
  },
  align4            : {
    flexDirection : 'column',
    justifyContent: 'center',
    alignItems    : 'flex-start',
  },
  align5            : {
    flexDirection : 'column',
    justifyContent: 'flex-end',
    alignItems    : 'flex-start',
  },
  align6            : {
    flexDirection : 'column',
    justifyContent: 'flex-end',
    alignItems    : 'center',
  },
  align7            : {
    flexDirection : 'column',
    justifyContent: 'flex-end',
    alignItems    : 'flex-end',
  },
  align8            : {
    flexDirection : 'column',
    justifyContent: 'center',
    alignItems    : 'center',
  },
  align9            : {
    flexDirection : 'column',
    justifyContent: 'center',
    alignItems    : 'center',
  },
})