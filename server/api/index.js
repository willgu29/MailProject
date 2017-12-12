import { Router } from 'express'

import users from './users'
import mails from './mails'
import campaigns from './campaigns'

const router = Router()

// Add USERS Routes
router.use(users)
router.use(mails)
router.use(campaigns)

export default router
