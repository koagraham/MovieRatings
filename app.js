import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import ViteExpress from 'vite-express';
import { Movie, Rating, User } from './src/model.js'

const app = express();
const port = '8000';
ViteExpress.config({ printViteDevServerHost: true });

function loginRequired(req, res, next) {
    if (!req.session.userId) {
        res.status(401).json({ error: 'Unauthorized' })
    }
    else {
        next()
    }
}

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: false }));

app.get('/api/movies', async (req, res) => {
    const movies = await Movie.findAll()
    res.json(movies)
})

app.get('/api/movies/:movieId', async (req, res) => {
    const { movieId } = req.params
    const movie = await Movie.findByPk(movieId)
    res.json(movie)
})

app.post('/api/auth', async (req, res) => {
    const { email, password } = req.body
    const auth = await User.findOne({
        where: { email: email, password: password}
    })
    if (auth && auth.email === email && auth.password === password) {
        req.session.userId = auth.userId
        res.json({success: true})
    }
    else {
        res.json({success: false})
    }
})

app.post('/api/logout', loginRequired, (req, res) => {
    req.session.destroy()
    res.json({success: true})
})

app.get('/api/ratings', loginRequired, async (req, res) => {
    const user = await User.findByPk(req.session.userId)
    const ratings = await user.getRatings({ include: {
        model: Movie,
        attributes: ['title']
    }})
    res.json(ratings)
})

//{"email":"user2@test.com",
//"password":"test"}

//{"movieId":17,
//"score":6}

app.post('/api/ratings', loginRequired, async (req, res) => {
    const user = await User.findByPk(req.session.userId)
    const newRating = await user.createRating({
        movieId: req.body.movieId,
        score: req.body.score
    })
    res.json(newRating)
})

ViteExpress.listen(app, port, () => console.log(`Server is listening on http://localhost:${port}`));
