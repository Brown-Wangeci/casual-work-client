import { FlatList, StyleSheet, Text } from 'react-native'
import { useEffect, useState } from 'react'
import CustomHeader from '@/components/layout/CustomHeader'
import ContentWrapper from '@/components/layout/ContentWrapper'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { moderateScale } from 'react-native-size-matters'
import TaskFeedCard from '@/components/screens/task-feed/TaskFeedCard'
import ScreenBackground from '@/components/layout/ScreenBackground'
import api from '@/lib/axios'
import { extractErrorMessage, logError } from '@/lib/utils'
import Loading from '@/components/common/Loading'
import { View } from 'react-native'
import { useTaskFeedStore } from '@/stores/taskFeedStore'
import colors from '@/constants/Colors'

const TaskFeedScreen = () => {

  const tasks = useTaskFeedStore((state) => state.tasks)
  const setTasks = useTaskFeedStore((state) => state.setTasks)
  const [ isLoading, setIsLoading ] = useState<boolean>(true)
  const [ error, setError ] = useState<string | null>(null)
  const [ isRefreshing, setIsRefreshing ] = useState(false)

  // Fetch tasks from API
  const fetchTasks = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/tasks?status=PENDING')
      console.log('Fetched tasks:', response.data.tasks)
      setTasks(response.data.tasks)
      setError(null)
      } catch (error) {
        logError(error, 'TaskFeedScreen fetchTasks')
        const message = extractErrorMessage(error)
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

  // onRefresh function to refresh tasks
  const onRefresh = async () => {
    setIsRefreshing(true)
    try {
      await fetchTasks() // Re-fetch tasks
    } catch (error) {
      setError('Failed to refresh tasks')
    } finally {
      setIsRefreshing(false)
    }
  }

  // Call fetchTasks when the component mounts
  useEffect(() => {
    fetchTasks()
  }, [])



  return (
    <ScreenBackground>
      <CustomHeader title='Available Tasks' />
        <ContentWrapper style={styles.container}>
          { isLoading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Loading message='Loading task feed' />
            </View>
            ) : error ? (
            <Text style={{ fontSize: moderateScale(16), color: colors.text.light }}>Error: {error}</Text>
            ) : tasks && tasks.length > 0 ? (
              <FlatList
                data={tasks}
                renderItem={({ item }) => <TaskFeedCard task={item} />}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ gap: moderateScale(20, 0.2) }}
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <Text style={{ fontSize: moderateScale(16), color: '#888' }}>No tasks available</Text>
            )}
        </ContentWrapper>
    </ScreenBackground>
  )
}

export default TaskFeedScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: hp('3%'),
    alignSelf: 'center',
  },
})