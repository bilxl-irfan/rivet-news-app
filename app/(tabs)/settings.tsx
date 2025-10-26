import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    Linking,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStorage } from '../../src/context/StorageContext';

export default function SettingsScreen() {
  const { clearHistory, savedArticles, historyArticles } = useStorage();
  const router = useRouter();

/**
 * Shows an alert to confirm clearing all data. If confirmed, clears all AsyncStorage data and forces a refresh by clearing the context.
 * This action cannot be undone.
 */
  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all saved articles, reading history, and search history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Success', 'All data has been cleared');
              // Force refresh by clearing context
              clearHistory();
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          }
        }
      ]
    );
  };

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  const SettingSection = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showChevron = true,
    danger = false 
  }: { 
    icon: string; 
    title: string; 
    subtitle?: string; 
    onPress?: () => void; 
    showChevron?: boolean;
    danger?: boolean;
  }) => (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.iconContainer, danger && styles.dangerIcon]}>
        <Ionicons name={icon as any} size={22} color={danger ? '#FF6B6B' : '#4A9EAF'} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, danger && styles.dangerText]}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color="#666" />
      )}
    </TouchableOpacity>
  );

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

      <ScrollView style={styles.scrollView}>
        {/* App Info Section */}
        <SettingSection title="App Information" />
        <View style={styles.section}>
          <SettingItem
            icon="information-circle-outline"
            title="Version"
            subtitle="1.0.0"
            showChevron={false}
          />
          <SettingItem
            icon="person-outline"
            title="Developer"
            subtitle="Built with Rivet"
            showChevron={false}
          />
        </View>

        {/* Data & Storage */}
        <SettingSection title="Data & Storage" />
        <View style={styles.section}>
          <SettingItem
            icon="bookmark-outline"
            title="Saved Articles"
            subtitle={`${savedArticles.length} articles saved`}
            showChevron={false}
          />
          <SettingItem
            icon="time-outline"
            title="Reading History"
            subtitle={`${historyArticles.length} articles in history`}
            showChevron={false}
          />
          <SettingItem
            icon="trash-outline"
            title="Clear All Data"
            subtitle="Delete all saved data and history"
            onPress={handleClearAllData}
            danger
          />
        </View>

        {/* Support & Legal */}
        <SettingSection title="Support & Legal" />
        <View style={styles.section}>
          <SettingItem
            icon="mail-outline"
            title="Contact Support"
            subtitle="Get help or send feedback"
            onPress={() => router.push('/contact' as any)}
          />
          <SettingItem
            icon="shield-checkmark-outline"
            title="Privacy Policy"
            onPress={() => Alert.alert('Privacy Policy', 'Your privacy matters. We do not collect or share your personal data.')}
          />
          <SettingItem
            icon="document-text-outline"
            title="Terms of Service"
            onPress={() => Alert.alert('Terms of Service', 'By using Rivet, you agree to use the app responsibly and in accordance with applicable laws.')}
          />
        </View>

        {/* About */}
        <SettingSection title="About" />
        <View style={styles.section}>
          <SettingItem
            icon="star-outline"
            title="Rate Rivet"
            subtitle="Enjoying the app? Leave us a review"
            onPress={() => Alert.alert('Rate Rivet', 'Thank you for your support! 🌟')}
          />
          <SettingItem
            icon="share-social-outline"
            title="Share Rivet"
            subtitle="Tell your friends about Rivet"
            onPress={async () => {
              try {
                await Share.share({
                  message: 'Check out Rivet - Your personalized news app! Stay informed with the latest headlines from around the world. Download now!',
                  title: 'Rivet News App',
                });
              } catch (error) {
                console.error('Error sharing:', error);
              }
            }}
          />
          <SettingItem
            icon="code-slash-outline"
            title="Open Source"
            subtitle="View on GitHub"
            onPress={() => handleOpenLink('https://github.com')}
          />
        </View>

        {/* Credits */}
        <View style={styles.credits}>
          <Text style={styles.creditsText}>Rivet News</Text>
          <Text style={styles.creditsSubtext}>Intelligent News Aggregation</Text>
          <Text style={styles.creditsSubtext}>Data provided by NewsAPI.org</Text>
          <Text style={styles.creditsSubtext}>© 2025 Rivet Technologies. All rights reserved.</Text>
        </View>
      </ScrollView>
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
  danger: '#FF6B6B',
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
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 10,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: colors.surface,
    marginHorizontal: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dangerIcon: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  dangerText: {
    color: colors.danger,
  },
  settingSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  credits: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  creditsText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  creditsSubtext: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
});
