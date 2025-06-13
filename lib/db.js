// lib/db.js
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Helper functions for your Carbon Comply app
export const db = {
  // Users
  async createUser(email, passwordHash, companyName, industry, employees) {
    try {
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          companyName,
          industry,
          employees: parseInt(employees) || 0
        },
        select: {
          id: true,
          email: true,
          companyName: true,
          industry: true,
          employees: true,
          createdAt: true
        }
      })
      return user
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  },

  async getUserByEmail(email) {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      })
      return user
    } catch (error) {
      console.error('Error getting user by email:', error)
      throw error
    }
  },

  async getUserById(id) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        select: {
          id: true,
          email: true,
          companyName: true,
          industry: true,
          employees: true,
          createdAt: true
        }
      })
      return user
    } catch (error) {
      console.error('Error getting user by id:', error)
      throw error
    }
  },

  // Calculations
  async saveCalculation(userId, companyData, results) {
    try {
      const calculation = await prisma.calculation.create({
        data: {
          userId: parseInt(userId),
          companyData,
          results
        }
      })
      return calculation
    } catch (error) {
      console.error('Error saving calculation:', error)
      throw error
    }
  },

  async getUserCalculations(userId) {
    try {
      const calculations = await prisma.calculation.findMany({
        where: { userId: parseInt(userId) },
        orderBy: { createdAt: 'desc' }
      })
      return calculations
    } catch (error) {
      console.error('Error getting user calculations:', error)
      throw error
    }
  },

  async getCalculationById(id, userId) {
    try {
      const calculation = await prisma.calculation.findFirst({
        where: { 
          id: parseInt(id),
          userId: parseInt(userId)
        }
      })
      return calculation
    } catch (error) {
      console.error('Error getting calculation by id:', error)
      throw error
    }
  },

  // Subscriptions
  async createSubscription(userId, stripeCustomerId, stripeSubscriptionId, planName, status) {
    try {
      const subscription = await prisma.subscription.upsert({
        where: { stripeSubscriptionId: stripeSubscriptionId || 'none' },
        update: {
          status,
          updatedAt: new Date()
        },
        create: {
          userId: parseInt(userId),
          stripeCustomerId,
          stripeSubscriptionId,
          planName,
          status
        }
      })
      return subscription
    } catch (error) {
      console.error('Error creating subscription:', error)
      throw error
    }
  },

  async updateSubscription(stripeSubscriptionId, status) {
    try {
      const subscription = await prisma.subscription.update({
        where: { stripeSubscriptionId },
        data: { 
          status,
          updatedAt: new Date()
        }
      })
      return subscription
    } catch (error) {
      console.error('Error updating subscription:', error)
      throw error
    }
  },

  async getUserSubscription(userId) {
    try {
      const subscription = await prisma.subscription.findFirst({
        where: { userId: parseInt(userId) },
        orderBy: { createdAt: 'desc' }
      })
      return subscription
    } catch (error) {
      console.error('Error getting user subscription:', error)
      throw error
    }
  },

  // Reports
  async saveReport(userId, calculationId, fileName, filePath) {
    try {
      const report = await prisma.report.create({
        data: {
          userId: parseInt(userId),
          calculationId: parseInt(calculationId),
          fileName,
          filePath
        }
      })
      return report
    } catch (error) {
      console.error('Error saving report:', error)
      throw error
    }
  },

  async getUserReports(userId) {
    try {
      const reports = await prisma.report.findMany({
        where: { userId: parseInt(userId) },
        include: {
          calculation: {
            select: {
              companyData: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
      
      // Format the response to match the expected structure
      return reports.map(report => ({
        ...report,
        company_name: report.calculation.companyData.companyName || 'Unknown'
      }))
    } catch (error) {
      console.error('Error getting user reports:', error)
      throw error
    }
  },

  // Health check
  async healthCheck() {
    try {
      await prisma.$queryRaw`SELECT NOW()`
      return { status: 'healthy', timestamp: new Date() }
    } catch (error) {
      console.error('Database health check failed:', error)
      return { status: 'unhealthy', error: error.message }
    }
  }
}

export default db
