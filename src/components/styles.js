import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
const wwidth = Dimensions.get('window').width
const wheight = Dimensions.get('window').height
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: wwidth,
    height: wheight,
    backgroundColor: "#fff"
  },

  // Start Top Container style image with Text
  imageSideStyle: {
    width: 30,
    height: 50,
    marginLeft: 10,
    marginTop: 10,
  },

  textRightStyle: {
    textAlign: 'center',
    width: '80%',
    fontSize: 30,
    color: '#253274',
    fontWeight: 'bold',
  },
  // End top Image text style

  // input component style
  inbutContainer: {
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
  },

  label: {
    marginBottom: 5,
    color: '#253274',
    fontSize: 11,
  },

  input: {
    height: 60,
    borderColor: 'rgba(37, 50, 116, 0.28)',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
  },
  // End input controllers style

  // Button Style
  button: {
    backgroundColor: '#7189FF',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white',
    height: 60,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 19,
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  // End button Style
  containerSignIn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  checkPharmacy: {
    marginTop: 30,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  checkPharmacyText: {
    textAlign: 'center',
    color: '#253274',
    fontSize: 16,
  },
  signInPharmacyStyle: {
    paddingHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7189FF',
  },
  imageButtonContainer: {
    width: '100%',
  },
  bottomImage: {
    position: 'relative',
    bottom: 0,
    top: 122,
  },
  buttonContainer: {
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
  },
  iconPassword: {
    position: 'absolute',
    top: 40,
    left: '85%',
  },
  iconPasswordHide: {
    position: 'absolute',
    left: '85%',
  },
  reportPageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  reportPageRow: {
    flexDirection: 'row',
  },
  reportPageButton: {
    backgroundColor: '#ccc',
    padding: 10,
    margin: 10,
    width: 160,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7189FF',
    borderRadius: 10,
  },

  reportPageText: {
    textAlign: 'center',
    fontSize: 24,
    color: '#ffffff',
  },
  nameDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  leftText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000'
  },
  rightText: {
    fontSize: 17,
    color: '#7189FF',
  },
  helloText: {
    color: '#253274',
  },
  arrowBack: {
    marginLeft: 20,
  },

  filterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  filterbutton: {
    padding: 6,
    borderWidth: 1,
    width: '90%',
    borderRadius: 5,
    borderColor: '#7189FF',
    backgroundColor: '#fff'
  },
  filterbuttontext: {
    textAlign: 'center',
  },
  calenderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  calenderSubContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%',
  },
  calenderText: {
    fontSize: 20,
    color: 'rgba(37, 50, 116, 0.6)',
    marginBottom: 0,
  },

  card: {
    width: '32%',
    height: 100,
    backgroundColor: '#7189FF',
    marginBottom: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardtext: {
    color: '#fff',
    textTransform: 'capitalize',
    fontSize: 20
  },
  drop: {
    backgroundColor: '#fff',
    borderWidth: 1,
    width: '100%',
    borderRadius: 7,
    borderColor: '#7189FF'
  },
  btn: {
    backgroundColor: '#7189FF',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 7,
    padding: 7,
    alignItems: 'center',
    justifyContent:'center'

  }
});
