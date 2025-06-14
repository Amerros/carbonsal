import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  try {
    const { calculationData, customerEmail, customerName, companyName } = await request.json()
    
    if (!calculationData) {
      return NextResponse.json({ error: 'Missing calculation data' }, { status: 400 })
    }

    // Create one-time payment session for PDF report
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'ideal'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Professioneel Carbon Footprint Rapport',
              description: `Uitgebreid 15+ pagina rapport voor ${companyName || 'uw bedrijf'} met AI-aanbevelingen, implementatie roadmap en compliance informatie.`,
              images: [], // Add product image URL if available
            },
            unit_amount: 5000, // €50.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment', // One-time payment, not subscription
      
      // Customer info
      customer_email: customerEmail,
      
      // Success/cancel URLs
      success_url: `${process.env.NEXT_PUBLIC_URL || 'https://carbonsal-production.up.railway.app'}/success?session_id={CHECKOUT_SESSION_ID}&type=onetime`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'https://carbonsal-production.up.railway.app'}?canceled=true`,
      
      // Metadata to store calculation data
      metadata: {
        type: 'onetime_pdf_report',
        companyName: companyName || 'Unknown',
        customerName: customerName || 'Unknown',
        calculationId: calculationData.calculationId || 'guest',
      },
      
      // Store calculation data in payment intent metadata (limited to 500 chars per key)
      payment_intent_data: {
        metadata: {
          emissions_total: calculationData.results?.emissions?.total?.toString() || '0',
          company_name: companyName || 'Unknown',
          industry: calculationData.companyInfo?.industry || 'Unknown',
          employees: calculationData.companyInfo?.employees?.toString() || '0',
        }
      },
      
      // Add automatic tax calculation if needed
      automatic_tax: { enabled: true },
      
      // Allow promotion codes
      allow_promotion_codes: true,
      
      // Invoice creation for business customers
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: `Carbon Footprint Rapport - ${companyName || 'Bedrijf'}`,
          metadata: {
            company: companyName || 'Unknown',
            report_date: new Date().toISOString(),
          },
          footer: 'Bedankt voor uw vertrouwen in Carbon Comply voor uw sustainability journey.',
        }
      },
      
      // Shipping for physical delivery (not applicable for digital product)
      shipping_address_collection: {
        allowed_countries: ['NL', 'BE', 'DE', 'FR'], // EU countries
      },
      
      // Custom fields for additional info
      custom_fields: [
        {
          key: 'vat_number',
          label: { type: 'custom', custom: 'BTW Nummer (optioneel)' },
          type: 'text',
          optional: true,
        }
      ],
      
      // Consent collection
      consent_collection: {
        terms_of_service: 'required',
      }
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      success: true
    })

  } catch (error) {
    console.error('One-time payment error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment session' },
      { status: 500 }
    )
  }
}

// Handle successful one-time payments
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session ID' }, { status: 400 })
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'customer']
    })

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

    // Extract calculation data from metadata
    const metadata = session.payment_intent.metadata
    const calculationData = {
      companyInfo: {
        name: metadata.company_name,
        industry: metadata.industry,
        employees: parseInt(metadata.employees) || 0
      },
      results: {
        emissions: {
          total: parseFloat(metadata.emissions_total) || 0
        }
      }
    }

    // Generate and return PDF
    const pdfResponse = await generatePDFForPayment(calculationData, session)
    
    return NextResponse.json({
      success: true,
      payment: {
        amount: session.amount_total / 100, // Convert from cents
        currency: session.currency,
        customer_email: session.customer_email,
      },
      download: {
        available: true,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      }
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}

async function generatePDFForPayment(calculationData, session) {
  // This would integrate with your PDF generation service
  // For now, return success - the actual PDF generation would happen
  // when the user clicks the download link after successful payment
  
  return {
    success: true,
    downloadUrl: `/api/download-paid-pdf/${session.id}`,
    filename: `Carbon-Report-${calculationData.companyInfo.name}-${Date.now()}.pdf`
  }
}
