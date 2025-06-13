import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '../../../../lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
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
    return NextResponse.json({ error: 'Webhook handling failed' }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session) {
  try {
    const userId = parseInt(session.metadata.userId)
    const planName = session.metadata.planName
    const interval = session.metadata.interval

    if (session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription)
      
      await db.createSubscription(
        userId,
        session.customer,
        subscription.id,
        planName,
        'active'
      )
      
      console.log(`Subscription created for user ${userId}: ${planName}`)
    }
  } catch (error) {
    console.error('Error handling checkout completed:', error)
  }
}

async function handleSubscriptionCreated(subscription) {
  try {
    const userId = parseInt(subscription.metadata.userId)
    const planName = subscription.metadata.planName

    // Update or create subscription record
    await db.createSubscription(
      userId,
      subscription.customer,
      subscription.id,
      planName,
      subscription.status
    )

    console.log(`Subscription created: ${subscription.id}`)
  } catch (error) {
    console.error('Error handling subscription created:', error)
  }
}

async function handleSubscriptionUpdated(subscription) {
  try {
    await db.updateSubscription(subscription.id, subscription.status)
    console.log(`Subscription updated: ${subscription.id} - ${subscription.status}`)
  } catch (error) {
    console.error('Error handling subscription updated:', error)
  }
}

async function handleSubscriptionDeleted(subscription) {
  try {
    await db.updateSubscription(subscription.id, 'canceled')
    console.log(`Subscription canceled: ${subscription.id}`)
  } catch (error) {
    console.error('Error handling subscription deleted:', error)
  }
}

async function handlePaymentSucceeded(invoice) {
  try {
    if (invoice.subscription) {
      await db.updateSubscription(invoice.subscription, 'active')
      console.log(`Payment succeeded for subscription: ${invoice.subscription}`)
    }
  } catch (error) {
    console.error('Error handling payment succeeded:', error)
  }
}

async function handlePaymentFailed(invoice) {
  try {
    if (invoice.subscription) {
      await db.updateSubscription(invoice.subscription, 'past_due')
      console.log(`Payment failed for subscription: ${invoice.subscription}`)
    }
  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}
