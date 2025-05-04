import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { Database } from '@/types/supabase';

export async function POST(req: Request) {
  try {
    const {
      cartItems,
      shippingData,
      paymentData,
      shippingMethod,
      subtotal,
      tax,
      shippingCost,
      discount,
      promoCode,
      totalAmount,
      userProfile: userProfileFromRequest,
      isGuestCheckout
    } = await req.json();

    if (!cartItems || !shippingData || !paymentData) {
      return NextResponse.json(
        { error: "Missing required order data" },
        { status: 400 }
      );
    }

    // Create a Supabase client using server components
    const supabaseServerClient = await createClient();

    // Get user ID from session if available
    let userId = '00000000-0000-0000-0000-000000000000'; // Default anonymous user ID

    if (isGuestCheckout) {
      console.log('Processing guest checkout');
      // Use the default anonymous user ID for guest checkouts
    } else if (userProfileFromRequest && !userProfileFromRequest.id.startsWith('temp-')) {
      // If we have a valid user profile from the request, use that ID
      userId = userProfileFromRequest.id;
      console.log('Using user ID from request:', userId);
    } else {
      try {
        // Get the session using the server client
        const { data: { session } } = await supabaseServerClient.auth.getSession();

        if (session?.user?.id) {
          userId = session.user.id;
          console.log('Using user ID from session:', userId);
        }
      } catch (error) {
        console.error('Error getting user session:', error);
        // Continue with anonymous user ID if there's an error
      }
    }

    // Generate a unique order number
    const generateOrderNumber = () => {
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const prefix = 'ORD';
      const year = new Date().getFullYear().toString().slice(-2);
      const month = (new Date().getMonth() + 1).toString().padStart(2, '0');

      return `${prefix}-${year}${month}-${timestamp}${random}`;
    };

    const orderNumber = generateOrderNumber();
    const orderId = uuidv4();

    // Create shipping address object
    const shippingAddress = {
      fullName: shippingData.fullName,
      email: shippingData.email,
      address: shippingData.address,
      city: shippingData.city,
      state: shippingData.state,
      zipCode: shippingData.zipCode,
      phone: shippingData.phone,
    };

    // Create payment info (mask sensitive data)
    const paymentInfo = {
      cardholderName: paymentData.cardholderName,
      cardNumber: `**** **** **** ${paymentData.cardNumber.slice(-4)}`,
      expiryDate: paymentData.expiryDate,
    };

    // Create a Supabase client
    const supabase = await createClient();

    // Insert order into database
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        profile_id: userId, // Use the user's ID if available
        order_number: orderNumber,
        status: 'processing',
        total_amount: totalAmount,
        subtotal: subtotal,
        tax: tax,
        shipping_cost: shippingCost,
        discount: discount || 0,
        promo_code: promoCode || null,
        payment_status: 'paid',
        payment_method: 'credit_card',
        shipping_method: shippingMethod,
        shipping_address: shippingAddress,
        payment_info: paymentInfo, // Store the masked payment info
        payment_intent_id: `sim_${Date.now().toString(36)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // Insert order items
    const orderItems = cartItems.map((item: any) => ({
      id: uuidv4(),
      order_id: orderId,
      product_id: item.id,
      product_name: item.name,
      product_image: item.image,
      quantity: item.quantity,
      price: item.price,
      size: item.size || null,
      color: item.color || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      return NextResponse.json(
        { error: "Failed to create order items" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: orderId,
      orderNumber: orderNumber
    });
  } catch (error) {
    console.error("Error processing order:", error);
    return NextResponse.json(
      { error: "Error processing order" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const orderNumber = url.searchParams.get('orderNumber');
    const userOrders = url.searchParams.get('userOrders');

    // Create a Supabase client using server components
    const supabaseServerClient = await createClient();

    // Get user ID from session if available
    let userId = null;

    try {
      // Get the session using the server client
      const { data: { session } } = await supabaseServerClient.auth.getSession();

      if (session?.user?.id) {
        userId = session.user.id;
      }
    } catch (error) {
      console.error('Error getting user session:', error);
    }

    // Create a Supabase client
    const supabase = await createClient();

    if (orderNumber) {
      // Get a specific order by order number
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .eq('order_number', orderNumber)
        .single();

      if (error) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(data);
    } else if (userOrders === 'true') {
      // Check if user is authenticated
      if (!userId) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }

      // Get orders for the current logged-in user
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .eq('profile_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Database error fetching user orders:", error);
        return NextResponse.json(
          { error: "Failed to fetch user orders" },
          { status: 500 }
        );
      }

      // If no orders found, return an empty array (not an error)
      if (!data || data.length === 0) {
        return NextResponse.json([]);
      }

      // Format the orders to match the expected structure in the OrderHistory component
      const formattedOrders = data.map(order => ({
        id: order.order_number,
        date: new Date(order.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        status: order.status,
        total: order.total_amount,
        items: order.order_items.map((item: any) => ({
          id: item.id,
          name: item.product_name,
          quantity: item.quantity,
          price: item.price,
          image: item.product_image
        })),
        trackingNumber: order.tracking_number || undefined
      }));

      return NextResponse.json(formattedOrders);
    } else {
      // Get all orders (with pagination in a real app)
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        return NextResponse.json(
          { error: "Failed to fetch orders" },
          { status: 500 }
        );
      }

      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Error fetching orders" },
      { status: 500 }
    );
  }
}
