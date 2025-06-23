import { FlatList, StyleSheet, Text } from 'react-native'
import { useEffect, useState } from 'react'
import CustomHeader from '@/components/layout/CustomHeader'
import ContentWrapper from '@/components/layout/ContentWrapper'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { moderateScale } from 'react-native-size-matters'
import { Task } from '@/constants/Types'
import colors from '@/constants/Colors'
import TaskFeedCard from '@/components/screens/task-feed/TaskFeedCard'
import ScreenBackground from '@/components/layout/ScreenBackground'
import api from '@/lib/axios'
// import axios from 'axios'

const TaskFeedScreen = () => {

  const [ tasks, setTasks ] = useState<Task[] | null>(null)
  const [ isLoading, setIsLoading ] = useState<boolean>(true)
  const [ error, setError ] = useState<string | null>(null)
  const [ isRefreshing, setIsRefreshing ] = useState(false)

  // Fetch tasks from API
  const fetchTasks = async () => {
    setIsLoading(true)
    try {
      // const response = await axios.get(`http://192.168.2.151:3001//tasks?status=pending`) // after testing, replace with api.get('/tasks?status=pending')
      const response = await api.get('/tasks') // Uncomment this line to use the API client
      setTasks(response.data)
      setError(null)
      } catch (error) {
        setError(JSON.stringify(error))
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
            <Text style={{ fontSize: moderateScale(16), color: colors.infoText }}>Loading tasks...</Text>
            ) : error ? (
            <Text style={{ fontSize: moderateScale(16), color: '#f00' }}>Error: {error}</Text>
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
    alignItems: 'center',
    paddingVertical: hp('3%'),
    alignSelf: 'center',
  },
})