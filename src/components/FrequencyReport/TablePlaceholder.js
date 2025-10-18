import React from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";

const { width } = Dimensions.get('window');
const FIXED_COLUMN_WIDTH = width * 0.4;
const SCROLLABLE_COLUMN_WIDTH = 120;
const ROW_HEIGHT = 60;

const TablePlaceholder = () => {
  const shimmerAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const placeholderRows = [1, 2, 3, 4, 5];

  return (
    <View style={styles.container}>
      <View style={styles.tableWrapper}>
        {/* Fixed Column */}
        <View style={styles.fixedColumn}>
          {/* Header */}
          <View style={[styles.headerCell, styles.fixedHeaderCell]}>
            <Animated.View style={[styles.shimmer, { opacity }]} />
          </View>
          {/* Rows */}
          {placeholderRows.map((_, index) => (
            <View
              key={index}
              style={[
                styles.cell,
                styles.fixedCell,
                index % 2 === 1 ? styles.oddRow : styles.evenRow,
              ]}
            >
              <Animated.View style={[styles.shimmer, { opacity }]} />
            </View>
          ))}
        </View>

        {/* Scrollable Columns */}
        <View style={styles.scrollableColumns}>
          {/* Header */}
          <View style={[styles.headerRow, styles.scrollableHeaderRow]}>
            {[1, 2, 3].map((col) => (
              <View key={col} style={styles.scrollableHeaderCell}>
                <Animated.View style={[styles.shimmer, { opacity }]} />
              </View>
            ))}
          </View>
          {/* Rows */}
          {placeholderRows.map((_, index) => (
            <View
              key={index}
              style={[
                styles.scrollableRow,
                index % 2 === 1 ? styles.oddRow : styles.evenRow,
              ]}
            >
              {[1, 2, 3].map((col) => (
                <View key={col} style={styles.scrollableCell}>
                  <Animated.View style={[styles.shimmerSmall, { opacity }]} />
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: "hidden",
  },
  tableWrapper: {
    flexDirection: "row",
  },
  fixedColumn: {
    width: FIXED_COLUMN_WIDTH,
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
  },
  fixedHeaderCell: {
    height: ROW_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#F8F9FA",
  },
  fixedCell: {
    height: ROW_HEIGHT,
    justifyContent: "center",
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  scrollableColumns: {
    flex: 1,
  },
  scrollableHeaderRow: {
    flexDirection: "row",
    height: ROW_HEIGHT,
    borderBottomWidth: 2,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#F8F9FA",
  },
  scrollableHeaderCell: {
    width: SCROLLABLE_COLUMN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  scrollableRow: {
    flexDirection: "row",
    height: ROW_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  scrollableCell: {
    width: SCROLLABLE_COLUMN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  headerCell: {
    backgroundColor: "#F8F9FA",
  },
  headerRow: {
    backgroundColor: "#F8F9FA",
  },
  evenRow: {
    backgroundColor: "#F8F9FA",
  },
  oddRow: {
    backgroundColor: "#FFFFFF",
  },
  shimmer: {
    width: "80%",
    height: 16,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
  },
  shimmerSmall: {
    width: "60%",
    height: 14,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
  },
});

export default TablePlaceholder;
