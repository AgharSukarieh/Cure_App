import { StyleSheet } from 'react-native';
import { Dimensions, Platform } from 'react-native';
const wwidth = Dimensions.get('window').width
const wheight = Dimensions.get('window').height
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: wwidth,
    height: wheight,
    backgroundColor: "#fff",
    // paddingBottom: 75
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
    width: '90%',
    fontSize: 23,
    color: '#0D38AD',
    fontWeight: '500',
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
    color: '#000000'
  },
  inputModel: {
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
    color:'#000000'
  },
  inputError: {
    height: 60,
    borderColor: 'red',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
  },
  // End input controllers style

  // Button Style
  button: {
    backgroundColor: '#469ED8',
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
    color: '#469ED8',
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
    marginTop: 50,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: wwidth,
    paddingHorizontal: '3%',
    justifyContent: 'space-between'
  },
  reportPageButton: {
    backgroundColor: '#ccc',
    padding: 10,
    width: '48%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#469ED8',
    borderRadius: 10,
    marginBottom: 10
  },
  Sal_rep_pharmButton: {
    backgroundColor: '#ccc',
    padding: 10,
    width: '90%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#469ED8',
    borderRadius: 10,
    marginBottom: 20
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
    color: '#469ED8',
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
    width: '100%',
    borderRadius: 15,
    borderColor: '#A5BECC',
    backgroundColor: '#fff',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterbuttontext: {
    textAlign: 'center',
    color: '#808080'
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
    color: '#000',
    marginBottom: 0,
  },
  card: {
    width: '32%',
    height: 100,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6BB1E1',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  cardtext: {
    color: '#6BB1E1',
    textTransform: 'capitalize',
    fontSize: 20
  },
  drop: {
    backgroundColor: '#fff',
    borderWidth: 1,
    width: '100%',
    height: 40,
    borderRadius: 7,
    borderColor: '#A5BECC',
    color:'#000000'
  },
  btn: {
    backgroundColor: '#469ED8',
    width: '95%',
    alignSelf: 'center',
    borderRadius: 15,
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40
  },
  search: {
    backgroundColor: '#fff',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 7,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Platform.OS == 'ios' ? 10 : 0,
    borderWidth: 1,
    borderColor: '#617C9D',
  },
  searchinput: {
    width: '85%',
    color:'#000000'
  },
  logoutbtn: {
    backgroundColor: '#db2323',
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    padding: 10,
    borderRadius: 7
  }
});
