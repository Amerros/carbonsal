// lib/db.js - Enhanced version with profile management
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

// Railway-optimized Prisma configuration
export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'minimal',
})

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Railway connection pool management
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

// Enhanced helper functions for your Carbon Comply app
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

  // Enhanced user profile management
  async updateUserProfile(userId, profileData) {
    try {
      const user = await prisma.user.update({
        where: { id: parseInt(userId) },
        data: {
          companyName: profileData.companyName,
          industry: profileData.industry,
          employees: parseInt(profileData.employees) || 0,
          email: profileData.email,
          // Add location field to schema if needed
          updatedAt: new Date()
        },
        select: {
          id: true,
          email: true,
          companyName: true,
          industry: true,
          employees: true,
          createdAt: true,
          updatedAt: true
        }
      })
      return user
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  },

  async updateUserPassword(userId, newPasswordHash) {
    try {
      await prisma.user.update({
        where: { id: parseInt(userId) },
        data: {
          passwordHash: newPasswordHash,
          updatedAt: new Date()
        }
      })
      return true
    } catch (error) {
      console.error('Error updating user password:', error)
      throw error
    }
  },

  async deleteUser(userId) {
    try {
      // Delete user and all associated data (cascading deletes should handle this)
      await prisma.user.delete({
        where: { id: parseInt(userId) }
      })
      return true
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  },

  // Notification preferences
  async updateNotificationPreferences(userId, preferences) {
    try {
      // Store as JSON in user table or create separate table
      await prisma.user.update({
        where: { id: parseInt(userId) },
        data: {
          // Add notificationPreferences JSON field to schema
          // notificationPreferences: preferences,
          updatedAt: new Date()
        }
      })
      
      // For now, store in memory or return success
      return true
    } catch (error) {
      console.error('Error updating notification preferences:', error)
      throw error
    }
  },

  async getNotificationPreferences(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: {
          // notificationPreferences: true
        }
      })
      
      // Return default preferences for now
      return {
        emailReports: true,
        calculationReminders: true,
        complianceAlerts: true,
        marketingEmails: false
      }
    } catch (error) {
      console.error('Error getting notification preferences:', error)
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
        orderBy: { createdAt: 'desc' },
        take: 50
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
          userId: userId ? parseInt(userId) : undefined
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
        where: { 
          stripeSubscriptionId: stripeSubscriptionId || `user-${userId}-${Date.now()}`
        },
        update: {
          status,
          updatedAt: new Date()
        },
        create: {
          userId: parseInt(userId),
          stripeCustomerId,
          stripeSubscriptionId: stripeSubscriptionId || `user-${userId}-${Date.now()}`,
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
  async saveReport(userId, calculationId, fileName, reportType) {
    try {
      const report = await prisma.report.create({
        data: {
          userId: parseInt(userId),
          calculationId: parseInt(calculationId),
          fileName,
          filePath: `/reports/${fileName}`, // Virtual path for now
          reportType: reportType || 'subscription'
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
              companyData: true,
              results: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
      })
      
      // Format the response to match the expected structure
      return reports.map(report => ({
        ...report,
        company_name: report.calculation?.companyData?.companyName || 
                     report.calculation?.results?.companyInfo?.name || 'Unknown'
      }))
    } catch (error) {
      console.error('Error getting user reports:', error)
      throw error
    }
  },

  // Enhanced analytics and statistics
  async getUserStatistics(userId) {
    try {
      const [calculations, reports, subscription] = await Promise.all([
        prisma.calculation.findMany({
          where: { userId: parseInt(userId) },
          select: {
            id: true,
            results: true,
            createdAt: true
          }
        }),
        prisma.report.findMany({
          where: { userId: parseInt(userId) },
          select: { id: true }
        }),
        this.getUserSubscription(userId)
      ])

      // Calculate total CO2 and savings
      const totalEmissions = calculations.reduce((sum, calc) => {
        return sum + (calc.results?.emissions?.total || 0)
      }, 0)

      const totalSavings = calculations.reduce((sum, calc) => {
        return sum + (calc.results?.projectedSavings || 0)
      }, 0)

      const lastActivity = calculations.length > 0 
        ? new Date(calculations[0].createdAt)
        : null

      return {
        totalCalculations: calculations.length,
        totalReports: reports.length,
        totalEmissions: Math.round(totalEmissions * 100) / 100,
        totalSavings: Math.round(totalSavings * 100) / 100,
        lastActivity,
        subscriptionStatus: subscription?.status || 'free',
        subscriptionPlan: subscription?.planName || 'free'
      }
    } catch (error) {
      console.error('Error getting user statistics:', error)
      throw error
    }
  },

  // Health check for Railway
  async healthCheck() {
    try {
      // Simple connection test
      await prisma.$queryRaw`SELECT 1 as health`
      return { 
        status: 'healthy', 
        timestamp: new Date(),
        connection: 'Railway PostgreSQL',
        environment: process.env.RAILWAY_ENVIRONMENT || 'local'
      }
    } catch (error) {
      console.error('Database health check failed:', error)
      return { 
        status: 'unhealthy', 
        error: error.message,
        environment: process.env.RAILWAY_ENVIRONMENT || 'local'
      }
    }
  },

  // Data cleanup and maintenance
  async cleanupOldData(daysOld = 365) {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysOld)

      // Clean up old guest calculations (no userId)
      const deletedCalculations = await prisma.calculation.deleteMany({
        where: {
          userId: null,
          createdAt: {
            lt: cutoffDate
          }
        }
      })

      console.log(`Cleaned up ${deletedCalculations.count} old calculations`)
      return deletedCalculations.count
    } catch (error) {
      console.error('Error cleaning up old data:', error)
      throw error
    }
  }
}

export default db
