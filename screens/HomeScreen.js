import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Animated,
} from "react-native";
import { COLORS, FONTS, SIZES, icons } from "../constants";

const data = require("../constants/categories.json");
const confirmStatus = "C";
const pendingStatus = "P";

const getIcon = (iconName) => {
  switch (iconName) {
    case "education":
      return icons.education;
    case "food":
      return icons.food;
    case "baby_car":
      return icons.baby_car;
    case "healthcare":
      return icons.healthcare;
    case "sports_icon":
      return icons.sports_icon;
    case "cloth_icon":
      return icons.cloth_icon;
  }
};

const getColor = (colorName) => {
  switch (colorName) {
    case "yellow":
      return COLORS.yellow;
    case "lightBlue":
      return COLORS.lightBlue;
    case "darkgreen":
      return COLORS.darkgreen;
    case "peach":
      return COLORS.peach;
    case "purple":
      return COLORS.purple;
    case "red":
      return COLORS.red;
  }
};

const categoriesData = data.map((item) => {
  const rs = { ...item };
  rs.icon = getIcon(item.icon);
  rs.color = getColor(item.color);
  rs.expenses = item.expenses.map((ex) => {
    const rss = { ...ex };
    rss.status = ex.status == "confirmStatus" ? confirmStatus : pendingStatus;
    return rss;
  });
  return rs;
});

