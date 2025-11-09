import { AppDataSource } from './data-source';

AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connected successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error connecting to database:', err);
    process.exit(1);
  });
