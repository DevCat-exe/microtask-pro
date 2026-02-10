import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from './lib/db';
import User from './models/User';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        await connectDB();
        
        const existingUser = await User.findOne({ email: profile.email });
        
        if (!existingUser) {
          const newUser = await User.create({
            name: profile.name,
            email: profile.email,
            googleId: profile.sub,
            photoUrl: profile.picture,
            role: 'worker', // Default role
          });
          return {
            id: newUser._id.toString(),
            name: newUser.name,
            email: newUser.email,
            image: newUser.photoUrl,
            role: newUser.role,
            coins: newUser.coins,
          };
        }
        
        return {
          id: existingUser._id.toString(),
          name: existingUser.name,
          email: existingUser.email,
          image: existingUser.photoUrl,
          role: existingUser.role,
          coins: existingUser.coins,
        };
      },
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectDB();
        
        const user = await User.findOne({ email: credentials?.email });
        
        if (!user) {
          throw new Error('No user found with this email');
        }

        if (!user.password) {
          throw new Error('This account uses Google Sign-In');
        }

        const isPasswordValid = await bcrypt.compare(
          (credentials?.password as string) || '',
          user.password!
        );

        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.photoUrl,
          role: user.role,
          coins: user.coins,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.coins = user.coins;
      }
      
      if (trigger === 'update' && session) {
        token.coins = session.coins;
        token.role = session.role;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.coins = token.coins as number;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
});