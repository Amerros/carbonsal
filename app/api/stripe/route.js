import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key', {
  apiVersion: '2023-10-16',
})

// Create checkout session
export async function POST(request) {
  try {
    const { priceId, planName, isAnnual, successUrl, cancelUrl } = await request.json()

    // Validate required fields
    if (!priceId || !planName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Price mapping for plans
    const prices = {
      starter: {
        monthly: 4900, // €49.00 in cents
        annual: 3900   // €39.00 in cents
      },
      professional: {
        monthly: 14900, // €149.00 in cents
        annual: 11900  // €119.00 in cents
      },
      enterprise: {
        monthly: 39900, // €399.00 in cents
        annual: 31900  // €319.00 in cents
      }
    }

    const planKey = planName.toLowerCase()
    const interval = isAnnual ? 'annual' : 'monthly'
    const unitAmount = prices[planKey]?.[interval]

    if (!unitAmount) {
      return NextResponse.json(
        { error: 'Invalid plan or billing interval' },
        { status: 400 }
      )
    }

    // Create product if it doesn't exist (in production, pre-create these)
    const product = await createOrGetProduct(planName, planKey)

    // Create price if it doesn't exist
    const price = await createOrGetPrice(product.id, unitAmount, interval)

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'ideal', 'bancontact'],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/pricing`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_creation: 'always',
      subscription_data: {
        metadata: {
          plan: planName,
          interval: interval,
        },
        trial_period_days: 14, // 14-day free trial
      },
      metadata: {
        plan: planName,
        interval: interval,
      },
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })

  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

// Handle webhooks
export async function PUT(request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    let event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object)
        break
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object)
        break
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object)
        break
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook handling error:', error)
    return NextResponse.json(
      { error: 'Webhook handling failed' },
      { status: 500 }
    )
  }
}

// Get customer portal session
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customer_id')

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID required' },
        { status: 400 }
      )
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/dashboard`,
    })

    return NextResponse.json({
      url: session.url,
    })

  } catch (error) {
    console.error('Customer portal error:', error)
    return NextResponse.json(
      { error: 'Failed to create customer portal session' },
      { status: 500 }
    )
  }
}

// Helper functions
async function createOrGetProduct(planName, planKey) {
  const productId = `carbon-comply-${planKey}`
  
  try {
    return await stripe.products.retrieve(productId)
  } catch (error) {
    if (error.code === 'resource_missing') {
      return await stripe.products.create({
        id: productId,
        name: `Carbon Comply ${planName}`,
        description: `Carbon Comply ${planName} subscription plan`,
        metadata: {
          plan: planKey
        }
      })
    }
    throw error
  }
}

async function createOrGetPrice(productId, unitAmount, interval) {
  const priceId = `${productId}-${interval}`
  
  try {
    return await stripe.prices.retrieve(priceId)
  } catch (error) {
    if (error.code === 'resource_missing') {
      return await stripe.prices.create({
        id: priceId,
        product: productId,
        unit_amount: unitAmount,
        currency: 'eur',
        recurring: {
          interval: interval === 'annual' ? 'year' : 'month',
        },
        metadata: {
          interval: interval
        }
      })
    }
    throw error
  }
}

async function handleCheckoutCompleted(session) {
  console.log('Checkout completed:', session.id)
  
  // In a real app, you would:
  // 1. Retrieve the customer and subscription
  // 2. Update your database with the new subscription
  // 3. Send welcome email
  // 4. Provision access to the platform
  
  try {
    const subscription = await stripe.subscriptions.retrieve(session.subscription)
    
    // Update database with subscription info
    // await updateUserSubscription(session.customer, subscription)
    
    // Send welcome email
    // await sendWelcomeEmail(session.customer_email, subscription.metadata.plan)
    
    console.log(`User ${session.customer} subscribed to ${subscription.metadata.plan}`)
  } catch (error) {
    console.error('Error handling checkout completion:', error)
  }
}

async function handleSubscriptionCreated(subscription) {
  console.log('Subscription created:', subscription.id)
  
  // Provision access, send confirmation
}

async function handleSubscriptionUpdated(subscription) {
  console.log('Subscription updated:', subscription.id)
  
  // Update user access levels, notify of changes
}

async function handleSubscriptionDeleted(subscription) {
  console.log('Subscription deleted:', subscription.id)
  
  // Revoke access, send cancellation email
}

async function handlePaymentSucceeded(invoice) {
  console.log('Payment succeeded:', invoice.id)
  
  // Extend subscription, send receipt
}

async function handlePaymentFailed(invoice) {
  console.log('Payment failed:', invoice.id)
  
  // Notify customer, attempt retry
}
