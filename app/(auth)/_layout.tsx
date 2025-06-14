import { Stack, Redirect } from 'expo-router'
import colors from '@/constants/Colors'
import { useAuthStore } from '@/stores/authStore'

const AuthLayout = () => {

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    if (isAuthenticated) {
        return <Redirect href="/" />
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: colors.bg,
                },
                animation: 'fade_from_bottom',
            }}
        />
    )
}

export default AuthLayout