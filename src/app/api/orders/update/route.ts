import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';
import { v4 as uuidv4 } from 'uuid';

export async function PATCH(req: Request) {
  try {
    const {
      orderId,
      orderNumber,
      status,
      trackingNumber,
      carrier,
      shippingMethod,
      refundAmount,
      refundReason,
      refundItems,
      restockItems,
      notifyCustomer,
    } = await req.json();

    if (!orderId && !orderNumber) {
      return NextResponse.json(
        { error: "Missing order identifier" },
        { status: 400 }
      );
    }

    // Create a Supabase client
    const supabase = await createClient();

    // Prepare update data
    const updateData: any = {};
    
    // Update status if provided
    if (status) {
      updateData.status = status;
    }
    
    // Update tracking information if provided
    if (trackingNumber) {
      updateData.tracking_number = trackingNumber;
    }
    
    if (carrier) {
      updateData.shipping_carrier = carrier;
    }
    
    if (shippingMethod) {
      updateData.shipping_method = shippingMethod;
    }
    
    // Update the order
    let query = supabase.from('orders');
    
    if (orderId) {
      query = query.eq('id', orderId);
    } else if (orderNumber) {
      query = query.eq('order_number', orderNumber);
    }
    
    const { data: orderData, error: updateError } = await query
      .update(updateData)
      .select()
      .single();
    
    if (updateError) {
      console.error("Error updating order:", updateError);
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }
    
    // Process refund if refund amount is provided
    if (refundAmount && parseFloat(refundAmount) > 0) {
      // Create refund record
      const refundId = uuidv4();
      const refundNumber = `REF-${Date.now().toString().slice(-6)}`;
      
      const { error: refundError } = await supabase
        .from('refunds')
        .insert({
          id: refundId,
          order_id: orderData.id,
          refund_number: refundNumber,
          amount: parseFloat(refundAmount),
          reason: refundReason || 'Customer request',
          status: 'completed',
          refunded_items: refundItems || [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      
      if (refundError) {
        console.error("Error creating refund record:", refundError);
        return NextResponse.json(
          { error: "Failed to create refund record" },
          { status: 500 }
        );
      }
      
      // Update order status to reflect refund
      const { error: orderStatusError } = await supabase
        .from('orders')
        .update({
          status: refundItems && refundItems.length < orderData.order_items?.length ? 'partially_refunded' : 'refunded',
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderData.id);
      
      if (orderStatusError) {
        console.error("Error updating order status after refund:", orderStatusError);
      }
      
      // Restock items if requested
      if (restockItems && refundItems && refundItems.length > 0) {
        // In a real application, this would update inventory
        console.log("Restocking items:", refundItems);
      }
    }
    
    // Send notification if requested
    if (notifyCustomer) {
      // In a real application, this would send an email to the customer
      console.log("Sending notification to customer:", orderData.shipping_address.email);
    }
    
    return NextResponse.json({
      success: true,
      order: orderData
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Error updating order" },
      { status: 500 }
    );
  }
}
