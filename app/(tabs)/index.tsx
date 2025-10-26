import { Image } from 'expo-image';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Article from '../../src/components/Article';
import CategoryFilter from '../../src/components/CategoryFilter';
import { getNews } from '../../src/news';
import LoadingScreen from '../components/LoadingScreen';

interface ArticleType {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export default function Index() {
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const contentFadeAnim = useRef(new Animated.Value(1)).current;
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const loadingFadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fetchNews('all');
  }, []);

  const fetchNews = async (category: string) => {
    try {
      const minLoadingTime = isLoading ? 2500 : 0; // Only delay on initial load
      const startTime = Date.now();
      
      const newsArticles = await getNews(category);
      
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      
      setTimeout(() => {
        setArticles(newsArticles);
        
        if (isLoading) {
          // Trigger transition animations only on initial load
          Animated.parallel([
            Animated.timing(loadingFadeAnim, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setIsLoading(false);
            setRefreshing(false);
          });
        } else {
          setRefreshing(false);
        }
      }, remainingTime);
      
    } catch (error) {
      console.error('Failed to fetch news:', error);
      setTimeout(() => {
        if (isLoading) {
          Animated.parallel([
            Animated.timing(loadingFadeAnim, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setIsLoading(false);
            setRefreshing(false);
          });
        } else {
          setRefreshing(false);
        }
      }, isLoading ? 2500 : 0);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNews(selectedCategory);
  };

  const handleCategoryChange = async (category: string) => {
  if (category === selectedCategory) return;
  
  // Fade out current content
  Animated.timing(contentFadeAnim, {
    toValue: 0,
    duration: 200,
    useNativeDriver: true,
  }).start(async () => {
    // Clear old articles immediately after fade out
    setArticles([]);
    setSelectedCategory(category);
    setRefreshing(true);
    
    // Fetch new data
    try {
      const newsArticles = await getNews(category);
      setArticles(newsArticles);
      setRefreshing(false);
      
      // Fade in new content
      Animated.timing(contentFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error('Failed to fetch news:', error);
      setRefreshing(false);
      
      // Still fade in even on error
      Animated.timing(contentFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  });
};



  return (
    <View style={{ flex: 1 }}>
      {/* Main Content - Fades in */}
      <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim }]}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Image 
              source={require('../../assets/images/rivet-logo.png')} 
              style={styles.logo}
              contentFit="contain"
            />
          </View>
          
          {/* Category Filter */}
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
          />
          
          <Animated.View style={{ flex: 1, opacity: contentFadeAnim }}>
  <FlatList
    data={articles}
    renderItem={({ item }) => <Article article={item} />}
    keyExtractor={(item, index) => index.toString()}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
    }
    contentContainerStyle={styles.listContent}
  />
</Animated.View>
        </SafeAreaView>
      </Animated.View>

      {/* Loading Screen - Fades out */}
      {isLoading && (
        <Animated.View 
          style={[
            styles.loadingContainer,
            { opacity: loadingFadeAnim }
          ]}
        >
          <LoadingScreen />
        </Animated.View>
      )}
    </View>
  );
}

const colors = {
  background: '#121212',
  surface: '#1E1E1E',
  surfaceLight: '#2A2A2A',
  primary: '#4A9EAF',
  primaryLight: '#6CBFCE',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  border: '#333333',
  gold: '#C5A572',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.background,
    paddingVertical: 25,
    paddingHorizontal: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: {
    width: 180,
    height: 70,
  },
  listContent: {
    padding: 10,
    paddingBottom: 20,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
});
