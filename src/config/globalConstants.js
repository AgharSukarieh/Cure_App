const base_URL = () => {
  return 'http://44.211.184.140/api/';
};

export default {
  baseURL: base_URL(),
  storageTokenKeyName: 'access_token',
  lang:'language',
  uId: 'uId',
  role: 'role',
  userData: 'userData',
  auth: {
    login: 'login',
    logout: 'logout',
  },
  sales: {
    pharmacy: 'sales/pharamcy',
  },
  users: {
    cityArea: 'users/'
  }

};






    // console.log("**************");
    // let config = {
    //   method: 'post',
    //   maxBodyLength: Infinity,
    //   url: 'https://makfi.ncitsolutions.com/api/client/auth/login',
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //   },
    //   data: {mobile_number: '+962798287580',},
    // };

    // try {
    //   const response = await axios.request(config);
    //   console.log(JSON.stringify(response.data));
    //   console.log('1111111111111111');
    // } catch (error) {
    //   console.log('22222222222222222');
    //   console.log(error.message);
    // }