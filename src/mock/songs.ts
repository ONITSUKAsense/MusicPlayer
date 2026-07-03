import type { Song, Playlist, Artist, Album, Comment, User } from '@/types/music'

// Cover placeholders (using picsum for demo)
const covers = [
  'https://picsum.photos/seed/song1/300/300',
  'https://picsum.photos/seed/song2/300/300',
  'https://picsum.photos/seed/song3/300/300',
  'https://picsum.photos/seed/song4/300/300',
  'https://picsum.photos/seed/song5/300/300',
]

const avatars = [
  'https://picsum.photos/seed/avatar1/100/100',
  'https://picsum.photos/seed/avatar2/100/100',
  'https://picsum.photos/seed/avatar3/100/100',
]

export const mockUser: User = {
  id: 1,
  username: 'demo_user',
  nickname: '音乐爱好者',
  avatar: avatars[0],
  email: 'demo@example.com',
  level: 5,
  isVip: true,
  followerCount: 1280,
  followingCount: 56,
}

export const mockSongs: Song[] = [
  { id: 1, title: '起风了', artist: '买辣椒也用券', artistId: 1, album: '起风了', albumId: 1, cover: covers[0], duration: 322, url: '/audio/sample1.mp3', lyric: '[00:00.00]起风了\n[00:05.00]演唱：买辣椒也用券\n[00:15.00]这一路上走走停停\n[00:30.00]顺着少年漂流的痕迹', genre: '流行' },
  { id: 2, title: '光年之外', artist: '邓紫棋', artistId: 2, album: '光年之外', albumId: 2, cover: covers[1], duration: 255, url: '/audio/sample2.mp3', lyric: '[00:00.00]光年之外\n[00:10.00]演唱：邓紫棋\n[00:20.00]感受停在我发端的指尖\n[00:35.00]如何瞬间冻结时间', genre: '流行' },
  { id: 3, title: '孤勇者', artist: '陈奕迅', artistId: 3, album: '孤勇者', albumId: 3, cover: covers[2], duration: 278, url: '/audio/sample3.mp3', lyric: '[00:00.00]孤勇者\n[00:08.00]演唱：陈奕迅\n[00:18.00]都是勇敢的\n[00:28.00]你额头的伤口', genre: '流行' },
  { id: 4, title: '泡沫', artist: '邓紫棋', artistId: 2, album: 'Xposed', albumId: 4, cover: covers[3], duration: 290, url: '/audio/sample4.mp3', lyric: '[00:00.00]泡沫\n[00:08.00]演唱：邓紫棋\n[00:16.00]阳光下的泡沫 是彩色的', genre: '流行' },
  { id: 5, title: '成都', artist: '赵雷', artistId: 4, album: '无法长大', albumId: 5, cover: covers[4], duration: 285, url: '/audio/sample5.mp3', lyric: '[00:00.00]成都\n[00:10.00]演唱：赵雷\n[00:20.00]让我掉下眼泪的 不止昨夜的酒', genre: '民谣' },
  { id: 6, title: '平凡之路', artist: '朴树', artistId: 5, album: '猎户星座', albumId: 6, cover: covers[0], duration: 295, url: '/audio/sample6.mp3', lyric: '[00:00.00]平凡之路\n[00:10.00]演唱：朴树\n[00:20.00]徘徊着的 在路上的', genre: '民谣' },
  { id: 7, title: 'Perfect', artist: 'Ed Sheeran', artistId: 6, album: 'Divide', albumId: 7, cover: covers[1], duration: 263, url: '/audio/sample7.mp3', lyric: '[00:00.00]Perfect\n[00:08.00]Ed Sheeran\n[00:16.00]I found a love for me', genre: 'Pop' },
  { id: 8, title: '夜曲', artist: '周杰伦', artistId: 7, album: '十一月的肖邦', albumId: 8, cover: covers[2], duration: 236, url: '/audio/sample8.mp3', lyric: '[00:00.00]夜曲\n[00:10.00]演唱：周杰伦\n[00:20.00]一群嗜血的蚂蚁 被腐肉所吸引', genre: '流行' },
  { id: 9, title: '晴天', artist: '周杰伦', artistId: 7, album: '叶惠美', albumId: 9, cover: covers[3], duration: 282, url: '/audio/sample9.mp3', lyric: '[00:00.00]晴天\n[00:08.00]演唱：周杰伦\n[00:16.00]故事的小黄花 从出生那年就飘着', genre: '流行' },
  { id: 10, title: 'Shape of You', artist: 'Ed Sheeran', artistId: 6, album: 'Divide', albumId: 7, cover: covers[4], duration: 234, url: '/audio/sample10.mp3', lyric: '[00:00.00]Shape of You\n[00:08.00]Ed Sheeran\n[00:16.00]The club isn\'t the best place to find a lover', genre: 'Pop' },
  { id: 11, title: '错位时空', artist: '艾辰', artistId: 8, album: '错位时空', albumId: 10, cover: covers[0], duration: 248, url: '/audio/sample11.mp3', lyric: '[00:00.00]错位时空\n[00:08.00]演唱：艾辰\n[00:16.00]填不满半排观众的电影', genre: '流行' },
  { id: 12, title: '赤伶', artist: 'HITA', artistId: 9, album: '赤伶', albumId: 11, cover: covers[1], duration: 265, url: '/audio/sample12.mp3', lyric: '[00:00.00]赤伶\n[00:08.00]演唱：HITA\n[00:16.00]戏一折 水袖起落', genre: '古风' },
]

