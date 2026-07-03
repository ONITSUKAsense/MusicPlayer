import request from '../index'
import type { User } from '@/types/music'

export const authApi = {
  async login(username: string, password: string) {
    // Mock login
    await new Promise((r) => setTimeout(r, 500))
    if (username && password) {
      return {
        token: 'mock-token-' + Date.now(),
        user: {
          id: 1,
          username,
          nickname: username,
          avatar: 'https://picsum.photos/seed/avatar/100/100',
          email: `${username}@example.com`,
          level: 3,
          isVip: true,
          followerCount: 128,
          followingCount: 32,
        } as User,
      }
    }
    throw new Error('用户名或密码错误')
  },

  async register(username: string, password: string, email: string) {
    await new Promise((r) => setTimeout(r, 500))
    if (username && password && email) {
      return { success: true }
    }
    throw new Error('注册失败')
  },
}
