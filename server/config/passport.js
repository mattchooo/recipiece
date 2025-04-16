const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

function authenticate(passport) {
    const authenticateUser = (email, password, done) => {
        console.log('Authenticating user:', email);

        User.findOne({ where: { email } })
            .then((user) => {
                console.log('User found in authenticateUser:', user);

                if (!user) {
                    console.log('Email not found.');
                    return done(null, false, { message: 'Email not found.' });
                }

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        console.log('Error comparing passwords:', err);
                        return done(err);
                    }

                    if (isMatch) {
                        console.log('Password matched.');
                        //console.log("Loaded API Key:", process.env.SENDGRID_API_KEY?.slice(0, 10));
                        return done(null, user);
                    } else {
                        console.log('Incorrect password.');
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                });
            })
            .catch((error) => {
                console.log('Error:', error);
                return done(error);
            });
    };

    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
            },
            authenticateUser
        )
    );

    // Serialize user to store user ID in session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Deserialize user by fetching from the database using user ID from the session
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findByPk(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
}

module.exports = authenticate;
