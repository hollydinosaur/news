This server is hosted on heroku at: https://nc-news-server-holly.herokuapp.com/

I have created a list of all the current endpoints at: https://nc-news-server-holly.herokuapp.com/api

It is a news server which holds a number of articles about different topics. Users have the ability to make their own comments on the articles and can down or up vote for the articles based on their view of the article.
It has a number of facilities which allow you to access and filter the data as well as the option to delete a comment by id.

To clone the database, you will need to add the git repository https://github.com/hollydinosaur/news. Once this is git cloned, you will need to run the file through node.js with the following dependencies

- dot env
- node postgres (pg)
- express
- supertest

To access the tests, you will need to install jest, supertest and jest-sorted.

Before running the file you will need to create two .env files, one for testing and one for development, using the following syntax "PGDATABASE=database_name_here"

The minimum versions of the dependencies are as follows:

- dotenv 10.0.0
- express 4.17.1
- pg 8.7.1
- supertest 6.1.6
- jest 27.3.1
- node >= 0.6