export const mockArtists: Artist[] = [
  { id: 1, name: '买辣椒也用券', avatar: avatars[0], cover: covers[0], bio: '独立音乐人', genre: '流行', songCount: 15, albumCount: 3, followerCount: 50000, isFollowed: false },
  { id: 2, name: '邓紫棋', avatar: avatars[1], cover: covers[1], bio: 'G.E.M. 邓紫棋', genre: '流行', songCount: 80, albumCount: 10, followerCount: 5000000, isFollowed: true },
  { id: 3, name: '陈奕迅', avatar: avatars[2], cover: covers[2], bio: 'Eason Chan', genre: '流行', songCount: 200, albumCount: 30, followerCount: 8000000, isFollowed: false },
  { id: 4, name: '赵雷', avatar: avatars[0], cover: covers[3], bio: '民谣歌手', genre: '民谣', songCount: 40, albumCount: 5, followerCount: 200000, isFollowed: false },
  { id: 5, name: '朴树', avatar: avatars[1], cover: covers[4], bio: '朴树', genre: '民谣', songCount: 30, albumCount: 4, followerCount: 300000, isFollowed: true },
  { id: 6, name: 'Ed Sheeran', avatar: avatars[2], cover: covers[0], bio: 'British singer-songwriter', genre: 'Pop', songCount: 100, albumCount: 8, followerCount: 10000000, isFollowed: false },
  { id: 7, name: '周杰伦', avatar: avatars[0], cover: covers[1], bio: 'Jay Chou', genre: '流行', songCount: 300, albumCount: 40, followerCount: 15000000, isFollowed: true },
  { id: 8, name: '艾辰', avatar: avatars[1], cover: covers[2], bio: '网络歌手', genre: '流行', songCount: 25, albumCount: 4, followerCount: 100000, isFollowed: false },
  { id: 9, name: 'HITA', avatar: avatars[2], cover: covers[3], bio: '古风歌手', genre: '古风', songCount: 50, albumCount: 6, followerCount: 150000, isFollowed: false },
]

export const mockAlbums: Album[] = [
  { id: 1, title: '起风了', cover: covers[0], artist: '买辣椒也用券', artistId: 1, releaseDate: '2020-01-01', songCount: 1, songs: [mockSongs[0]] },
  { id: 2, title: '光年之外', cover: covers[1], artist: '邓紫棋', artistId: 2, releaseDate: '2017-01-01', songCount: 1, songs: [mockSongs[1]] },
  { id: 3, title: '孤勇者', cover: covers[2], artist: '陈奕迅', artistId: 3, releaseDate: '2021-01-01', songCount: 1, songs: [mockSongs[2]] },
  { id: 4, title: 'Xposed', cover: covers[3], artist: '邓紫棋', artistId: 2, releaseDate: '2012-07-01', songCount: 1, songs: [mockSongs[3]] },
  { id: 5, title: '无法长大', cover: covers[4], artist: '赵雷', artistId: 4, releaseDate: '2016-12-01', songCount: 1, songs: [mockSongs[4]] },
  { id: 6, title: '猎户星座', cover: covers[0], artist: '朴树', artistId: 5, releaseDate: '2017-04-01', songCount: 1, songs: [mockSongs[5]] },
  { id: 7, title: 'Divide', cover: covers[1], artist: 'Ed Sheeran', artistId: 6, releaseDate: '2017-03-03', songCount: 2, songs: [mockSongs[6], mockSongs[9]] },
  { id: 8, title: '十一月的肖邦', cover: covers[2], artist: '周杰伦', artistId: 7, releaseDate: '2005-11-01', songCount: 1, songs: [mockSongs[7]] },
  { id: 9, title: '叶惠美', cover: covers[3], artist: '周杰伦', artistId: 7, releaseDate: '2003-07-01', songCount: 1, songs: [mockSongs[8]] },
  { id: 10, title: '错位时空', cover: covers[4], artist: '艾辰', artistId: 8, releaseDate: '2021-01-01', songCount: 1, songs: [mockSongs[10]] },
  { id: 11, title: '赤伶', cover: covers[0], artist: 'HITA', artistId: 9, releaseDate: '2020-02-01', songCount: 1, songs: [mockSongs[11]] },
]

