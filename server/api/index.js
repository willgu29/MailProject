import { Router } from 'express'

import users from './users'
import mails from './mails'

const router = Router()

// Add USERS Routes
router.use(users)
router.use(mails)

export default router
