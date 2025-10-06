import {
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Animated,
  Pressable,
  StyleSheet,
  I18nManager,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";
import Constants from "../../config/globalConstants";
import API, { tokenManager } from "../../config/apiConfig";
import LoadingScreen from "../../components/LoadingScreen";
import LinearGradient from "react-native-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { PieChart, LineChart } from "react-native-chart-kit";
import { useTranslation } from "react-i18next";
import { get } from "../../WebService/RequestBuilder";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCitiesAndAreas, clearUserLocationData } from '../../store/apps/cities';
import locationService from '../../services/locationService';

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;
// const getCityAreaEndpoint = Constants.users.cityArea; // Not available in globalConstants

const AnimatedPressable = ({
  children,
  style,
  onPress,
  baseColor,
  pressedColor,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const handlePressIn = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };
  const handlePressOut = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };
  const interpolatedColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [baseColor, pressedColor],
  });
  const animatedStyle = { backgroundColor: interpolatedColor };
  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
};



const chartsData = {
  Daily: {
    pie: [{ population: 15000 }, { population: 85000 }],
    line: {
      labels: ["8am", "10am", "12pm", "2pm", "4pm", "6pm"],
      datasets: [
        { data: [20, 45, 28, 80, 50, 43] },
        { data: [30, 50, 40, 70, 60, 55] },
      ],
    },
  },
  Monthly: {
    pie: [{ population: 65000 }, { population: 35000 }],
    line: {
      labels: ["W1", "W2", "W3", "W4"],
      datasets: [
        { data: [450, 600, 800, 750] },
        { data: [500, 550, 780, 800] },
      ],
    },
  },
  Yearly: {
    pie: [{ population: 920000 }, { population: 80000 }],
    line: {
      labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
      datasets: [
        { data: [5000, 4500, 8000, 7000, 9500, 11000] },
        { data: [6000, 5000, 7500, 7200, 9000, 10000] },
      ],
    },
  },
};

const HomePage = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { role, user, isAuthenticated, loading, token } = useAuth();
  
  // طباعة بيانات AuthContext
  console.log('🔍 AuthContext Debug:');
  console.log('  - role:', role);
  console.log('  - isAuthenticated:', isAuthenticated);
  console.log('  - loading:', loading);
  console.log('  - token:', token ? 'موجود' : 'غير موجود');
  console.log('  - token value:', token);
  console.log('  - user keys:', user ? Object.keys(user) : 'user is null');
  console.log('  - user object:', user);
  const [isLoading, setIsLoading] = useState(false);
  
  // Redux
  const dispatch = useDispatch();
  const userLocationData = useSelector(state => state.cities.userLocationData);
// للوصول للبيانات:
const userId = user?.id;                    // 19
const userEmail = user?.email;              // aghar101010@gmail.com
const userName = user?.name;                // Dr. Ahmed Medical Rep
const userRole = user?.role;                // medical

// Medical Record (إذا موجود في response)
const medicalId = user?.medical?.id;        // 1
const blockId = user?.medical?.block_id;    // 4

