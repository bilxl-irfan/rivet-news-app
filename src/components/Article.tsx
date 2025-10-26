import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import moment from 'moment';
import React from 'react';
import { Alert, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card, Divider } from 'react-native-paper';
import { useStorage } from '../context/StorageContext';

interface ArticleProps {
  article: {
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    source: {
      name: string;
    };
  };
}

const Article: React.FC<ArticleProps> = ({ article }) => {
  const { title, description, url, urlToImage, publishedAt, source } = article;
  const time = moment(publishedAt || moment.now()).fromNow();
  const defaultImg = 'https://via.placeholder.com/400x200?text=No+Image';
  const router = useRouter();
  const { saveArticle, unsaveArticle, isArticleSaved, addToHistory } = useStorage();

  const isSaved = isArticleSaved(url);

  // Calculate reading time based on description length
  const calculateReadingTime = () => {
    const descriptionLength = (description || '').length;
    
    let estimatedMinutes;
    if (descriptionLength < 100) {
      estimatedMinutes = 3;
    } else if (descriptionLength < 200) {
      estimatedMinutes = 5;
    } else {
      estimatedMinutes = 7;
    }
    
    return `${estimatedMinutes} min read`;
  };

  const readingTime = calculateReadingTime();

  const handlePress = () => {
    // Add to history when article is opened
    addToHistory(article);
    
    // @ts-ignore - Dynamic route
    router.push({
      pathname: '/article',
      params: { 
        url: url,
        title: title 
      }
    });
  };

  const handleBookmark = async (e: any) => {
    e.stopPropagation();
    if (isSaved) {
      await unsaveArticle(url);
    } else {
      await saveArticle(article);
    }
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `${title}\n\nRead on Rivet: ${url}`,
        url: url,
        title: title,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with:', result.activityType);
        } else {
          console.log('Article shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: urlToImage || defaultImg }} />
        <Card.Content>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description || 'No description available'}</Text>
          <Divider style={styles.divider} />
          <View style={styles.footer}>
            <View style={styles.leftFooter}>
              <Text style={styles.source}>{source.name.toUpperCase()}</Text>
              <Text style={styles.time}>{time} • {readingTime}</Text>
            </View>
            
            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              {/* Bookmark Button */}
              <TouchableOpacity 
                style={styles.bookmarkButton}
                onPress={handleBookmark}
              >
                <Ionicons 
                  name={isSaved ? "bookmark" : "bookmark-outline"} 
                  size={20} 
                  color={isSaved ? "#FFD700" : "#FFFFFF"} 
                />
              </TouchableOpacity>

              {/* Share Button */}
              <TouchableOpacity 
                style={styles.shareButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
              >
                <Ionicons name="share-social-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 14,
  },
  title: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 10,
  },
  divider: {
    backgroundColor: '#333333',
    marginVertical: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftFooter: {
    flex: 1,
  },
  source: {
    fontSize: 12,
    color: '#B0B0B0',
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    color: '#B0B0B0',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  bookmarkButton: {
    backgroundColor: '#1E1E1E',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  shareButton: {
    backgroundColor: '#4A9EAF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
});

export default Article;
