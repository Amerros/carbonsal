// lib/db.js
import { Pool } from 'pg'

// Railway geeft automatisch DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

// Helper functions voor je Carbon Comply app
export const db = {
  // Users
  async createUser(email, passwordHash, companyName, industry, employees) {
    const query = `
      INSERT INTO users (email, password_hash, company_name, industry, employees)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, company_name, industry, employees, created_at
    `
    const result = await pool.query(query, [email, passwordHash, companyName, industry, employees])
    return result.rows[0]
  },

  async getUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1'
    const result = await pool.query(query, [email])
    return result.rows[0]
  },

  async getUserById(id) {
    const query = 'SELECT id, email, company_name, industry, employees, created_at FROM users WHERE id = $1'
    const result = await pool.query(query, [id])
    return result.rows[0]
  },

  // Calculations
  async saveCalculation(userId, companyData, results) {
    const query = `
      INSERT INTO calculations (user_id, company_data, results)
      VALUES ($1, $2, $3)
      RETURNING *
    `
    const result = await pool.query(query, [userId, JSON.stringify(companyData), JSON.stringify(results)])
    return result.rows[0]
  },

  async getUserCalculations(userId) {
    const query = `
      SELECT * FROM calculations 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `
    const result = await pool.query(query, [userId])
    return result.rows
  },

  async getCalculationById(id, userId) {
    const query = 'SELECT * FROM calculations WHERE id = $1 AND user_id = $2'
    const result = await pool.query(query, [id, userId])
    return result.rows[0]
  },

  // Subscriptions
  async createSubscription(userId, stripeCustomerId, stripeSubscriptionId, planName, status) {
    const query = `
      INSERT INTO subscriptions (user_id, stripe_customer_id, stripe_subscription_id, plan_name, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `
    const result = await pool.query(query, [userId, stripeCustomerId, stripeSubscriptionId, planName, status])
    return result.rows[0]
  },

  async updateSubscription(stripeSubscriptionId, status) {
    const query = `
      UPDATE subscriptions 
      SET status = $1 
      WHERE stripe_subscription_id = $2
      RETURNING *
    `
    const result = await pool.query(query, [status, stripeSubscriptionId])
    return result.rows[0]
  },

  async getUserSubscription(userId) {
    const query = 'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1'
    const result = await pool.query(query, [userId])
    return result.rows[0]
  },

  // Reports
  async saveReport(userId, calculationId, fileName, filePath) {
    const query = `
      INSERT INTO reports (user_id, calculation_id, file_name, file_path)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `
    const result = await pool.query(query, [userId, calculationId, fileName, filePath])
    return result.rows[0]
  },

  async getUserReports(userId) {
    const query = `
      SELECT r.*, c.company_data->>'companyName' as company_name
      FROM reports r
      JOIN calculations c ON r.calculation_id = c.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
    `
    const result = await pool.query(query, [userId])
    return result.rows
  },

  // Utility
  async query(text, params) {
    const result = await pool.query(text, params)
    return result.rows
  }
}

export default db
