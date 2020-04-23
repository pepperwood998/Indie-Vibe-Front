const ROLE_GROUPS = {
  ALL: { roles: [] },
  GUEST: { roles: ['r-guess'], redirect: '/home' },
  CMS_GUEST: { roles: ['r-guess'], redirect: '/cms' },
  USER: {
    roles: ['r-free', 'r-premium', 'r-curator', 'r-artist', 'r-admin'],
    redirect: '/login'
  },
  FREE: { roles: ['r-free'], redirect: '/player/account' },
  PREMIUM: { roles: ['r-premium'], redirect: '/player/account' },
  ARTIST: { roles: ['r-artist'], redirect: '/player/home' },
  ADMIN: { roles: ['r-admin'], redirect: '/cms-login' }
};

const {
  ALL,
  GUEST,
  CMS_GUEST,
  USER,
  FREE,
  PREMIUM,
  ARTIST,
  ADMIN
} = ROLE_GROUPS;

export const ROUTES = {
  home: [['/', '/home'], ALL],
  premium: ['/premium', ALL],
  purchase: ['/purchase/:type/:packageType?', FREE],
  report: ['/report/:id', USER],
  login: ['/login', GUEST],
  register: ['/register', GUEST],
  logout: ['/logout', USER],
  activation: ['/activation', GUEST],
  resetPassword: ['/reset-password', GUEST],
  player: {
    home: [['/player', '/player/home'], USER],
    browse: {
      general: ['/player/browse', USER],
      genres: ['/player/browse/genres', USER],
      releases: ['/player/browse/releases', USER]
    },
    genre: ['/player/genre/:id', USER],
    genreType: ['/player/genre/:id/:type', USER],
    library: {
      general: ['/player/library/:id', USER],
      tracks: ['/player/library/:id/tracks', USER],
      playlists: ['/player/library/:id/playlists', USER],
      releases: ['/player/library/:id/releases', USER],
      artists: ['/player/library/:id/artists', USER],
      followings: ['/player/library/:id/followings', USER],
      followers: ['/player/library/:id/followers', USER]
    },
    search: {
      general: ['/player/search/:key', USER],
      tracks: ['/player/search/:key/tracks', USER],
      artists: ['/player/search/:key/artists', USER],
      releases: ['/player/search/:key/releases', USER],
      playlists: ['/player/search/:key/playlists', USER],
      profiles: ['/player/search/:key/profiles', USER],
      genres: ['/player/search/:key/genres', USER]
    },
    account: {
      info: ['/player/account', USER],
      password: ['/player/account/password', USER],
      settings: ['/player/account/settings', USER],
      baa: ['/player/account/baa', PREMIUM]
    },
    workspace: {
      releases: [['/player/workspace', '/player/workspace/releases'], ARTIST],
      statistics: ['/player/workspace/statistic', ARTIST],
      upload: ['/player/workspace/upload', ARTIST]
    },
    manage: ['/player/manage/:id', ARTIST],
    artist: {
      discography: ['/player/artist/:id', USER],
      about: ['/player/artist/:id/about', USER]
    },
    release: ['/player/release/:id', USER],
    playlist: ['/player/playlist/:id', USER],
    queue: ['/player/queue', USER]
  },
  cmsLogin: ['/cms-login', CMS_GUEST],
  cms: {
    dashboard: [['/cms', '/cms/dashboard'], ADMIN],
    requests: ['/cms/requests', ADMIN],
    requestDetails: ['/cms/request/:id', ADMIN],
    delegateCurator: ['/cms/delegate-curator', ADMIN],
    reports: ['/cms/reports', ADMIN],
    streaming: ['/cms/streaming', ADMIN],
    revenue: ['/cms/revenue', ADMIN]
  },
  notFound: ['/404', ALL]
};
