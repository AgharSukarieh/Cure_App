import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    margin: 5,
    width: 150,
    height: 150,
  },
});