// Block Data (إذا موجود)
const blockName = user?.medical?.block?.name;           // Medical Block Riyadh
const blockCities = user?.medical?.block?.cities;       // [{id: 1, name: 'الرياض'}, ...]
const blockAreas = user?.medical?.block?.areas; 

  // إظهار شاشة التحميل إذا كان يتم جلب بيانات المستخدم
  if (loading) {
    return <LoadingScreen />;
  }


  const [selectedPieFilter, setSelectedPieFilter] = useState("Daily");
  const [showPieOptions, setShowPieOptions] = useState(false);

  const [selectedLineFilter, setSelectedLineFilter] = useState("Daily");
  const [showLineOptions, setShowLineOptions] = useState(false);
  const [cityArea, setCityArea] = useState(null);

  // دالة لاختبار جلب البيانات يدوياً
  const testFetchCitiesAndAreas = async () => {
    console.log('🧪 اختبار جلب البيانات باستخدام locationService...');
    
    try {
      const result = await locationService.fetchCitiesAndAreas();
      
      if (result.success) {
        console.log('✅ اختبار ناجح - تم جلب البيانات');
        console.log('🆔 Block ID:', result.data.block_id);
        console.log('🏙️ عدد المدن:', result.data.cities?.length || 0);
        console.log('📍 عدد المناطق:', result.data.areas?.length || 0);
        
        // طباعة المناطق
        if (result.data.areas && result.data.areas.length > 0) {
          console.log('📍 المناطق:');
          result.data.areas.forEach((area, index) => {
            console.log(`  ${index + 1}. ${area.name} (ID: ${area.id})`);
          });
        }
        
        if (result.fromCache) {
          console.log('📦 البيانات من التخزين المحلي');
        }
      } else {
        console.log('❌ اختبار فاشل:', result.error);
      }
    } catch (error) {
      console.error('❌ خطأ في الاختبار:', error);
    }
  };


  // دالة لمسح البيانات وإعادة جلبها
  const clearAndRefetchData = async () => {
    console.log('🗑️ مسح البيانات وإعادة جلبها...');
    
    try {
      // مسح البيانات المخزنة محلياً
      await locationService.clearCachedData();
      console.log('✅ تم مسح البيانات المخزنة');
      
      // إعادة جلب البيانات
      const result = await locationService.fetchCitiesAndAreas();
      
      if (result.success) {
        console.log('✅ تم إعادة جلب البيانات بنجاح');
        console.log('🏙️ عدد المدن:', result.data.cities?.length || 0);
        console.log('📍 عدد المناطق:', result.data.areas?.length || 0);
        
        // طباعة المناطق
        if (result.data.areas && result.data.areas.length > 0) {
          console.log('📍 المناطق الجديدة:');
          result.data.areas.forEach((area, index) => {
            console.log(`  ${index + 1}. ${area.name} (ID: ${area.id})`);
          });
        }
      } else {
        console.log('❌ فشل في إعادة جلب البيانات:', result.error);
      }
    } catch (error) {
      console.error('❌ خطأ في مسح وإعادة جلب البيانات:', error);
    }
  };
  
  // جلب المدن والمناطق الخاصة بالمستخدم عند فتح الصفحة
  useEffect(() => {
    const loadUserLocationData = async () => {
      console.log('🚀 بدء جلب البيانات - HomePage useEffect (LocationService)');
      console.log('👤 User موجود؟', !!user);
      console.log('🆔 User ID:', user?.id);
      
      if (user?.id && token) {
        console.log('📡 بدء استدعاء locationService.fetchCitiesAndAreas...');
        console.log('🔑 Token المستخدم:', token);
        try {
          const result = await locationService.fetchCitiesAndAreas(token);
          
          if (result.success) {
            // console.log('✅ تم جلب البيانات بنجاح من locationService');
            // console.log('🆔 Block ID:', result.data.block_id);
            // console.log('🏙️ عدد المدن:', result.data.cities?.length || 0);
            // console.log('📍 عدد المناطق:', result.data.areas?.length || 0);
            
            // طباعة تفاصيل المناطق
            if (result.data.areas && result.data.areas.length > 0) {
              // console.log('🏙️ ========== المناطق التي تم جلبها في HomePage ==========');
              // console.log('📍 إجمالي عدد المناطق:', result.data.areas.length);
              // console.log('🆔 Block ID:', result.data.block_id);
              
              result.data.areas.forEach((area, index) => {
                console.log(`  ${index + 1}. ${area.name} (ID: ${area.id}) - مدينة: ${area.city_name || 'غير محدد'} (City ID: ${area.city_id})`);
              });
              
              console.log('🏙️ ============================================');
            }
            
            if (result.fromCache) {
              console.log('📦 البيانات من التخزين المحلي');
            }
          } else {
            console.log('❌ فشل في جلب البيانات:', result.error);
          }
        } catch (error) {
          console.error('❌ خطأ في locationService:', error);
        }
      } else {
        console.log('⚠️ لا يوجد User ID');
      }
    };
    
    if (user?.id) {
      console.log('🎯 User ID موجود - بدء loadUserLocationData');
      loadUserLocationData();
    } else {
      console.log('⚠️ لا يوجد User ID');
    }
  }, [user?.id]);

  // عرض المدن والمناطق المخزنة في Redux
  useEffect(() => {
    if (userLocationData.cities.length > 0 || userLocationData.areas.length > 0) {
      console.log('🏙️ ========== البيانات المخزنة في Redux - HomePage ==========');
      console.log('🆔 Block ID:', userLocationData.block_id);
      console.log('🏙️ عدد المدن المخزنة:', userLocationData.cities.length);
      console.log('📍 عدد المناطق المخزنة:', userLocationData.areas.length);
      
      if (userLocationData.cities.length > 0) {
        console.log('🏙️ المدن المخزنة:');
        userLocationData.cities.forEach((city, index) => {
          console.log(`  ${index + 1}. ${city.name} (ID: ${city.id})`);
        });
      }
      
      if (userLocationData.areas.length > 0) {
        console.log('📍 المناطق المخزنة:');
        userLocationData.areas.forEach((area, index) => {
          console.log(`  ${index + 1}. ${area.name} (ID: ${area.id}) - مدينة: ${area.city_name || 'غير محدد'} (City ID: ${area.city_id})`);
        });
      }
      
      console.log('🏙️ ============================================');
    }
  }, [userLocationData.cities.length, userLocationData.areas.length, userLocationData.block_id]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  const pieChartData = [
    {
      name: t("homeScreen.achieved"),
      population: chartsData[selectedPieFilter].pie[0].population,
      color: "#2F5ED8",
      legendFontColor: "#4A3AFF",
      legendFontSize: 12,
    },
    {
      name: t("homeScreen.remaining"),
      population: chartsData[selectedPieFilter].pie[1].population,
      color: "#183E9F",
      legendFontColor: "#999",
      legendFontSize: 12,
    },
  ];
const categoriesData = [
  {
    id: 1,
    key: "clientList",
    image: require("../../../assets/icons/client_list.png"),
    pressedColor: "#183E9F",
    onclick: () => { user?.role === 'sales' ? navigation.navigate('Clientpharmalist') : navigation.navigate('Clientdoctorlist')},
  },
  {
    id: 2,
    key: "monthlyPlan",
    image: require("../../../assets/icons/monthly-plan.png"),
    pressedColor: "#183E9F",
    onclick: () => {navigation.navigate('MedicalReportScreen')},
  },
  {
    id: 3,
    key: role == 'sales' ? t('collection.headerTitle') : t('frequencyReport.headerTitle'),
    image: require("../../../assets/icons/visit.png"),
    pressedColor: "#183E9F",
     onclick: () => { role == 'sales' ? navigation.navigate('Collection') : navigation.navigate('FrequencyReport')},
  },
  {
    id: 4,
    key: "sales",
    image: require("../../../assets/icons/online-store.png"),
    pressedColor: "#183E9F",
     onclick: () => { navigation.navigate('Sales')},
  },

];
  const lineChartData = {
    labels: chartsData[selectedLineFilter].line.labels,
    datasets: [
      {
        data: chartsData[selectedLineFilter].line.datasets[0].data,
        color: () => `#2F5ED8`,
        strokeWidth: 3,
      },
      {
        data: chartsData[selectedLineFilter].line.datasets[1].data,
        color: () => `#FF8C21`,
        strokeWidth: 5,
      },
    ],
  };

  const options = [
    { label: t("homeScreen.daily"), value: "Daily" },
    { label: t("homeScreen.monthly"), value: "Monthly" },
    { label: t("homeScreen.yearly"), value: "Yearly" },
  ];

  const lineChartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: "4", strokeWidth: "1", stroke: "#2167ffff" },
  };

  const totalPopulation = pieChartData.reduce(
    (sum, item) => sum + item.population,
    0
  );
  const achievedPercentage =
    totalPopulation > 0
      ? Math.round((pieChartData[0].population / totalPopulation) * 100)
      : 0;
  const remainingPercentage = 100 - achievedPercentage;

  if (isLoading) {
    return (
      <SafeAreaView style={Styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} style={{ height: heightScreen }}>
          <View style={Styles.loadingHeaderContainer}>
            <LinearGradient
              colors={["#69b4ddff", "#0574b1ff"]}
              style={Styles.loadingLinearGradient}
            >
              <View style={Styles.loadingHeaderTop}>
                <View style={Styles.loadingImageContainer}>
                  <View style={Styles.loadingImage} />
                </View>
                <View style={{ width: widthScreen * 0.02 }} />
                <View style={Styles.loadingTextContainer}>
                  <View style={Styles.loadingWelcomeText} />
                  <View style={[Styles.loadingWelcomeText, { width: '70%', marginTop: 5 }]} />
                </View>
                <View style={Styles.loadingNotificationContainer}>
                  <View style={Styles.loadingNotificationIcon} />
                  <View style={Styles.loadingNotificationBadge} />
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={Styles.loadingPieChartContainer}>
            <View style={Styles.loadingPieChartInner}>
              <View style={Styles.loadingPieChart}>
                <View style={Styles.loadingPieChartHeader}>
                  <View style={Styles.loadingPieChartTitle} />
                  <View style={Styles.loadingPieChartArrow} />
                </View>
                <View style={Styles.loadingPieChartContent}>
                  <View style={Styles.loadingPieChartCircle} />
                  <View style={Styles.loadingPieChartCenterText} />
                </View>
              </View>
              
              <View style={Styles.loadingDropdownContainer}>
                <View style={Styles.loadingDropdownButton}>
                  <View style={Styles.loadingDropdownText} />
                  <View style={Styles.loadingDropdownArrow} />
                </View>
              </View>
            </View>
          </View>

          <View style={Styles.loadingLineChartContainer}>
            <View style={Styles.loadingLineChartInner}>
              <View style={Styles.loadingLineChartHeader}>
                <View style={Styles.loadingLineChartTitle} />
                <View style={Styles.loadingLineChartArrow} />
              </View>
              
              <View style={Styles.loadingLegendContainer}>
                <View style={Styles.loadingLegendItem}>
                  <View style={Styles.loadingLegendLine} />
                  <View style={Styles.loadingLegendText} />
                </View>
                <View style={Styles.loadingLegendItem}>
                  <View style={[Styles.loadingLegendLine, { backgroundColor: '#183E9F' }]} />
                  <View style={Styles.loadingLegendText} />
                </View>
              </View>

              <View style={Styles.loadingLineChartContent}>
                <View style={Styles.loadingLineChartGraph} />
              </View>
            </View>
          </View>

          <View style={Styles.loadingCategoriesContainer}>
            <View style={Styles.loadingCategoriesTitle} />
            <View style={Styles.loadingCategoriesGrid}>
              {[1, 2, 3, 4].map((item) => (
                <View key={item} style={Styles.loadingCategoryItem}>
                  <View style={Styles.loadingCategoryIcon} />
                  <View style={Styles.loadingCategoryText} />
                </View>
              ))}
            </View>
          </View>

          <View style={{ height: 100 }}></View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={Styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ height: heightScreen }}>
        <View style={Styles.headerContainer}>
          <LinearGradient
            colors={["#69b4ddff", "#0574b1ff"]}
            style={Styles.linearGradient}
          >
            <View style={Styles.headerContainerTop}>
              <View style={Styles.containerImage}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ProfileScreen')}
                  style={Styles.imageButton}
                >
                  <Image
                    source={require("../../../assets/images/doctor.png")}
                    style={Styles.imageStyle}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ width: widthScreen * 0.02 }} />
              <View style={Styles.containerColumn}>
                <Text style={Styles.TextWelcomeBack}>
                  {t("homeScreen.welcomeBack")}
                </Text>
                <Text style={Styles.TextNameUser}>{user?.name || 'المستخدم'}</Text>
                <Text style={Styles.TextNameUser}>
                  {user?.supervisor?.name || user?.distributor_name || 'لا يوجد سوبر فايزر'}
                </Text>
              </View>
              <View style={Styles.containerNotification}>
                <TouchableOpacity
                  onPress={() =>
                   navigation.navigate('NotificationScreen')  
                  }
                  style={Styles.notificationButton}
                >
                  <FontAwesome
                    name="bell-o"
                    size={widthScreen * 0.05}
                    color="#fff"
                  />
                  <View style={Styles.notificationBadge}>
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: widthScreen * 0.025,
                        fontWeight: "600",
                      }}
                    >
                      3
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={Styles.containerChartPie}>
          <View style={Styles.innerContainerChartPie}>
            <View style={Styles.ChartPie}>
              <View style={Styles.rowChartTitle}>
                {/* <Text style={Styles.chartTitle}>{t("homeScreen.detail")}</Text>
                <FontAwesome
                  name="angle-right"
                  size={widthScreen * 0.06}
                  color="#2085BC"
                  style={{ marginLeft: widthScreen * 0.02 }}
                /> */}
              </View>
              <View style={Styles.containerChart}>
                <PieChart
                  data={pieChartData}
                  width={widthScreen * 0.9}
                  height={heightScreen * 0.2}
                  chartConfig={lineChartConfig}
                  accessor={"population"}
                  backgroundColor={"transparent"}
                  paddingLeft={"15"}
                  center={[10, 0]}
                  absolute
                  hasLegend={false}
                />
              </View>
              <View style={Styles.circleChartPie}>
                <Text style={Styles.numberPercentRemaining}>
                  {`${remainingPercentage}%`}
                </Text>
              </View>
            </View>

            <View style={Styles.dropdownContainer}>
              <TouchableOpacity
                style={Styles.dropdownButton}
                onPress={() => setShowPieOptions(!showPieOptions)}
              >
                <Text style={Styles.dropdownButtonText}>
                  {t(`homeScreen.${selectedPieFilter.toLowerCase()}`)}
                </Text>
                <FontAwesome
                  name={showPieOptions ? "chevron-up" : "chevron-down"}
                  size={widthScreen * 0.03}
                  color="#2085BC"
                  style={{ marginLeft: widthScreen * 0.02 }}
                />
              </TouchableOpacity>
              {showPieOptions && (
                <View style={Styles.dropdownMenu}>
                  {options.map((item) => (
                    <TouchableOpacity
                      key={item.value}
                      style={Styles.dropdownItem}
                      onPress={() => {
                        setSelectedPieFilter(item.value);
                        setShowPieOptions(false);
                      }}
                    >
                      <Text style={Styles.dropdownItemText}>{item.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={Styles.legendContainer}>
              <View style={Styles.legendItem}>
                <View style={Styles.legendColorBox} />
                <View style={Styles.containerColumnLegendText}>
                  <Text style={Styles.legendText}>{t("homeScreen.achieved")}</Text>
                  <Text style={Styles.TextNumbers}>100,000</Text>
                </View>
              </View>
              <View style={Styles.legendItem}>
                <View
                  style={[
                    Styles.legendColorBox,
                    { backgroundColor: "#183E9F" },
                  ]}
                />
                <View style={Styles.containerColumnLegendText}>
                  <Text style={Styles.legendText}>{t("homeScreen.remaining")}</Text>
                  <Text style={Styles.TextNumbers}>100,000</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={Styles.LineChartOuterContainer}>
          <View style={Styles.dropdownContainer}>
            <TouchableOpacity
              style={Styles.dropdownButton}
              onPress={() => setShowLineOptions(!showLineOptions)}
            >
              <Text style={Styles.dropdownButtonText}>
                {t(`homeScreen.${selectedLineFilter.toLowerCase()}`)}
              </Text>
              <FontAwesome
                name={showLineOptions ? "chevron-up" : "chevron-down"}
                size={widthScreen * 0.03}
                color="#2085BC"
                style={{ marginLeft: widthScreen * 0.02 }}
              />
            </TouchableOpacity>
            {showLineOptions && (
              <View style={Styles.dropdownMenu}>
                {options.map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    style={Styles.dropdownItem}
                    onPress={() => {
                      setSelectedLineFilter(item.value);
                      setShowLineOptions(false);
                    }}
                  >
                    <Text style={Styles.dropdownItemText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={Styles.legendContainerLineChart}>
            <View style={Styles.legendSalesContainer}>
              <View style={Styles.LineLegendSales}></View>
              <View>
                <Text style={Styles.TextSales}>{t("homeScreen.totalSales")}</Text>
              </View>
            </View>
            <View style={Styles.legendTargetContainer}>
              <View style={Styles.LineLegendTarget}></View>
              <View>
                <Text style={Styles.TextTarget}>{t("homeScreen.totalTarget")}</Text>
              </View>
            </View>
          </View>

          <View style={Styles.ChartLineContainerinner}>
            <LineChart
              data={lineChartData}
              width={widthScreen * 0.9}
              height={heightScreen * 0.22}
              chartConfig={lineChartConfig}
              bezier
              style={{ borderRadius: 16 }}
              withHorizontalLines={false}
              withVerticalLines={false}
              fromZero={true}
              withShadow={false}
              hideLegend={true}
            />
          </View>
        </View>

        <View style={Styles.containerCategories}>
          <Text style={Styles.TextCategoies}>{t("homeScreen.management")}</Text>
          <View style={Styles.innerContainerCatgories}>
            {categoriesData.map((category) => (
              <View key={category.id} style={Styles.categoryItemContainer}>
                <AnimatedPressable
                  onPress={() => category.onclick()}
                  style={Styles.containerButton}
                  baseColor="#ffffff"
                  pressedColor={category.pressedColor}
                >
                  <Image source={category.image} style={Styles.IconCatgories} />
                </AnimatedPressable>
                <Text style={Styles.categoryText}>
                  {category.key}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View style={{marginTop:60}}></View>
            <View style={Styles.containerCategories}>
              <Text style={Styles.TextCategoies}>{t("homeScreen.medicalServices")}</Text>
              <View style={Styles.innerContainerCatgories}>
                <View style={Styles.categoryItemContainer}>
                  <AnimatedPressable
                    onPress={() => {navigation.navigate('sal_rep_pharm')}}
                    style={Styles.containerButton}
                    baseColor="#ffffff"
                    pressedColor="#f0f0f0"
                  >
                    <FontAwesome name="calendar" size={24} color="#1A46BE" />
                  </AnimatedPressable>
                  <Text style={Styles.categoryText}>
                    {t('homeScreen.appointments')}
                  </Text>
                </View>
                
                <View style={Styles.categoryItemContainer}>
                  <AnimatedPressable
                    onPress={() => {navigation.navigate('Clientpharmalist')}}
                    style={Styles.containerButton}
                    baseColor="#ffffff"
                    pressedColor="#f0f0f0"
                  >
                    <FontAwesome name="user-md" size={24} color="#1A46BE" />
                  </AnimatedPressable>
                  <Text style={Styles.categoryText}>
                    {t('homeScreen.medicalReports')}
                  </Text>
                </View>
              </View>
            </View>

            {/* زر اختبار جلب المدن والمناطق */}
            <View style={Styles.containerCategories}>
              <Text style={Styles.TextCategoies}>اختبار البيانات</Text>
              <View style={Styles.innerContainerCatgories}>
                <View style={Styles.categoryItemContainer}>
                  <AnimatedPressable
                    onPress={testFetchCitiesAndAreas}
                    style={Styles.containerButton}
                    baseColor="#ffffff"
                    pressedColor="#f0f0f0"
                  >
                    <FontAwesome name="refresh" size={24} color="#1A46BE" />
                  </AnimatedPressable>
                  <Text style={Styles.categoryText}>
                    جلب (طريقة قديمة)
                  </Text>
                </View>
                
              </View>
              
              <View style={Styles.innerContainerCatgories}>
                <View style={Styles.categoryItemContainer}>
                  <AnimatedPressable
                    onPress={async () => {
                      console.log('🔍 ========== عرض البيانات الحالية من locationService ==========');
                      
                      try {
                        const cachedData = await locationService.getCachedCitiesAndAreas();
                        
                        if (cachedData) {
                          console.log('🆔 Block ID:', cachedData.block_id);
                          console.log('🏙️ عدد المدن:', cachedData.cities?.length || 0);
                          console.log('📍 عدد المناطق:', cachedData.areas?.length || 0);
                          
                          console.log('🏙️ المدن:');
                          cachedData.cities.forEach((city, index) => {
                            console.log(`  ${index + 1}. ${city.name} (ID: ${city.id})`);
                          });
                          
                          console.log('📍 المناطق:');
                          cachedData.areas.forEach((area, index) => {
                            console.log(`  ${index + 1}. ${area.name} (ID: ${area.id}) - مدينة: ${area.city_name || 'غير محدد'} (City ID: ${area.city_id})`);
                          });
                        } else {
                          console.log('❌ لا توجد بيانات مخزنة محلياً');
                        }
                      } catch (error) {
                        console.error('❌ خطأ في قراءة البيانات المخزنة:', error);
                      }
                      
                      console.log('🔍 ============================================');
                    }}
                    style={Styles.containerButton}
                    baseColor="#ffffff"
                    pressedColor="#f0f0f0"
                  >
                    <FontAwesome name="eye" size={24} color="#1A46BE" />
                  </AnimatedPressable>
                  <Text style={Styles.categoryText}>
                    عرض البيانات
                  </Text>
                </View>
                
                <View style={Styles.categoryItemContainer}>
                  <AnimatedPressable
                    onPress={() => {
                      console.log('🔍 معلومات البيانات:');
                      console.log('Block ID من Redux:', userLocationData.block_id);
                      console.log('بيانات المستخدم الطبية:', user?.medical);
                      console.log('عدد المدن:', userLocationData.cities.length);
                      console.log('عدد المناطق:', userLocationData.areas.length);
                    }}
                    style={Styles.containerButton}
                    baseColor="#ffffff"
                    pressedColor="#f0f0f0"
                  >
                    <FontAwesome name="info-circle" size={24} color="#1A46BE" />
                  </AnimatedPressable>
                  <Text style={Styles.categoryText}>
                    معلومات البيانات
                  </Text>
                </View>
              </View>
              
              <View style={Styles.innerContainerCatgories}>
                <View style={Styles.categoryItemContainer}>
                  <AnimatedPressable
                    onPress={clearAndRefetchData}
                    style={Styles.containerButton}
                    baseColor="#ffffff"
                    pressedColor="#f0f0f0"
                  >
                    <FontAwesome name="trash" size={24} color="#1A46BE" />
                  </AnimatedPressable>
                  <Text style={Styles.categoryText}>
                    مسح وإعادة جلب
                  </Text>
                </View>
                
                <View style={Styles.categoryItemContainer}>
                  <AnimatedPressable
                    onPress={async () => {
                      console.log('📊 ========== إحصائيات البيانات من locationService ==========');
                      
                      try {
                        const cachedData = await locationService.getCachedCitiesAndAreas();
                        
                        if (cachedData) {
                          console.log(`🏙️ عدد المدن: ${cachedData.cities?.length || 0}`);
                          console.log(`📍 عدد المناطق: ${cachedData.areas?.length || 0}`);
                          console.log(`🆔 Block ID: ${cachedData.block_id || 'غير محدد'}`);
                          
                          // طباعة تفاصيل المناطق
                          if (cachedData.areas && cachedData.areas.length > 0) {
                            console.log('📍 تفاصيل المناطق:');
                            cachedData.areas.forEach((area, index) => {
                              console.log(`  ${index + 1}. ${area.name} (ID: ${area.id}) - مدينة: ${area.city_name || 'غير محدد'}`);
                            });
                          }
                        } else {
                          console.log('❌ لا توجد بيانات مخزنة محلياً');
                        }
                      } catch (error) {
                        console.error('❌ خطأ في قراءة الإحصائيات:', error);
                      }
                      
                      console.log('📊 ============================================');
                    }}
                    style={Styles.containerButton}
                    baseColor="#ffffff"
                    pressedColor="#f0f0f0"
                  >
                    <FontAwesome name="bar-chart" size={24} color="#1A46BE" />
                  </AnimatedPressable>
                  <Text style={Styles.categoryText}>
                    إحصائيات
                  </Text>
                </View>
              </View>
            </View>
        <View style={{ height: 100 }}></View>
      </ScrollView>
      {isLoading && <LoadingScreen />}
    </SafeAreaView>
  );
};




const Styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    height: heightScreen * 0.28,
    width: widthScreen,
    borderBottomLeftRadius: widthScreen * 0.05,
    borderBottomRightRadius: widthScreen * 0.05,
    backgroundColor: "#EBEBEB",
  },
  headerContainerTop: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: widthScreen * 0.05,
    marginTop: heightScreen * 0.012,
    width: "100%",
  },
  linearGradient: {
    flex: 1,
    borderBottomLeftRadius: widthScreen * 0.15,
    borderBottomRightRadius: widthScreen * 0.15,
    paddingHorizontal: widthScreen * 0.03,
    width: "100%",
  },
  containerImage: {
    width: widthScreen * 0.12,
    height: widthScreen * 0.12,
    backgroundColor: "#fff",
    borderRadius: (widthScreen * 0.12) / 2,
  },
  imageStyle: {
    width: "100%",
    height: "100%",
    borderRadius: (widthScreen * 0.12) / 2,
    resizeMode: "cover",
  },
  TextWelcomeBack: {
    color: "#fff",
    fontSize: widthScreen * 0.03,
    fontWeight: "400",
  },
  TextNameUser: {
    color: "#fff",
    fontSize: widthScreen * 0.035,
    fontWeight: "600",
  },
  containerNotification: {
    position: "absolute",
    right: widthScreen * 0.025,
    top: heightScreen * 0.015,
    backgroundColor: "#183e9fd5",
    padding: widthScreen * 0.02,
    borderRadius: widthScreen * 0.025,
  },
  notificationBadge: {
    position: "absolute",
    top: -heightScreen * 0.008,
    right: -widthScreen * 0.008,
    backgroundColor: "#FF0000",
    width: widthScreen * 0.04,
    height: widthScreen * 0.04,
    borderRadius: (widthScreen * 0.04) / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  containerChartPie: {
    marginTop: -heightScreen * 0.19,
    marginHorizontal: widthScreen * 0.05,
    width: widthScreen * 0.9,
    height: heightScreen * 0.3,
    backgroundColor: "#fff",
    borderRadius: widthScreen * 0.05,
    zIndex: 100,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    paddingHorizontal: widthScreen * 0.025,
    overflow: "visible",
  },
  innerContainerChartPie: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  ChartPie: {
    marginTop: heightScreen * 0.01,
    position: "absolute",
 

    start: widthScreen * 0.33,
    
  },
  containerChart: {
    width: widthScreen * 0.9,
    height: heightScreen * 0.2,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    top: heightScreen * 0.06,
    right:I18nManager.isRTL? 120:0

  },
  circleChartPie: {
    width: widthScreen * 0.2,
    height: widthScreen * 0.2,
    borderRadius: (widthScreen * 0.2) / 2,
    backgroundColor: "#EBEBEB",
    zIndex: 1,
    position: "absolute",
    top: heightScreen * 0.112,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  
    start: widthScreen * 0.194,
  },

  legendContainer: { zIndex: 0, paddingTop: 0, justifyContent: "space-around" },
  legendItem: {
    flexDirection: "row",
    marginHorizontal: widthScreen * 0.025,
    marginBottom: heightScreen * 0.02,
  },
  legendColorBox: {
    backgroundColor: "#2F5ED8",
    width: widthScreen * 0.05,
    height: widthScreen * 0.05,
    borderRadius: (widthScreen * 0.05) / 2,
    marginEnd: widthScreen * 0.02,
    marginTop: heightScreen * 0.032,
  },
  legendText: {
    fontSize: widthScreen * 0.035,
    color: "#000000ff",
    fontWeight: "400",
    textAlign: 'left',
   
  },
  containerColumnLegendText: {
    flexDirection: "column",
    gap: 5,
    paddingTop: 22,
  },
  TextNumbers: {
    fontSize: widthScreen * 0.065,
    color: "#2085BC",
    fontWeight: "600",
  },
  rowChartTitle: {
    flexDirection: I18nManager.isRTL? "row-reverse":"row",
    gap: widthScreen * 0.01,
    position: 'absolute', 
    start: widthScreen * 0.33,
    top: heightScreen * 0.01,
    marginBottom: heightScreen * 0.04,
    alignItems: 'center', 
  },
  dropdownContainer: {
    position: "relative",
    alignItems: "flex-start",
    marginTop: heightScreen * 0.02,
    marginStart: widthScreen * 0.04,
    zIndex: 1000,
  },
  dropdownButton: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: widthScreen * 0.02,
    paddingHorizontal: widthScreen * 0.03,
    backgroundColor: "#fff",
    minWidth: widthScreen * 0.3,
  },
  dropdownButtonText: {
    fontSize: widthScreen * 0.035,
    color: "#2085BC",
    flex: 1,
    textAlign: 'left',
  },
  dropdownMenu: {
    position: "absolute",
    top: heightScreen * 0.06,
    start: 0,
    borderRadius: widthScreen * 0.02,
    backgroundColor: "#fff",
    minWidth: widthScreen * 0.3,
    maxHeight: heightScreen * 0.25,
    zIndex: 2000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    paddingHorizontal: widthScreen * 0.03,
    paddingVertical: heightScreen * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemText: {
    textAlign: 'left',
  }
,
  chartTitle: { fontSize: widthScreen * 0.035, color: "#2085BC" },
  LineChartOuterContainer: {
    width: widthScreen * 0.9,
    height: heightScreen * 0.36,
    backgroundColor: "#fff",
    borderRadius: widthScreen * 0.05,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    paddingHorizontal: widthScreen * 0.025,
    alignSelf: "center",
    marginTop: heightScreen * 0.02,
    marginBottom: 10,
  },
  legendContainerLineChart: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginTop: 9,
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  legendSalesContainer: {
    flexDirection: "row",
    width: 110,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
  },
  LineLegendSales: {
    width: widthScreen * 0.1,
    height: heightScreen * 0.012,
    backgroundColor: "#2F5ED8",
    borderRadius: 20,
  },
  TextSales: { fontSize: 12, color: "#000000ff", fontWeight: "400" },
  legendTargetContainer: {
    flexDirection: "row",
    width: 110,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
  },
  LineLegendTarget: {
    width: widthScreen * 0.1,
    height: heightScreen * 0.012,
    backgroundColor: "#FF8C21",
    borderRadius: 20,
  },
  TextTarget: { fontSize: 12, color: "#000000ff", fontWeight: "400" },
  ChartLineContainerinner: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
  },
  containerCategories: { paddingHorizontal: widthScreen * 0.05, marginTop: 0 },
  TextCategoies: {
    color: "#1A46BE",
    marginLeft: widthScreen * 0.024,
    marginBottom: 15,
    fontWeight: "500",
    fontSize: 16,
  },
  innerContainerCatgories: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  categoryItemContainer: { alignItems: "center", width: widthScreen * 0.2 },
  containerButton: {
    width: widthScreen * 0.16,
    height: heightScreen * 0.078,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.15,
    elevation: 5,
  },
  IconCatgories: {
    width: widthScreen * 0.1,
    height: heightScreen * 0.047,
    alignSelf: "center",
    resizeMode: "contain",
  },
  categoryText: {
    marginTop: 8,
    fontSize: widthScreen * 0.03,
    color: "#1A46BE",
    fontWeight: "400",
    textAlign: "center",
  },
  loadingHeaderContainer: {
    height: heightScreen * 0.28,
    width: widthScreen,
    borderBottomLeftRadius: widthScreen * 0.05,
    borderBottomRightRadius: widthScreen * 0.05,
    backgroundColor: "#EBEBEB",
    marginBottom: 20,
  },
  loadingLinearGradient: {
    flex: 1,
    borderBottomLeftRadius: widthScreen * 0.05,
    borderBottomRightRadius: widthScreen * 0.05,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  loadingHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loadingImageContainer: {
    width: widthScreen * 0.15,
    height: widthScreen * 0.15,
    borderRadius: widthScreen * 0.075,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImage: {
    width: widthScreen * 0.12,
    height: widthScreen * 0.12,
    borderRadius: widthScreen * 0.06,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  loadingTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  loadingWelcomeText: {
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 10,
    width: '90%',
  },
  loadingNotificationContainer: {
    position: 'relative',
  },
  loadingNotificationIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  loadingNotificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF6B6B',
  },
  
  loadingPieChartContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  loadingPieChartInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loadingPieChart: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  loadingPieChartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  loadingPieChartTitle: {
    height: 18,
    backgroundColor: '#e0e0e0',
    borderRadius: 9,
    width: '60%',
  },
  loadingPieChartArrow: {
    width: 20,
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginLeft: 10,
  },
  loadingPieChartContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    position: 'relative',
  },
  loadingPieChartCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  loadingPieChartCenterText: {
    position: 'absolute',
    width: 30,
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  loadingDropdownContainer: {
    width: 80,
  },
  loadingDropdownButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  loadingDropdownText: {
    height: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    width: '60%',
  },
  loadingDropdownArrow: {
    width: 12,
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
  },
  
  loadingLineChartContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  loadingLineChartInner: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  loadingLineChartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  loadingLineChartTitle: {
    height: 18,
    backgroundColor: '#e0e0e0',
    borderRadius: 9,
    width: '50%',
  },
  loadingLineChartArrow: {
    width: 20,
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginLeft: 10,
  },
  loadingLegendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  loadingLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingLegendLine: {
    width: 20,
    height: 3,
    backgroundColor: '#2F5ED8',
    borderRadius: 2,
    marginRight: 8,
  },
  loadingLegendText: {
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 7,
    width: 60,
  },
  loadingLineChartContent: {
    height: 120,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 10,
  },
  loadingLineChartGraph: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  
  loadingCategoriesContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  loadingCategoriesTitle: {
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    width: '40%',
    marginBottom: 15,
  },
  loadingCategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  loadingCategoryItem: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 15,
  },
  loadingCategoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    marginBottom: 8,
  },
  loadingCategoryText: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    width: '80%',
  },
});

export default HomePage;
