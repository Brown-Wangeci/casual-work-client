import { StyleSheet } from 'react-native'
import { Tabs } from 'expo-router'
import colors from '@/constants/Colors'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Ionicons } from '@expo/vector-icons'

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
          tabBarStyle: {
              backgroundColor: colors.bg,
              borderTopColor: colors.component.stroke,
              borderTopWidth: 0.5,
              alignItems: 'center',
              justifyContent: 'center',
              height: hp('8%'),
          },
          tabBarActiveTintColor: colors.tabIconSelected,
          tabBarInactiveTintColor: colors.tabIconDefault,
          headerShown: false,
          tabBarLabelStyle: {
              fontFamily: 'poppins-medium',
              fontSize: 12,
          },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="post-task"
        options={{
          title: 'Post Task',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "add-circle" : "add-circle-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="task-feed"
        options={{
          title: 'Task Feed',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "list" : "list-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
          ),
        }}
      />

    </Tabs>
  )
}

export default TabsLayout

const styles = StyleSheet.create({})