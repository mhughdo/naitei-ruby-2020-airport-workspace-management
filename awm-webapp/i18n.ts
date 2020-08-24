import NextI18Next, {WithTranslation as WithTranslationType} from 'next-i18next'
import path from 'path'

export const languages = ['en', 'vi']

const NextI18NextInstance = new NextI18Next({
  defaultLanguage: 'en',
  otherLanguages: ['vi'],
  localeSubpaths: {
    vi: 'vi',
  },
  backend: {
    loadPath:
      typeof window === 'undefined'
        ? path.join(process.cwd(), 'public/static/locales/{{lng}}/{{ns}}.json')
        : `/static/locales/{{lng}}/{{ns}}.json`,
  },
  serverLanguageDetection: false,
  browserLanguageDetection: false,
  load: 'languageOnly',
  defaultNS: 'common',
  debug: false,
  localePath:
    typeof window === 'undefined' ? 'public/static/locales' : 'static/locales',
  saveMissing: false,
})

export default NextI18NextInstance

export type WithTranslation = WithTranslationType

export const {
  appWithTranslation,
  withTranslation,
  Router,
  Link,
} = NextI18NextInstance
