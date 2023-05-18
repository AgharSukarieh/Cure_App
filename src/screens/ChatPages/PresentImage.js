import React from 'react';
import {View, Image, StyleSheet,SafeAreaView} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

const PresentImage = ({route}) => {
  const {arrayOfURI} = route.params;
  // console.log(arrayOfURI);
  const arr = [{url: arrayOfURI}];
  // arrayOfURI.forEach(element => {
  //   arr.push({url: element});
  // });
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <ImageViewer imageUrls={arr} renderIndicator={() => null} />
      </View>
    </SafeAreaView>
  );
};

export default PresentImage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
  },
});
