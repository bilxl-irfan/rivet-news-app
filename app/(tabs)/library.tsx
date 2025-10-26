import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Article from '../../src/components/Article';
import { useStorage } from '../../src/context/StorageContext';

type TabType = 'saved' | 'history';

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('saved');
  const { savedArticles, historyArticles, clearHistory } = useStorage();

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all reading history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => clearHistory()
        }
      ]
    );
  };

  const renderEmptyState = () => {
    if (activeTab === 'saved') {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={64} color="#666" />
          <Text style={styles.emptyText}>No saved articles</Text>
          <Text style={styles.emptySubtext}>Bookmark articles to read later</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={64} color="#666" />
          <Text style={styles.emptyText}>No reading history</Text>
          <Text style={styles.emptySubtext}>Articles you read will appear here</Text>
        </View>
      );
    }
  };

  const articles = activeTab === 'saved' ? savedArticles : historyArticles;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/rivet-logo.png')}
          style={styles.logo}
          contentFit="contain"
        />
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
          onPress={() => setActiveTab('saved')}
        >
          <Ionicons 
            name={activeTab === 'saved' ? 'bookmark' : 'bookmark-outline'} 
            size={20} 
            color={activeTab === 'saved' ? '#4A9EAF' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>
            Saved
          </Text>
          {savedArticles.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{savedArticles.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Ionicons 
            name={activeTab === 'history' ? 'time' : 'time-outline'} 
            size={20} 
            color={activeTab === 'history' ? '#4A9EAF' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History
          </Text>
          {historyArticles.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{historyArticles.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Clear History Button (only show in history tab) */}
      {activeTab === 'history' && historyArticles.length > 0 && (
        <View style={styles.clearContainer}>
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClearHistory}
          >
            <Ionicons name="trash-outline" size={16} color="#FF6B6B" />
            <Text style={styles.clearText}>Clear History</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Articles List */}
      {articles.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={articles}
          renderItem={({ item }) => <Article article={item} />}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingTop: 15,
    gap: 10,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeTab: {
    backgroundColor: colors.surfaceLight,
    borderColor: colors.primary,
  },
  tabText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: colors.primary,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  clearContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    alignSelf: 'flex-end',
  },
  clearText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtext: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  listContent: {
    padding: 10,
  },
});
