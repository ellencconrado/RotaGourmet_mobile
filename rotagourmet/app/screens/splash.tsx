import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
    const router = useRouter();

    useEffect(() => {
        // Redireciona para o login após 3 segundos
        const timer = setTimeout(() => {
            router.replace("/screens/loginscreen");
        }, 3000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                {/* Logo Wheel/Compass */}
                <View style={styles.logoWheel}>
                    <View style={styles.wheelCenter}>
                        <View style={styles.wheelInner} />
                    </View>
                    <View style={[styles.wheelSegment, styles.segment1]} />
                    <View style={[styles.wheelSegment, styles.segment2]} />
                    <View style={[styles.wheelSegment, styles.segment3]} />
                    <View style={[styles.wheelSegment, styles.segment4]} />
                    <View style={[styles.wheelSegment, styles.segment5]} />
                    <View style={[styles.wheelSegment, styles.segment6]} />
                    <View style={[styles.wheelSegment, styles.segment7]} />
                    <View style={[styles.wheelSegment, styles.segment8]} />
                </View>

                {/* Nome da marca */}
                <Text style={styles.brandName}>ROTA GOURMET</Text>

                {/* Tagline */}
                <Text style={styles.tagline}>Sua experiência gastronômica, em um só lugar</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#0066CC",
    },
    logoContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    logoWheel: {
        width: 120,
        height: 120,
        position: "relative",
        marginBottom: 30,
    },
    wheelCenter: {
        position: "absolute",
        top: 50,
        left: 50,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#C65323",
        zIndex: 10,
    },
    wheelInner: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: "#8B4513",
        position: "absolute",
        top: 2,
        left: 2,
    },
    wheelSegment: {
        position: "absolute",
        width: 0,
        height: 0,
        borderLeftWidth: 15,
        borderRightWidth: 15,
        borderBottomWidth: 40,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "#FF4500",
        top: 60,
        left: 45,
    },
    segment1: { transform: [{ rotate: '0deg' }] },
    segment2: { transform: [{ rotate: '45deg' }] },
    segment3: { transform: [{ rotate: '90deg' }] },
    segment4: { transform: [{ rotate: '135deg' }] },
    segment5: { transform: [{ rotate: '180deg' }] },
    segment6: { transform: [{ rotate: '225deg' }] },
    segment7: { transform: [{ rotate: '270deg' }] },
    segment8: { transform: [{ rotate: '315deg' }] },
    brandName: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 10,
        fontFamily: "serif",
    },
    tagline: {
        fontSize: 16,
        color: "#333",
        textAlign: "center",
        maxWidth: width * 0.8,
        lineHeight: 22,
    },
});
