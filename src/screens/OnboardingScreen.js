import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, StatusBar, I18nManager } from 'react-native';
import Swiper from 'react-native-swiper';
import LottieView from 'lottie-react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

const lottieAnimations = [
    require('../../assets/lottiefiles/im3.json'),
    require('../../assets/lottiefiles/im1.json'),
    require('../../assets/lottiefiles/im2.json'),
];

const OnboardingScreen = ({navigation}) => {
    const { t } = useTranslation();
    const swiperRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const isRTL = I18nManager.isRTL;

    const handleNext = () => {
        if (currentIndex < lottieAnimations.length - 1) {
            swiperRef.current?.scrollBy(1);
        } else {
            navigation.navigate('SignIn');
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            swiperRef.current?.scrollBy(-1);
        }
    };

    const getSlideContent = (index) => {
        const slideKey = `slide${index + 1}`;
        return {
            title: t(`onboardingScreen.${slideKey}.title`),
            description: t(`onboardingScreen.${slideKey}.description`)
        };
    };

    const getButtonText = () => {
        return currentIndex === lottieAnimations.length - 1 
            ? t('onboardingScreen.startButton') 
            : t('onboardingScreen.nextButton');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={"#fff"} />
            <View style={styles.container}>
                <Swiper
                    ref={swiperRef}
                    style={styles.wrapper}
                    showsButtons={false}
                    loop={false}
                    onIndexChanged={(index) => setCurrentIndex(index)}
                    dot={<View style={styles.dot} />}
                    activeDot={<View style={styles.activeDot} />}
                    paginationStyle={styles.pagination}
                >
                    {lottieAnimations.map((animationSource, index) => {
                        const content = getSlideContent(index);
                        return (
                            <View style={styles.slide} key={index}>
                                <View style={styles.animationContainer}>
                                    <LottieView
                                        source={animationSource}
                                        autoPlay={true}
                                        loop={false}
                                        style={styles.lottieAnimation}
                                        resizeMode="contain"
                                    />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={[styles.title, isRTL && styles.rtlText]}>
                                        {content.title}
                                    </Text>
                                    <Text style={[styles.description, isRTL && styles.rtlText]}>
                                        {content.description}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </Swiper>

                <View style={[styles.navigationContainer, isRTL && styles.rtlNavigation]}>
                    <TouchableOpacity
                        style={[styles.navButton, styles.backButton, { opacity: currentIndex === 0 ? 0.5 : 1 }]}
                        onPress={handleBack}
                        disabled={currentIndex === 0}
                    >
                        <Icon 
                            name={"chevron-left"} 
                            size={16} 
                            color="#000000" 
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.navButton, styles.nextButton]} onPress={handleNext}>
                        <View style={[styles.nextButtonContent, isRTL && styles.rtlNextButton]}>
                            <Text style={[styles.nextButtonText, isRTL && styles.rtlText]}>
                                {getButtonText()}
                            </Text>
                            <Icon 
                                name={"chevron-right"} 
                                size={16} 
                                color="#fff" 
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: '#FFFFFF' 
    },
    container: { 
        flex: 1, 
        backgroundColor: '#FFFFFF' 
    },
    wrapper: {},
    slide: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
        paddingHorizontal: width * 0.05,
    },
    animationContainer: {
        flex: 0.6,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        maxHeight: height * 0.8,
    },
    lottieAnimation: { 
        width: Math.min(width * 0.9, height * 0.4),
        height: Math.min(width * 0.9, height * 0.4),
        maxWidth: 400,
        maxHeight: 400,
    },
    textContainer: {
        flex: 0.4,
        alignItems: 'center',
        paddingTop: height * 0.02,
        paddingHorizontal: width * 0.05,
    },
    title: { 
        fontSize: width < 375 ? 20 : width < 414 ? 22 : 24, 
        fontWeight: 'bold', 
        color: '#333333', 
        textAlign: 'center', 
        marginBottom: height * 0.015,
        lineHeight: width < 375 ? 26 : 30,
    },
    description: { 
        fontSize: width < 375 ? 14 : width < 414 ? 15 : 16, 
        color: '#666666', 
        textAlign: 'center', 
        lineHeight: width < 375 ? 20 : 24,
        paddingHorizontal: width * 0.02,
    },
    pagination: { 
        position: 'absolute',
        bottom: height * 0.15,
    },
    dot: { 
        backgroundColor: 'rgba(0,0,0,.2)', 
        width: 8, 
        height: 8, 
        borderRadius: 4, 
        marginHorizontal: 4 
    },
    activeDot: { 
        backgroundColor: '#4A90E2', 
        width: 12, 
        height: 8, 
        borderRadius: 4, 
        marginHorizontal: 4 
    },
    navigationContainer: { 
        position: 'absolute', 
        bottom: height * 0.05, 
        left: width * 0.05, 
        right: width * 0.05, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
    },
    navButton: { 
        borderRadius: 12, 
        height: height * 0.06,
        minHeight: 50,
        alignItems: 'center', 
        justifyContent: 'center',
    },
    backButton: { 
        backgroundColor: '#F0F0F0', 
        width: width * 0.15,
        minWidth: 60, 
    },
    nextButton: { 
        backgroundColor: '#183E9F', 
        flex: 1, 
        marginLeft: width * 0.025, 
    },
    nextButtonContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextButtonText: { 
        color: '#FFFFFF', 
        fontSize: width < 375 ? 16 : 18, 
        fontWeight: '600',
        marginHorizontal: 5,
    },
    rtlText: {
        textAlign: 'center',
    },
    rtlNavigation: {
        flexDirection: 'row-reverse',
    },
    rtlNextButton: {
        flexDirection: 'row-reverse',
    },
});

export default OnboardingScreen;