import tinycolor from 'tinycolor2'

function generateColors(hex: string) {
    const baseLight = tinycolor('#ffffff')
    const baseDark = tinycolor(hex).toHex()
    const baseTriad = tinycolor(hex).tetrad()

    return {
        '50': tinycolor.mix(baseLight, hex, 12).toHexString(),
        '100': tinycolor.mix(baseLight, hex, 30).toHexString(),
        '200': tinycolor.mix(baseLight, hex, 50).toHexString(),
        '300': tinycolor.mix(baseLight, hex, 70).toHexString(),
        '400': tinycolor.mix(baseLight, hex, 85).toHexString(),
        '500': tinycolor.mix(baseLight, hex, 100).toHexString(),
        '600': tinycolor.mix(baseDark, hex, 87).toHexString(),
        '700': tinycolor.mix(baseDark, hex, 70).toHexString(),
        '800': tinycolor.mix(baseDark, hex, 54).toHexString(),
        '900': tinycolor.mix(baseDark, hex, 25).toHexString(),
        A100: tinycolor
            .mix(baseDark, baseTriad[3], 15)
            .saturate(80)
            .lighten(65)
            .toHexString(),
        A200: tinycolor
            .mix(baseDark, baseTriad[3], 15)
            .saturate(80)
            .lighten(55)
            .toHexString(),
        A400: tinycolor
            .mix(baseDark, baseTriad[3], 15)
            .saturate(100)
            .lighten(45)
            .toHexString(),
        A700: tinycolor
            .mix(baseDark, baseTriad[3], 15)
            .saturate(100)
            .lighten(40)
            .toHexString(),
        contrast: {
            '50': '#000000',
            '100': '#000000',
            '200': '#000000',
            '300': '#000000',
            '400': '#ffffff',
            '500': '#ffffff',
            '600': '#ffffff',
            '700': '#ffffff',
            '800': '#ffffff',
            '900': '#ffffff',
            A100: '#000000',
            A200: '#000000',
            A400: '#000000',
            A700: '#000000',
        },
    }
}

function generateColorVariations(defaultColor: string) {
    const defaultColorObj = tinycolor(defaultColor)

    const darkColor = defaultColorObj.clone().darken(2)
    const baseLight = tinycolor('#ffffff')
    const lightColor = tinycolor
        .mix(baseLight, defaultColorObj.toHex(), 12)
        .toHexString()
    const mediumColor = defaultColorObj.clone().lighten(26)

    return {
        default: defaultColorObj.toHexString(),
        dark: darkColor.toHexString(),
        light: lightColor,
        medium: mediumColor.toHexString(),
    }
}

function generateSelectionColor(defaultColor: string) {
    const defaultColorObj = tinycolor(defaultColor)
    const lightColor = defaultColorObj.lighten(8)
    return lightColor.toHexString()
}

export function generateTheme({
    primaryColor,
    fullLogoUrl,
    favIconUrl,
    logoIconUrl,
    websiteName,
}: {
    primaryColor: string
    fullLogoUrl: string
    favIconUrl: string
    logoIconUrl: string
    websiteName: string
}) {
    return {
        websiteName,
        colors: {
            avatar: '#515151',
            'blue-link': '#1890ff',
            danger: '#f94949',
            primary: generateColorVariations(primaryColor),
            warn: {
                default: '#f78a3b',
                light: '#fff6e4',
                dark: '#cc8805',
            },
            success: {
                default: '#14ae5c',
                light: '#3cad71',
            },
            selection: generateSelectionColor(primaryColor),
        },
        logos: {
            fullLogoUrl,
            favIconUrl,
            logoIconUrl,
        },
        materialPrimaryPalette: generateColors(primaryColor),
        materialWarnPalette: {
            '50': '#fee5e5',
            '100': '#fcbebe',
            '200': '#fa9393',
            '300': '#f76767',
            '400': '#f64747',
            '500': '#f42626',
            '600': '#f32222',
            '700': '#f11c1c',
            '800': '#ef1717',
            '900': '#ec0d0d',
            'A100': '#ffffff',
            'A200': '#ffe4e4',
            'A400': '#ffb1b1',
            'A700': '#ff9797',
            contrast: {
                '50': '#000000',
                '100': '#000000',
                '200': '#000000',
                '300': '#000000',
                '400': '#000000',
                '500': '#ffffff',
                '600': '#ffffff',
                '700': '#ffffff',
                '800': '#ffffff',
                '900': '#ffffff',
                A100: '#000000',
                A200: '#000000',
                A400: '#000000',
                A700: '#000000',
            },
        },
    }
}

export const defaultTheme = generateTheme({
    primaryColor: '#6e41e2',
    websiteName: 'PDS Workflow',
    fullLogoUrl: 'https://lh3.googleusercontent.com/p/AF1QipMe_TrAP-Ab3AcpNQRS0D7uOJk0tFFo9AOm7D2p=s680-w680-h510',
    favIconUrl: 'https://lh3.googleusercontent.com/p/AF1QipMe_TrAP-Ab3AcpNQRS0D7uOJk0tFFo9AOm7D2p=s680-w680-h510',
    logoIconUrl: 'https://lh3.googleusercontent.com/p/AF1QipMe_TrAP-Ab3AcpNQRS0D7uOJk0tFFo9AOm7D2p=s680-w680-h510',
})
