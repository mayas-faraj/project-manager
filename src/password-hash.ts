import crypto from 'crypto'
import dotenv from 'dotenv'

// read salt
dotenv.config()
const salt = process.env.SALT ?? ''

// password validation
const getPasswordHash = (password: string): string => {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
}

const validatePassword = (password: string, hash: string): boolean => {
  const passwordhash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return passwordhash === hash
}

// exporting
export { getPasswordHash, validatePassword }
