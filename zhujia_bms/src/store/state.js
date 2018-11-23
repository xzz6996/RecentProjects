import { getToken } from '@/utils/auth'
import { constRouters, asyncRouters} from '@/router'

const state = {
  token: getToken(),
  userId: '',
  name: '',
  roles: [],
  routers: constRouters,
  asyncRouters: [],
}

export default state