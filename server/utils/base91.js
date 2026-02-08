// utils/base91.js
import baseX from 'base-x'

const BASE91_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~"'

export const base91 = baseX(BASE91_ALPHABET)