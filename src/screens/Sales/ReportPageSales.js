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
import React, { useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";
import Constants from "../../config/globalConstants";
import LoadingScreen from "../../components/LoadingScreen";
import LinearGradient from "react-native-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { PieChart, LineChart } from "react-native-chart-kit";
import { useTranslation } from "react-i18next";

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;
const getCityAreaEndpoint = Constants.users.cityArea;

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

const ReportPageSales = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { role, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedPieFilter, setSelectedPieFilter] = useState("Daily");
  const [showPieOptions, setShowPieOptions] = useState(false);

  const [selectedLineFilter, setSelectedLineFilter] = useState("Daily");
  const [showLineOptions, setShowLineOptions] = useState(false);

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
    onclick: () => {navigation.navigate('Test')},
  },
  {
    id: 2,
    key: "monthlyPlan",
    image: require("../../../assets/icons/monthly-plan.png"),
    pressedColor: "#183E9F",
    onclick: () => {navigation.navigate('SplashScreen')},
  },
  {
    id: 3,
    key: "visitReport",
    image: require("../../../assets/icons/visit.png"),
    pressedColor: "#183E9F",
     onclick: () => {navigation.navigate('MedicalReportScreen')},
  },
  {
    id: 4,
    key: "sales",
    image: require("../../../assets/icons/online-store.png"),
    pressedColor: "#183E9F",
     onclick: () => {navigation.navigate('DailySales')},
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
                  onPress={() => navigation.goBack()}
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
                <Text style={Styles.TextNameUser}>{t("homeScreen.userName")}</Text>
              </View>
              <View style={Styles.containerNotification}>
                <TouchableOpacity
                  onPress={() =>
                    console.log(widthScreen + " ========= " + heightScreen)
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
                <Text style={Styles.chartTitle}>{t("homeScreen.detail")}</Text>
                <FontAwesome
                  name="angle-right"
                  size={widthScreen * 0.06}
                  color="#2085BC"
                  style={{ marginLeft: widthScreen * 0.02 }}
                />
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
                  {t(`homeScreen.${category.key}`)}
                </Text>
              </View>
            ))}
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
    // <-- تعديل: استخدم 'start' بدلاً من 'left'
    start: widthScreen * 0.194,
  },
  // numberPercentAchieved: {
  //   fontSize: widthScreen * 0.02,
  //   color: "#ff0505ff",
  //   top: heightScreen * 0.1,
  //   position: "absolute",
  //   // <-- تعديل: استخدم 'start' بدلاً من 'left'
  //   start: widthScreen * 0.19,
  // },
  // numberPercentRemaining: {
  //   fontSize: widthScreen * 0.02,
  //   color: "#f50000ff",
  //   top: heightScreen * 0.115,
  //   position: "absolute",
  //   // <-- تعديل: استخدم 'start' بدلاً من 'left'
  //   start: widthScreen * 0.38,
  // },
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
    // <-- تعديل: استخدم 'marginEnd' بدلاً من 'marginRight'
    marginEnd: widthScreen * 0.02,
    marginTop: heightScreen * 0.032,
  },
  legendText: {
    fontSize: widthScreen * 0.035,
    color: "#000000ff",
    fontWeight: "400",
    // <-- تعديل: لضمان محاذاة النص بشكل صحيح في RTL
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
    position: 'absolute', // <-- تعديل: أضفت position absolute
    // <-- تعديل: استخدم 'start' بدلاً من 'left'
    start: widthScreen * 0.33,
    top: heightScreen * 0.01,
    marginBottom: heightScreen * 0.04,
    alignItems: 'center', // <-- تعديل: لمحاذاة الأيقونة مع النص
  },
  dropdownContainer: {
    position: "relative",
    // <-- تعديل: استخدم 'flex-start' ليعمل في كلا الاتجاهين
    alignItems: "flex-start",
    marginTop: heightScreen * 0.02,
    // <-- تعديل: استخدم 'marginStart' بدلاً من 'marginLeft'
    marginStart: widthScreen * 0.04,
    zIndex: 1000,
  },
  dropdownButton: {
    // <-- تعديل: استخدم I18nManager لتحديد اتجاه الأيقونة والنص
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
    // <-- تعديل: لضمان محاذاة النص بشكل صحيح
    textAlign: 'left',
  },
  dropdownMenu: {
    position: "absolute",
    top: heightScreen * 0.06,
    // <-- تعديل: استخدم 'start' بدلاً من 'left'
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
    // <-- تعديل: لضمان محاذاة النص بشكل صحيح
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
    marginBottom: 20,
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
  containerCategories: { paddingHorizontal: widthScreen * 0.05, marginTop: 10 },
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
});

export default ReportPageSales;
