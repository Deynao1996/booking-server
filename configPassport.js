import passport from 'passport'
import GoogleStrategy from 'passport-google-oauth20'
import GitHubStrategy from 'passport-github2'
import bcrypt from 'bcryptjs'
import User from './models/User.js'

function findUserOrCreate(profile, cb) {
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(profile.id, salt)
  const handleMessage = 'Not provide'

  User.findOrCreate(
    {
      email: profile.emails?.[0].value,
      isVerified: true
    },
    {
      userName: profile.displayName || profile.username,
      email: profile.emails?.[0].value || handleMessage,
      lastName: profile.name?.familyName || handleMessage,
      name: profile.name?.givenName || handleMessage,
      password: hash,
      photo: profile.photos?.[0].value,
      passportId: profile.id,
      isVerified: profile.emails?.[0].value ? true : false
    }
  )
    .then((res) => cb(null, res))
    .catch((e) => cb(e, null))
}

export const configPassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/passport/google/callback'
      },
      function (_accessToken, _refreshToken, profile, cb) {
        findUserOrCreate(profile, cb)
      }
    )
  )

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/api/passport/github/callback'
      },
      function (_accessToken, _refreshToken, profile, cb) {
        findUserOrCreate(profile, cb)
      }
    )
  )
}
