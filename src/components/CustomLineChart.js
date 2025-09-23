// // src/components/charts/LineChart.js
// import React from 'react';
// import { View, Text, StyleSheet, Dimensions } from 'react-native';
// import { LineChart } from 'react-native-chart-kit';
// import { colors, chartConfig } from '../../styles/colors';

// const screenWidth = Dimensions.get('window').width;

// const CustomLineChart = ({ data, title }) => {
//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>{title}</Text>
//         <View style={styles.legendContainer}>
//           <View style={styles.legendItem}>
//             <View style={[styles.legendLine, { backgroundColor: colors.primary }]} />
//             <Text style={styles.legendText}>Total Revenue</Text>
//           </View>
//           <View style={styles.legendItem}>
//             <View style={[styles.legendLine, { backgroundColor: colors.accent }]} />
//             <Text style={styles.legendText}>Total Orders</Text>
//           </View>
//         </View>
//       </View>
      
//       <LineChart
//         data={data}
//         width={screenWidth - 40}
//         height={220}
//         chartConfig={chartConfig}
//         bezier
//         style={styles.chart}
//         withDots={true}
//         withShadow={false}
//         withInnerLines={false}
//         withOuterLines={false}
//         withVerticalLines={false}
//         withHorizontalLines={false}
//       />
      
//       <View style={styles.valueContainer}>
//         <Text style={styles.valueText}>$2,493 VND</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: colors.cardBackground,
//     borderRadius: 16,
//     padding: 20,
//     marginVertical: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   header: {
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: colors.text,
//     marginBottom: 12,
//   },
//   legendContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   legendLine: {
//     width: 20,
//     height: 3,
//     borderRadius: 2,
//     marginRight: 8,
//   },
//   legendText: {
//     fontSize: 14,
//     color: colors.textSecondary,
//   },
//   chart: {
//     borderRadius: 16,
//   },
//   valueContainer: {
//     position: 'absolute',
//     top: 120,
//     left: 140,
//     backgroundColor: colors.primary,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 8,
//   },
//   valueText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: '600',
//   },
// });

// export default CustomLineChart;