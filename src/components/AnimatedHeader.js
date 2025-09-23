

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Feather from 'react-native-vector-icons/Feather';


const Star = ({ size, position, duration }) => {
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacityAnim, { toValue: 1, duration: duration * 0.5, useNativeDriver: true }),
                Animated.timing(opacityAnim, { toValue: 0, duration: duration * 0.5, useNativeDriver: true }),
            ])
        );
        const delay = setTimeout(() => animation.start(), Math.random() * duration);
        return () => {
            clearTimeout(delay);
            animation.stop();
        };
    }, [duration, opacityAnim]);

    return <Animated.View style={[styles.star, { width: size, height: size, left: position.x, top: position.y, opacity: opacityAnim }]} />;
};

const StarsAnimation = () => (
    <>
        {[
            { size: 2, position: { x: "15%", y: "20%" }, duration: 2000 },
            { size: 1, position: { x: "25%", y: "60%" }, duration: 3000 },
            { size: 2, position: { x: "80%", y: "30%" }, duration: 2500 },
            { size: 1.5, position: { x: "90%", y: "75%" }, duration: 1800 },
            { size: 1, position: { x: "50%", y: "50%" }, duration: 2200 },
            { size: 1.5, position: { x: "5%", y: "80%" }, duration: 2800 },
        ].map((star, index) => (
            <Star key={index} {...star} />
        ))}
    </>
);

const AnimatedHeader = ({ title, onBackPress, showStars = true }) => {
    return (
        <View style={styles.headerContainer}>
           
            <BlurView style={styles.blurView} blurType="light" blurAmount={5} />
            <View style={styles.overlay} />
            {showStars && <StarsAnimation />}

           
            <View style={styles.headerContent}>
                {onBackPress ? (
                    <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
                        <Feather name="chevron-left" size={28} color="#FFF" />
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 40 }} /> 
                )}

                <Text style={styles.headerTitle}>{title}</Text>

                <View style={{ width: 40 }} /> 
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        height: 60,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        overflow: 'hidden', 
        backgroundColor: '#39a5e4', 
    },
    blurView: {
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#39a5e4',
    },
    star: {
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 5,
    },
    headerContent: {
        zIndex: 2, 
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: 10, 
    },
    backButton: {
        padding: 5,
        width: 40, 
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
});

export default AnimatedHeader;
