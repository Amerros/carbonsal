import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '../../../lib/db'
import jwt from 'jsonwebtoken'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  try {
    const { priceId, planName, isAnnual } = await request.json()
    
    // Get user from auth token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await db.getUserById(decoded.userId)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create or get Stripe customer
    let customer
    const existingSubscription = await db.getUserSubscription(user.id)
    
    if (existingSubscription && existingSubscription.stripe_customer_id) {
      customer = await stripe.customers.retrieve(existingSubscription.stripe_customer_id)
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        name: user.company_name,
        metadata: {
          userId: user.id.toString(),
          companyName: user.company_name
        }
      })
    }

    // Price mapping
    const prices = {
      starter: {
        monthly: 4900, // €49.00
        annual: 39000  // €390.00 (€32.50/month)
      },
      professional: {
        monthly: 14900, // €149.00
        annual: 119000  // €1190.00 (€99.17/month)
      },
      enterprise: {
        monthly: 39900, // €399.00
        annual: 319000  // €3190.00 (€265.83/month)
      }
    }

    const planKey = planName.toLowerCase()
    const interval = isAnnual ? 'annual' : 'monthly'
    const unitAmount = prices[planKey]?.[interval]

    if (!unitAmount) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card', 'ideal'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Carbon Comply ${planName}`,
              description: `${planName} plan - ${isAnnual ? 'Yearly' : 'Monthly'} subscription`
            },
            unit_amount: unitAmount,
            recurring: {
              interval: isAnnual ? 'year' : 'month'
            }
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing?canceled=true`,
      metadata: {
        userId: user.id.toString(),
        planName,
        interval
      },
      subscription_data: {
        metadata: {
          userId: user.id.toString(),
          planName,
          interval
        }
      }
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })

  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
