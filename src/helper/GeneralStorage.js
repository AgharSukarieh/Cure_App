import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.log(e);
    }
  };

  export const getStoreData = async key => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(key).then(data => {
          resolve(data);
        });
      });
  };


export const storeJsonData = async (key, value) => {
  try {
    const valueToStore = JSON.stringify(value);
    await AsyncStorage.setItem(key, valueToStore);
  } catch (error) {
    console.log(`Error storing data for key ${key}: ${error}`);
  }
};

export const getStoreJsonData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      const parsedValue = JSON.parse(value);
      return parsedValue;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};



  export const removeStoreData = async key => {
    try {
      await AsyncStorage.removeItem(key);
      console.log('remove', key);
      return true;
    } catch (exception) {
      return false;
    }
  };