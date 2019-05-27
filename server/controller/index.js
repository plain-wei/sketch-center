const Skom = require('../lib/skoa');

const app = new Skom();

app.use(async(ctx, next) => {
  await next();
  console.warn('Step 1');
  ctx.body = 'Hello World';
});
app.use(async(ctx, next) => {
  await next();
  console.warn('Step 2');
});
app.use(async(ctx, next) => {
  await next();
  console.warn('Step 3');
});
app.listen(3000);
