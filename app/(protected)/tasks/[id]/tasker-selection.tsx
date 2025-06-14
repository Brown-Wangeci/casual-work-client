import { FlatList, StyleSheet, Text } from 'react-native'
import { useEffect, useState } from 'react'
import ScreenWrapper from '@/components/layout/ScreenWrapper'
import CustomHeader from '@/components/layout/CustomHeader'
import ContentWrapper from '@/components/layout/ContentWrapper'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { moderateScale } from 'react-native-size-matters'
import { User } from '@/constants/Types'
import axios from 'axios'
import colors from '@/constants/Colors'
import TaskFeedCard from '@/components/screens/task-feed/TaskFeedCard'
import TaskerSelectionProfileCard from '@/components/screens/tasker-selection/TaskerSelectionProfileCard'
import ScreenBackground from '@/components/layout/ScreenBackground'

const TaskerSelectionScreen = () => {

  const [ taskers, setTaskers ] = useState<User[] | null>(null)
  const [ isLoading, setIsLoading ] = useState<boolean>(true)
  const [ error, setError ] = useState<string | null>(null)
  const [ isRefreshing, setIsRefreshing ] = useState(false)

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  // Fetch tasker from API
  const fetchTaskers = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${apiUrl}/users?tasker=true`)
      setTaskers(response.data)
      setError(null)
      } catch (error) {
        setError('Failed to fetch available taskers')
      } finally {
        setIsLoading(false)
      }
    }

  // onRefresh function to refresh tasker
  const onRefresh = async () => {
    setIsRefreshing(true)
    try {
      await fetchTaskers() // Re-fetch tasker
    } catch (error) {
      setError('Failed to refresh available taskers')
    } finally {
      setIsRefreshing(false)
    }
  }

  // Call fetchTasker when the component mounts
  useEffect(() => {
    fetchTaskers()
  }, [])



  return (
    <ScreenBackground>
      <CustomHeader title='Tasker Selection' showBackButton />
        <ContentWrapper style={styles.container}>
          { isLoading ? (
            <Text style={{ fontSize: moderateScale(16), color: colors.infoText }}>Loading available taskers...</Text>
            ) : error ? (
            <Text style={{ fontSize: moderateScale(16), color: colors.progress.cancelled }}>Error: {error}</Text>
            ) : taskers && taskers.length > 0 ? (
              <FlatList
                data={taskers}
                renderItem={({ item }) => <TaskerSelectionProfileCard tasker={item} />}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ gap: moderateScale(20, 0.2) }}
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <Text style={{ fontSize: moderateScale(16), color: '#888' }}>No tasker available</Text>
            )}
        </ContentWrapper>
    </ScreenBackground>
  )
}

export default TaskerSelectionScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: hp('3%'),
    alignSelf: 'center',
  },
})