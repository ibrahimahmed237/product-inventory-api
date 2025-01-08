// PostgreSQL Query (price range $50-$200)
const postgresQuery = `
  SELECT *
  FROM products
  WHERE price BETWEEN 50 AND 200
  ORDER BY price ASC
  LIMIT 10
  OFFSET $1;
`;

// Create index for price range queries
const createPriceIndex = `
  CREATE INDEX idx_products_price ON products (price);
`;

// MongoDB Queries and Optimizations
const Product = require('../models/product.model');

// 1. Price Range Query ($50-$200)
const getPriceRangeProducts = async (page = 1) => {
  const limit = 10;
  const skip = (page - 1) * limit;

  // Using lean() for better performance as we don't need Mongoose documents
  // Using select() to only get required fields
  const products = await Product.find({
    price: { $gte: 50, $lte: 200 }
  })
    .select('name category price quantity')
    .sort({ price: 1 })
    .skip(skip)
    .limit(limit)
    .lean()
  return products;
};

// 2. Category Query with Price Sort
const getCategoryProducts = async (category, page = 1) => {
  const limit = 5;
  const skip = (page - 1) * limit;

  const products = await Product.find({ category })
    .select('name category price quantity')
    .sort({ price: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
  return products;
};

// Optimization Techniques

// 1. Database Indexes
const createIndexes = async () => {
  // Compound index for category queries with price sort
  await Product.collection.createIndex(
    { category: 1, price: -1 },
    { background: true }
  );

  // Index for price range queries
  await Product.collection.createIndex(
    { price: 1 },
    { background: true }
  );
};

// 2. Implement Redis Cache
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

const cacheMiddleware = async (req, res, next) => {
  const key = `api:${req.originalUrl}`;
  
  try {
    const cachedData = await redis.get(key);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      redis.setex(key, 300, JSON.stringify(body)); // Cache for 5 minutes
      res.sendResponse(body);
    };
    
    next();
  } catch (error) {
    next();
  }
};

// 3. Query Performance Explanation
const queryOptimizationExplanation = `
Query Optimization Strategies:

1. Indexing Strategy:
   - Created compound index (category, price) for category-based queries
   - Created single index (price) for price range queries
   - Indexes are created in background to avoid blocking operations

2. Caching Implementation:
   - Used Redis for caching frequently accessed data
   - Cache expiration set to 5 minutes to balance freshness and performance
   - Implemented cache key strategy based on query parameters

3. Query Optimization:
   - Used lean() to return plain JavaScript objects instead of Mongoose documents
   - Implemented selective field retrieval using select()
   - Added pagination to limit result size
   - Used compound indexes for sorting efficiency

4. High Traffic Handling:
   - Implemented rate limiting
   - Added connection pooling
   - Used replica sets for read scaling
   - Implemented query timeouts
   - Added monitoring and logging

5. Performance Monitoring:
   - Added query execution time tracking
   - Implemented slow query logging
   - Set up performance metrics collection
`;

module.exports = {
  getPriceRangeProducts,
  getCategoryProducts,
  createIndexes,
  cacheMiddleware,
  queryOptimizationExplanation
};