// Correct - passing a function
app.use(express.json());

// Correct - passing a router
app.use('/api', apiRouter);

// Correct - passing a middleware function
app.use((req, res, next) => {
  console.log('Middleware running');
  next();
});

// auth.js should have:
module.exports = (req, res, next) => {
  console.log('Middleware running');
  next();
};