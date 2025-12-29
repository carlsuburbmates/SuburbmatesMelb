# Featured Slot Checkout QA
- Timestamp: 2025-11-23T13:23:57.733Z
- Vendor Email: qa-featured-vendor@example.com
- Vendor ID: a46927e0-573e-4c04-ae29-d39fc5eb5d12
- Business Profile ID: a540388f-c015-4814-adce-544d0ce2d7c1
- Reserved Slot ID: 5ba2f7f2-f3eb-44b5-b681-a937c17fe681
- Checkout Session ID: cs_mock_1763904237072
- Slot Status After Webhook: active

```json
{
  "timestamp": "2025-11-23T13:23:57.733Z",
  "vendorEmail": "qa-featured-vendor@example.com",
  "vendorId": "a46927e0-573e-4c04-ae29-d39fc5eb5d12",
  "businessProfileId": "a540388f-c015-4814-adce-544d0ce2d7c1",
  "lgaId": 17,
  "reservationResponse": {
    "success": true,
    "data": {
      "checkoutUrl": "http://localhost:3000/mock-featured-checkout",
      "sessionId": "cs_mock_1763904237072",
      "reservedSlotId": "5ba2f7f2-f3eb-44b5-b681-a937c17fe681"
    }
  },
  "webhookResponse": {
    "received": true
  },
  "slotRecord": {
    "id": "5ba2f7f2-f3eb-44b5-b681-a937c17fe681",
    "status": "active",
    "stripe_payment_intent_id": "pi_mock_1763904237121",
    "start_date": "2025-11-23T13:23:57.072+00:00",
    "end_date": "2025-12-23T13:23:57.072+00:00",
    "lga_id": 17
  }
}
```
