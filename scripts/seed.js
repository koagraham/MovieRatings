import { Movie, Rating, User, db } from '../src/model.js';
import movieData from './data/movies.json' assert { type: 'json' };
import lodash from 'lodash'

console.log('Syncing database...');
await db.sync({ force: true });

console.log('Seeding database...');

const moviesInDB = await Promise.all(movieData.map((movie) => {
    const releaseDate = new Date(Date.parse(movie.releaseDate))
    const {title, overview, posterPath } = movie

    const newMovie = Movie.create({
        title,
        overview,
        posterPath,
        releaseDate
    })

    return newMovie
    })
)

const usersToCreate = []
for (let i = 0; i < 10; i++) {
    usersToCreate.push({email: `user${i}@test.com`, password: 'test'})
}

const usersInDB = await Promise.all(usersToCreate.map((user) => {
    const { email, password} = user

    const newUser = User.create({
        email,
        password
    })

    return newUser
}))

const ratingsInDB = await Promise.all(usersInDB.flatMap((user) => {
    const arr = lodash.sampleSize(moviesInDB, 10)
    const ratings = arr.map((movie) => {
        return Rating.create({
            score: lodash.random(1, 5),
            userId: user.userId,
            movieId: movie.movieId
        })
    })
    return ratings
})
)
console.log(ratingsInDB)

await db.close();
console.log('Finished seeding database!');