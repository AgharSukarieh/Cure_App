import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

const Star = ({ size, position, duration }) => {
    const opacityAnim = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacityAnim, { toValue: 1, duration: duration * 0.5, useNativeDriver: true }),
                Animated.timing(opacityAnim, { toValue: 0, duration: duration * 0.5, useNativeDriver: true }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [duration, opacityAnim]);
    
    return (
        <Animated.View 
            style={[
                styles.star, 
                { 
                    width: size, 
                    height: size, 
                    left: position.x, 
                    top: position.y, 
                    opacity: opacityAnim 
                }
            ]} 
        />
    );
};

const Stars = React.memo(() => (
    <>
        {[
            { size: 2, position: { x: "15%", y: "20%" }, duration: 2000 },
            { size: 1, position: { x: "25%", y: "60%" }, duration: 3000 },
            { size: 2, position: { x: "80%", y: "30%" }, duration: 2500 },
            { size: 1.5, position: { x: "90%", y: "75%" }, duration: 1800 },
        ].map((star, index) => (
            <Star key={index} {...star} />
        ))}
    </>
));

const styles = StyleSheet.create({
    star: {
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 5
    }
});

export default Stars;

