import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/pages/home/index.vue'),
        meta: { title: '首页', cache: true },
      },
      {
        path: 'explore/recommend',
        name: 'Recommend',
        component: () => import('@/pages/explore/recommend.vue'),
        meta: { title: '推荐音乐', cache: true },
      },
      {
        path: 'explore/charts',
        name: 'Charts',
        component: () => import('@/pages/explore/charts.vue'),
        meta: { title: '热门榜单', cache: true },
      },
      {
        path: 'explore/mv',
        name: 'MV',
        component: () => import('@/pages/explore/mv.vue'),
        meta: { title: 'MV专区', cache: true },
      },
      {
        path: 'playlists',
        name: 'Playlists',
        component: () => import('@/pages/playlist/list.vue'),
        meta: { title: '歌单', cache: true },
      },
      {
        path: 'playlist/:id',
        name: 'PlaylistDetail',
        component: () => import('@/pages/playlist/index.vue'),
        meta: { title: '歌单详情' },
      },
      {
        path: 'artists',
        name: 'Artists',
        component: () => import('@/pages/artist/list.vue'),
        meta: { title: '歌手', cache: true },
      },
      {
        path: 'artist/:id',
        name: 'ArtistDetail',
        component: () => import('@/pages/artist/index.vue'),
        meta: { title: '歌手' },
      },
      {
        path: 'albums',
        name: 'Albums',
        component: () => import('@/pages/album/list.vue'),
        meta: { title: '专辑', cache: true },
      },
      {
        path: 'album/:id',
        name: 'AlbumDetail',
        component: () => import('@/pages/album/index.vue'),
        meta: { title: '专辑' },
      },
      {
        path: 'search',
        name: 'Search',
        component: () => import('@/pages/search/index.vue'),
        meta: { title: '搜索', cache: true },
      },
      {
        path: 'search/result',
        name: 'SearchResult',
        component: () => import('@/pages/search/result.vue'),
        meta: { title: '搜索结果' },
      },
      {
        path: 'song/:id',
        name: 'SongDetail',
        component: () => import('@/pages/song/index.vue'),
        meta: { title: '歌曲详情' },
      },
      {
        path: 'user/profile',
        name: 'UserProfile',
        component: () => import('@/pages/user/profile.vue'),
        meta: { title: '用户主页', requiresAuth: true },
      },
      {
        path: 'user/messages',
        name: 'Messages',
        component: () => import('@/pages/user/messages.vue'),
        meta: { title: '消息中心', requiresAuth: true },
      },
      {
        path: 'user/settings',
        name: 'Settings',
        component: () => import('@/pages/user/settings.vue'),
        meta: { title: '设置' },
      },
      {
        path: 'collection/history',
        name: 'History',
        component: () => import('@/pages/collection/history.vue'),
        meta: { title: '最近播放' },
      },
      {
        path: 'collection/favorites',
        name: 'Favorites',
        component: () => import('@/pages/collection/favorites.vue'),
        meta: { title: '收藏', requiresAuth: true },
      },
      {
        path: 'collection/likes',
        name: 'Likes',
        component: () => import('@/pages/collection/likes.vue'),
        meta: { title: '喜欢', requiresAuth: true },
      },
      {
        path: 'collection/downloads',
        name: 'Downloads',
        component: () => import('@/pages/collection/downloads.vue'),
        meta: { title: '下载管理' },
      },
      {
        path: 'my/playlists',
        name: 'MyPlaylists',
        component: () => import('@/pages/playlist-manage/index.vue'),
        meta: { title: '我的歌单', requiresAuth: true },
      },
      {
        path: 'my/playlists/create',
        name: 'CreatePlaylist',
        component: () => import('@/pages/playlist-manage/create.vue'),
        meta: { title: '创建歌单', requiresAuth: true },
      },
    ],
  },
  {
    path: '/splash',
    name: 'Splash',
    component: () => import('@/pages/splash/index.vue'),
    meta: { title: '启动' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/auth/login.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/auth/register.vue'),
    meta: { title: '注册' },
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/pages/auth/forgot-password.vue'),
    meta: { title: '忘记密码' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/error/404.vue'),
    meta: { title: '404' },
  },
]

export default routes
