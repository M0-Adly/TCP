# Deploying backend to Railway

1. Create a Railway project and add a MongoDB plugin or set `MONGO_URI` to a hosted MongoDB Atlas connection.
2. Set environment variables: `MONGO_URI` and `JWT_SECRET`.
3. Link your GitHub repo and add a deploy command: `npm run build && npm start`.
4. For quick testing, push to a branch and Railway will build automatically.

Note: Ensure `PORT` is either specified by Railway or default 4000 will be used.