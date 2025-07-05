/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';


// Objective: Define the colors used in the application

const colors = {
    component: {
        stroke: '#464C55',
        bg: '#171717',
        input: 'rgba(70, 76, 85, 0.2)',
        green: {
            bg: 'rgba(76, 175, 80, 0.2)',
            text: '#FFFFFF',
        },
    },
    button: {
        primary: {
            bg: '#D9D9D9',
            text: '#000000',
            stroke: '#D9D9D9',
        },
        secondary: {
            bg: '#171717',
            text: '#D9D9D9',
            stroke: '#D9D9D9',
        },
        cancel: {
            bg: '#171717',
            text: '#FF0000',
            stroke: '#FF0000',
        },
    },
    progress: {
        bg: '#e0e0e0',
        stroke: '#c0c0c0',
        start: '#7ec8e3',        // CREATED
        pending: '#00bfff',      // PENDING
        inProgress: '#f39c12',   // IN_PROGRESS
        review: '#9b59b6',       // REVIEW
        success: '#27ae60',      // COMPLETED
        cancelled: '#e74c3c',    // CANCELLED
        rejected: '#e74c3c',     // DENIED
        accepted: '#27ae60',     // ACCEPTED
        neutral: '#f39c12',      // for waiting/undefined states
    },

    tag:{
        bg: '#E8F5E9',
        label: '#4CAF50',
    },
    text: {
        dark: '#000000',
        bright: '#FFFFFF',
        light: '#DDDDDD',
        green: '#4CAF50',
        red: '#FF0000',
        placeholder: '#A0A0A0',
    },
    star: {
        filled: '#DAA520',
        empty: '#464C55',
    },
    transparent: 'transparent',
    bg: '#171717',
    tint: tintColorLight,
    tabIconDefault: '#E5E4E2',
    tabIconSelected: '#FFFFFF',
    infoText: '#888',
    overlay: 'rgba(0, 0, 0, 0.7)',
}

export default colors;