export const mockPlaylists: Playlist[] = [
  {
    id: 1, name: '热门推荐', cover: covers[0], description: '每天都有新发现', tags: ['流行', '精选'],
    songCount: 12, playCount: 50000, favoriteCount: 3200,
    creator: { id: 1, name: '音乐小编', avatar: avatars[0], cover: covers[0], bio: '', genre: '', songCount: 0, albumCount: 0, followerCount: 0, isFollowed: false },
    songs: mockSongs.slice(0, 5), createdAt: '2024-01-01',
  },
  {
    id: 2, name: '民谣之声', cover: covers[1], description: '听一首民谣，品一段故事', tags: ['民谣', '治愈'],
    songCount: 8, playCount: 35000, favoriteCount: 2100,
    creator: { id: 2, name: '民谣爱好者', avatar: avatars[1], cover: covers[1], bio: '', genre: '', songCount: 0, albumCount: 0, followerCount: 0, isFollowed: false },
    songs: [mockSongs[4], mockSongs[5]], createdAt: '2024-02-01',
  },
  {
    id: 3, name: '经典老歌', cover: covers[2], description: '那些年我们一起听过的歌', tags: ['经典', '怀旧'],
    songCount: 15, playCount: 80000, favoriteCount: 5600,
    creator: { id: 1, name: '音乐小编', avatar: avatars[0], cover: covers[0], bio: '', genre: '', songCount: 0, albumCount: 0, followerCount: 0, isFollowed: false },
    songs: mockSongs.slice(5, 10), createdAt: '2024-03-01',
  },
  {
    id: 4, name: '英文金曲', cover: covers[3], description: '精选英文好歌', tags: ['英文', 'Pop'],
    songCount: 10, playCount: 45000, favoriteCount: 2800,
    creator: { id: 3, name: '欧美控', avatar: avatars[2], cover: covers[2], bio: '', genre: '', songCount: 0, albumCount: 0, followerCount: 0, isFollowed: false },
    songs: [mockSongs[6], mockSongs[9]], createdAt: '2024-04-01',
  },
  {
    id: 5, name: '周杰伦专场', cover: covers[4], description: '周杰伦经典歌曲合集', tags: ['周杰伦', '经典'],
    songCount: 20, playCount: 120000, favoriteCount: 8900,
    creator: { id: 1, name: '音乐小编', avatar: avatars[0], cover: covers[0], bio: '', genre: '', songCount: 0, albumCount: 0, followerCount: 0, isFollowed: false },
    songs: [mockSongs[7], mockSongs[8]], createdAt: '2024-05-01',
  },
  {
    id: 6, name: '古风雅韵', cover: covers[0], description: '古风音乐精选', tags: ['古风', '中国风'],
    songCount: 8, playCount: 28000, favoriteCount: 1500,
    creator: { id: 2, name: '古风迷', avatar: avatars[1], cover: covers[1], bio: '', genre: '', songCount: 0, albumCount: 0, followerCount: 0, isFollowed: false },
    songs: [mockSongs[11]], createdAt: '2024-06-01',
  },
]

export const mockComments: Comment[] = [
  { id: 1, user: mockUser, content: '这首歌太好听了！', createdAt: '2024-01-15T10:30:00Z', likes: 128, replies: [] },
  { id: 2, user: { ...mockUser, id: 2, nickname: '音乐评论员', avatar: avatars[1] }, content: '每次听都有不同的感动', createdAt: '2024-01-16T14:20:00Z', likes: 56, replies: [] },
  { id: 3, user: { ...mockUser, id: 3, nickname: '夜猫子', avatar: avatars[2] }, content: '单曲循环中...', createdAt: '2024-01-17T23:00:00Z', likes: 32, replies: [] },
]
