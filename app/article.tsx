import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Alert, Animated, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useStorage } from '../src/context/StorageContext';

export default function ArticleScreen() {
  const { url, title } = useLocalSearchParams<{ url: string; title: string }>();
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const { addToHistory } = useStorage();

  useEffect(() => {
    // Pulsing animation for loading text
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Add to history when article is viewed
  useEffect(() => {
    if (url && title) {
      addToHistory({
        title: title as string,
        url: url as string,
        description: '',
        urlToImage: '',
        publishedAt: new Date().toISOString(),
        source: { name: '' }
      });
    }
  }, [url, title]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${title}\n\nRead on Rivet: ${url}`,
        url: url as string,
        title: title as string,
      });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* WebView showing the article */}
        <WebView
          source={{ uri: url as string }}
          style={styles.webview}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4A9EAF" />
              <Animated.Text 
                style={[
                  styles.loadingText,
                  { transform: [{ scale: pulseAnim }] }
                ]}
              >
                Loading article...
              </Animated.Text>
              <View style={styles.dotsContainer}>
                <Text style={styles.dots}>•</Text>
                <Text style={[styles.dots, { opacity: 0.6 }]}>•</Text>
                <Text style={[styles.dots, { opacity: 0.3 }]}>•</Text>
              </View>
            </View>
          )}
        />

        {/* Floating Share Button */}
        <TouchableOpacity 
          style={styles.floatingShareButton}
          onPress={handleShare}
        >
          <Ionicons name="share-social" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    paddingRight: 15,
  },
  backButtonText: {
    color: '#4A9EAF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  webview: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 5,
  },
  dots: {
    color: '#4A9EAF',
    fontSize: 30,
  },
  floatingShareButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A9EAF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
