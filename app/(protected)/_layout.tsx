import { Stack, Redirect } from 'expo-router'
import colors from '@/constants/Colors'
import { useAuthStore } from '@/stores/authStore'

const ProtectedLayout = () => {

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    if (!isAuthenticated) {
        return <Redirect href="/login" />
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: colors.bg,
                },
            }}
        />
    )
}

export default ProtectedLayout