const HomeScreen = () => {
  // Dummy Date

  const categoryListHeightAnimationValue = React.useRef(
    new Animated.Value(45)
  ).current;

  const [viewMode, setViewMode] = React.useState("list");
  const [categories, setCategories] = React.useState(categoriesData);
  const [selectedCategory, setSelectedCategory] = React.useState(
    categoriesData[0]
  );
  const [showMoreToggle, setShowMoreToggle] = React.useState(false);

  const renderNavBar = () => {
    return (
      <View style={styles.navbarContainer}>
        <TouchableOpacity
          style={styles.navbuttonLeft}
          onPress={() => console.log("Back")}
        >
          <Image source={icons.back_arrow} style={styles.navbarLeft} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navbuttonRight}
          onPress={() => console.log("More")}
        >
          <Image source={icons.more} style={styles.navbarRight} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.headerTitle}>Xin chào, sinh viên EPU</Text>
          <Text style={styles.headerPivacy}>Mã sinh viên: 01180004</Text>
        </View>

        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <Image source={icons.calendar} style={styles.headerIcon} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.contentDate}>11 Nov, 2021</Text>
            <Text style={styles.contentSumary}>18% more than last month</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderCategoryHeaderSection = () => {
    return (
      <View style={styles.categoryContainer}>
        {/* Title */}
        <View>
          <Text style={styles.categoryTitle}>CATEGORIES</Text>
          <Text style={styles.categoryTotal}>{categories.length} Total</Text>
        </View>

        {/* Buttons */}
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={[
              styles.categoryIconContainer,
              viewMode === "chart" ? { backgroundColor: COLORS.secondary } : {},
            ]}
            onPress={() => setViewMode("chart")}
          >
            <Image
              source={icons.chart}
              style={[
                styles.categoryIcon,
                viewMode === "chart"
                  ? { tintColor: COLORS.white }
                  : { tintColor: COLORS.darkgray },
              ]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.categoryIconContainer,
              viewMode == "list" ? { backgroundColor: COLORS.secondary } : {},
            ]}
            onPress={() => setViewMode("list")}
          >
            <Image
              source={icons.menu}
              style={[
                styles.categoryIcon,
                viewMode === "list"
                  ? { tintColor: COLORS.white }
                  : { tintColor: COLORS.darkgray },
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCategoryList = () => {
    const renderItem = ({ item, index }) => {
      return (
        <TouchableOpacity
          style={[styles.categoryItem, styles.shadow]}
          onPress={() => setSelectedCategory(item)}
        >
          <Image
            source={item.icon}
            style={[styles.categoryItemIcon, { tintColor: item.color }]}
          />
          <Text style={styles.categoryItemName}>{item.name}</Text>
        </TouchableOpacity>
      );
    };
    return (
      <View style={{ paddingHorizontal: SIZES.padding - 5 }}>
        <Animated.View style={{ height: categoryListHeightAnimationValue }}>
          <FlatList
            data={categories}
            renderItem={renderItem}
            keyExtractor={(item) => `${item.id}`}
            numColumns={2}
            scrollEnabled={false}
          />
        </Animated.View>
        <TouchableOpacity
          style={styles.categoryViewMore}
          onPress={() => {
            if (showMoreToggle) {
              Animated.timing(categoryListHeightAnimationValue, {
                toValue: 45,
                duration: 300,
                useNativeDriver: false,
              }).start();
            } else {
              Animated.timing(categoryListHeightAnimationValue, {
                toValue: 140,
                duration: 300,
                useNativeDriver: false,
              }).start();
            }

            setShowMoreToggle(!showMoreToggle);
          }}
        >
          <Text style={styles.categoryViewMoreText}>
            {showMoreToggle ? "LESS" : "MORE"}
          </Text>
          <Image
            source={showMoreToggle ? icons.up_arrow : icons.down_arrow}
            style={styles.categoryViewMoreIcon}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderIncomingExpensesTitle = () => {
    let allExpenses = selectedCategory.expenses;
    // Filter pending expenses
    let incomingExpenses = allExpenses.filter(
      (item) => item.status == "P"
    );
    return (
      <View style={styles.incomingTitleContainer}>
        <Text style={styles.incomingTitle}>INCOMING EXPENSES</Text>
        <Text style={styles.incomingTotal}>
          {incomingExpenses.length} Total
        </Text>
      </View>
    );
  };

  const renderIncomingExpenses = () => {
    let allExpenses = selectedCategory.expenses;
    // Filter pending expenses
    let incomingExpenses = allExpenses.filter(
      (item) => item.status == "P"
    );
    const renderItem = ({ item, index }) => {
      return (
        <View
          style={[
            styles.expenseContainer,
            styles.shadow,
            index == 0 ? { marginLeft: SIZES.padding } : {},
          ]}
        >
          <View style={styles.expenseBody}>
            <View style={styles.expenseItem}>
              <Image
                source={selectedCategory.icon}
                style={[
                  styles.expenseIcon,
                  { tintColor: selectedCategory.color },
                ]}
              />
            </View>
            <Text
              style={[styles.expenseTitle, { color: selectedCategory.color }]}
            >
              {selectedCategory.name}
            </Text>
            {/* Expenses Description */}
          </View>
          <View style={{ paddingHorizontal: SIZES.padding }}>
            {/* Title and description */}
            <Text style={styles.expsenseItemTitle}>{item.title}</Text>
            <Text style={styles.expsenseItemDescription}>
              {item.description}
            </Text>

            {/* Location */}
            <Text style={styles.expenseLocationTitle}>Location</Text>
            <View style={{ flexDirection: "row" }}>
              <Image source={icons.pin} style={styles.expenseLocationIcon} />
              <Text style={styles.expenseLocation}>{item.location}</Text>
            </View>
          </View>
          {/* Price */}
          <View
            style={[
              styles.expensePriceContainer,
              { backgroundColor: selectedCategory.color },
            ]}
          >
            <Text style={styles.expensePriceTitle}>
              CONFIRM {item.total.toFixed(2)} USD
            </Text>
          </View>
        </View>
      );
    };

    return (
      <View>
        {renderIncomingExpensesTitle()}
        {incomingExpenses.length > 0 && (
          <FlatList
            data={incomingExpenses}
            renderItem={renderItem}
            keyExtractor={(item) => `${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        )}
        {incomingExpenses.length === 0 && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 250,
            }}
          >
            <Text style={{ color: COLORS.primary, ...FONTS.h3 }}>
              No Record
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Navbar section */}
      {renderNavBar()}
      {/* Header section */}
      {renderHeader()}
      {/* Category Header Section */}
      {renderCategoryHeaderSection()}

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {viewMode == "list" && (
          <View>
            {renderCategoryList()}
            {renderIncomingExpenses()}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray2,
  },
  /* navbar */
  navbarContainer: {
    flexDirection: "row",
    marginTop: 10,
    // height: 50,
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: SIZES.padding,
    backgroundColor: COLORS.white,
  },
  navbuttonLeft: {
    justifyContent: "center",
    width: 50,
  },
  navbarLeft: {
    width: 20,
    height: 20,
    tintColor: COLORS.primary,
  },
  navbuttonRight: {
    justifyContent: "center",
    width: 50,
    alignItems: "flex-end",
  },
  navbarRight: {
    width: 20,
    height: 20,
    tintColor: COLORS.primary,
  },
  /* header */
  headerContainer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    color: COLORS.primary,
    ...FONTS.h2,
  },
  headerPivacy: {
    color: COLORS.darkgray,
    ...FONTS.h3,
  },
  headerContent: {
    flexDirection: "row",
    marginTop: SIZES.padding,
    alignItems: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.lightGray,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: SIZES.padding,
  },
  headerIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.lightBlue,
  },
  contentDate: {
    color: COLORS.primary,
    ...FONTS.h3,
  },
  contentSumary: {
    color: COLORS.darkgray,
    ...FONTS.body3,
  },
  /* category */
  categoryContainer: {
    flexDirection: "row",
    padding: SIZES.padding,
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    width: 30,
    // backgroundColor: COLORS.secondary,
    borderRadius: 15,
  },
  categoryIcon: {
    width: 11,
    height: 11,
  },
  categoryTitle: {
    color: COLORS.primary,
    ...FONTS.h3,
  },
  categoryTotal: {
    color: COLORS.darkgray,
    ...FONTS.body4,
  },
  categoryItem: {
    flex: 1,
    flexDirection: "row",
    margin: 5,
    paddingVertical: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    borderRadius: 5,
    backgroundColor: COLORS.white,
    alignItems: "center",
  },
  categoryItemIcon: {
    width: 20,
    height: 20,
  },
  categoryItemName: {
    marginLeft: SIZES.base,
    color: COLORS.primary,
    ...FONTS.h4,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 3,
  },
  categoryViewMore: {
    flexDirection: "row",
    marginTop: SIZES.base,
    justifyContent: "center",
  },
  categoryViewMoreText: {
    ...FONTS.body4,
  },
  categoryViewMoreIcon: {
    marginLeft: 5,
    width: 12,
    height: 12,
    alignSelf: "center",
  },
  incomingTitleContainer: {
    padding: SIZES.padding,
    backgroundColor: COLORS.lightGray2,
  },
  incomingTitle: {
    ...FONTS.h3,
    color: COLORS.primary,
  },
  incomingTotal: {
    ...FONTS.body4,
    color: COLORS.darkgray,
  },
  expenseContainer: {
    width: 280,
    marginRight: SIZES.padding,
    marginVertical: SIZES.radius,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white,
  },
  expenseBody: {
    flexDirection: "row",
    padding: SIZES.padding,
    alignItems: "center",
  },
  expenseItem: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: COLORS.lightGray,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SIZES.base,
  },
  expenseIcon: {
    width: 26,
    height: 26,
  },
  expenseTitle: {
    ...FONTS.h4,
  },
  expsenseItemTitle: {
    ...FONTS.h3,
  },
  expsenseItemDescription: {
    ...FONTS.body4,
    flexWrap: "wrap",
    color: COLORS.darkgray,
  },
  expenseLocationTitle: {
    marginTop: SIZES.padding,
    ...FONTS.h5,
  },
  expenseLocationIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.darkgray,
    marginRight: 5,
  },
  expenseLocation: {
    marginBottom: SIZES.padding,
    color: COLORS.darkgray,
    ...FONTS.body5,
  },
  expensePriceContainer: {
    height: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderBottomStartRadius: SIZES.radius,
    borderBottomEndRadius: SIZES.radius,
  },
  expensePriceTitle: {
    color: COLORS.white,
    ...FONTS.body4,
  },
});

export default HomeScreen;
