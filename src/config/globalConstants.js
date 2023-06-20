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
  visit_id: 'visit_id',
  auth: {
    login: 'login',
    logout: 'logout',
  },
  sales: {
    pharmacy: 'sales/pharamcy',
  },
  users: {
    cityArea: 'users/',
    user_orders:'user-orders',
    order_details:'order-details/', 
  },
  doctor: {
    speciality: 'doctor/speciality',
    allDoctors:'sales/doctor',
    specialArea: 'sales/doctor/areas/'
  },
  plans:{
    get_plans: 'plans'
  },
  visit: {
    sales: 'sale-visits',
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