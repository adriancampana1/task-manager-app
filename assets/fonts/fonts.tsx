import { useFonts } from 'expo-font';

const LoadFonts = () => {
    return useFonts({
        'LexendDeca-Bold': require('../../assets/fonts/LexendDeca-Bold.ttf'),
        'LexendDeca-Medium': require('../../assets/fonts/LexendDeca-Medium.ttf'),
        'LexendDeca-Regular': require('../../assets/fonts/LexendDeca-Regular.ttf'),
        'LexendDeca-Light': require('../../assets/fonts/LexendDeca-Light.ttf'),
    });
};

export default LoadFonts;
