# Featured Slot Checkout QA
- Timestamp: 2025-11-24T06:27:42.637Z
- Vendor Email: qa-featured-vendor@example.com
- Vendor ID: a46927e0-573e-4c04-ae29-d39fc5eb5d12
- Business Profile ID: a540388f-c015-4814-adce-544d0ce2d7c1
- Reserved Slot ID: 9ae717ce-397f-413a-a849-14ba41ff5040
- Checkout Session ID: cs_mock_1763965662072
- Slot Status After Webhook: active

```json
{
  "timestamp": "2025-11-24T06:27:42.637Z",
  "vendorEmail": "qa-featured-vendor@example.com",
  "vendorId": "a46927e0-573e-4c04-ae29-d39fc5eb5d12",
  "businessProfileId": "a540388f-c015-4814-adce-544d0ce2d7c1",
  "lgaId": 17,
  "reservationResponse": {
    "success": true,
    "data": {
      "checkoutUrl": "http://localhost:3000/mock-featured-checkout",
      "sessionId": "cs_mock_1763965662072",
      "reservedSlotId": "9ae717ce-397f-413a-a849-14ba41ff5040"
    }
  },
  "webhookResponse": {
    "received": true
  },
  "slotRecord": {
    "id": "9ae717ce-397f-413a-a849-14ba41ff5040",
    "status": "active",
    "stripe_payment_intent_id": "pi_mock_1763965662142",
    "start_date": "2025-11-24T06:27:42.072+00:00",
    "end_date": "2025-12-24T06:27:42.072+00:00",
    "lga_id": 17
  }
}
```
